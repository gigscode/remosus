import mammoth from 'mammoth'
import { NextResponse } from 'next/server'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const bucket = 'career-documents'
const maxDocumentSize = 10 * 1024 * 1024
const maxExtractedTextLength = 20000
const model = 'nvidia/nemotron-3.5-lightning:free'
const documentTypes = ['master-cv', 'content-writer', 'wordpress'] as const
type DocumentType = (typeof documentTypes)[number]

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function extractDocumentText(filename: string, bytes: ArrayBuffer) {
  const extension = filename.split('.').pop()?.toLowerCase()
  let text = ''

  if (extension === 'txt') {
    text = new TextDecoder().decode(bytes)
  } else if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) })
    text = result.value
  } else if (extension === 'pdf') {
    const loadingTask = getDocument({ data: new Uint8Array(bytes) })
    const pdf = await loadingTask.promise
    if (pdf.numPages > 25) {
      await loadingTask.destroy()
      throw new Error('This CV has more than 25 pages. Upload a shorter version to generate a draft.')
    }

    try {
      const pages: string[] = []
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber)
        const content = await page.getTextContent()
        pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '))
      }
      text = pages.join('\n')
    } finally {
      await loadingTask.destroy()
    }
  } else {
    throw new Error('Pitch generation supports PDF, DOCX, and TXT files. DOC files can be stored, but cannot be read for generation yet.')
  }

  const cleanedText = text.replace(/\u0000/g, '').trim()
  if (!cleanedText) throw new Error('No readable text was found in this CV. Try a text-based PDF, DOCX, or TXT file.')
  return cleanedText.slice(0, maxExtractedTextLength)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return responseError('Sign in again to generate a pitch.', 401)

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return responseError('OpenRouter is not configured on the server.', 503)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return responseError('Request body must be valid JSON.', 400)
  }

  if (!body || typeof body !== 'object') return responseError('Invalid pitch request.', 400)
  const values = body as Record<string, unknown>
  const { opportunityId, documentType, documentName } = values
  if (typeof opportunityId !== 'string' || opportunityId.length > 100) {
    return responseError('Choose an opportunity before generating a pitch.', 400)
  }
  if (typeof documentType !== 'string' || !documentTypes.includes(documentType as DocumentType)) {
    return responseError('Choose a valid CV category.', 400)
  }
  if (typeof documentName !== 'string' || documentName.length > 200 || documentName.includes('/')) {
    return responseError('Choose a saved PDF, DOCX, or TXT CV.', 400)
  }
  if (!/\.(pdf|docx|txt)$/i.test(documentName)) {
    return responseError('Pitch generation supports PDF, DOCX, and TXT files.', 400)
  }

  const [{ data: opportunity, error: opportunityError }, { data: documents, error: documentsError }] = await Promise.all([
    supabase
      .from('opportunities')
      .select('company_name, title, description')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single(),
    supabase.storage
      .from(bucket)
      .list(`${user.id}/${documentType}`, { limit: 50 }),
  ])

  if (opportunityError || !opportunity) return responseError('That opportunity could not be found in your account.', 404)
  if (documentsError) {
    console.error('Could not list career documents for pitch generation.', documentsError)
    return responseError('Could not access your saved CV. Try again shortly.', 500)
  }

  const document = documents?.find((item) => item.name === documentName && item.id !== null)
  if (!document) return responseError('That CV could not be found in your account. Refresh the page and try again.', 404)
  if (typeof document.metadata?.size === 'number' && document.metadata.size > maxDocumentSize) {
    return responseError('This CV exceeds the 10 MB generation limit.', 413)
  }

  const path = `${user.id}/${documentType}/${document.name}`
  const { data: file, error: downloadError } = await supabase.storage.from(bucket).download(path)
  if (downloadError || !file) {
    console.error('Could not download the selected career document.', downloadError)
    return responseError('Could not read your saved CV. Try uploading it again.', 500)
  }

  let cvText: string
  try {
    cvText = await extractDocumentText(document.name, await file.arrayBuffer())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not read the selected CV.'
    if (message.startsWith('This CV') || message.startsWith('No readable text') || message.startsWith('Pitch generation')) {
      return responseError(message, 400)
    }
    console.error('Could not extract text from the selected career document.', error)
    return responseError('Could not read this file. Try exporting it as a text-based PDF, DOCX, or TXT.', 400)
  }

  const jobDescription = (opportunity.description ?? '').slice(0, 12000)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)

  try {
    const providerResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'X-OpenRouter-Title': 'remosus',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: 'Write a concise, specific, truthful application or outreach email draft for the candidate. Use only evidence in the supplied CV and role description. Do not invent achievements, experience, metrics, contacts, or facts. Keep it under 160 words, include a useful subject line, and label the result as a draft.',
          },
          {
            role: 'user',
            content: [
              `Opportunity: ${opportunity.title} at ${opportunity.company_name}`,
              `Role description:\n${jobDescription || 'No role description was provided. Keep the draft grounded in the role title and CV only.'}`,
              `Selected CV text:\n${cvText}`,
            ].join('\n\n'),
          },
        ],
      }),
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!providerResponse.ok) {
      console.error('OpenRouter pitch request failed with status.', providerResponse.status)
      if (providerResponse.status === 429) {
        return responseError('The free model is rate-limited or temporarily busy. Wait a little and try again.', 429)
      }
      if (providerResponse.status === 401 || providerResponse.status === 403) {
        return responseError('OpenRouter rejected the server API key. Check OPENROUTER_API_KEY in the deployment environment.', 502)
      }
      return responseError('The AI provider could not generate a draft right now. Try again later.', 502)
    }

    const result: unknown = await providerResponse.json()
    if (!result || typeof result !== 'object' || !('choices' in result) || !Array.isArray(result.choices)) {
      return responseError('The AI provider returned an unexpected response. Try again later.', 502)
    }
    const firstChoice: unknown = result.choices[0]
    if (!firstChoice || typeof firstChoice !== 'object' || !('message' in firstChoice)
      || !firstChoice.message || typeof firstChoice.message !== 'object'
      || !('content' in firstChoice.message) || typeof firstChoice.message.content !== 'string') {
      return responseError('The AI provider returned an empty draft. Try again later.', 502)
    }

    return NextResponse.json({ draft: firstChoice.message.content, model }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return responseError('The AI request timed out. Try again.', 504)
    }
    console.error('OpenRouter pitch request failed.', error)
    return responseError('Could not reach the AI provider. Check your connection and try again.', 502)
  } finally {
    clearTimeout(timeout)
  }
}
