import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const defaultModel = 'gemini-2.0-flash'
const fallbackModel = 'gemini-1.5-flash'
const configuredModel = process.env.GEMINI_MODEL || defaultModel

const documentTypes = ['master-cv', 'content-writer', 'wordpress'] as const
type DocumentType = (typeof documentTypes)[number]

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function callGemini(modelName: string, prompt: string, apiKey: string, signal: AbortSignal) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
        },
      }),
      signal,
      cache: 'no-store',
    },
  )
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return responseError('Sign in again to generate a cover letter.', 401)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return responseError('Gemini is not configured on the server. Set GEMINI_API_KEY in your environment.', 503)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return responseError('Request body must be valid JSON.', 400)
  }

  if (!body || typeof body !== 'object') return responseError('Invalid request.', 400)
  const values = body as Record<string, unknown>
  const { opportunityId, documentType } = values

  if (typeof opportunityId !== 'string' || opportunityId.length > 100) {
    return responseError('Choose an opportunity before generating.', 400)
  }
  if (typeof documentType !== 'string' || !documentTypes.includes(documentType as DocumentType)) {
    return responseError('Choose a valid CV category.', 400)
  }

  /* Read opportunity and CV text in parallel, both are fast DB reads */
  const [{ data: opportunity, error: opportunityError }, { data: profile, error: profileError }] = await Promise.all([
    supabase
      .from('opportunities')
      .select('company_name, title, description')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('career_profiles')
      .select('content')
      .eq('user_id', user.id)
      .eq('doc_type', documentType as DocumentType)
      .maybeSingle(),
  ])

  if (opportunityError || !opportunity) {
    return responseError('That opportunity could not be found in your account.', 404)
  }
  if (profileError) {
    return responseError('Could not read your saved CV text. Try again shortly.', 500)
  }

  const cvText = profile?.content?.trim() ?? ''
  if (!cvText) {
    return responseError('No CV text saved for this category yet. Go to Profile and paste your CV text there first.', 400)
  }

  const jobDescription = (opportunity.description ?? '').slice(0, 8000)

  const prompt = [
    'Write ONE short cover letter paragraph (4-6 sentences, under 120 words) for a job application form.',
    'Use only facts from the CV and role description below. Do not invent experience, skills, or achievements.',
    'Write in first person. No greeting, no sign-off. Plain text only, no markdown.',
    '',
    `Role: ${opportunity.title} at ${opportunity.company_name}`,
    jobDescription ? `Job description:\n${jobDescription}` : 'No job description provided.',
    `My CV:\n${cvText.slice(0, 15000)}`,
  ].join('\n')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    let activeModel = configuredModel
    let providerResponse = await callGemini(activeModel, prompt, apiKey, controller.signal)

    /* If the requested model is not found (404), attempt automatic fallback to gemini-1.5-flash */
    if (providerResponse.status === 404 && activeModel !== fallbackModel) {
      console.warn(`Gemini model ${activeModel} returned 404, falling back to ${fallbackModel}`)
      activeModel = fallbackModel
      providerResponse = await callGemini(activeModel, prompt, apiKey, controller.signal)
    }

    if (!providerResponse.ok) {
      const errBody: unknown = await providerResponse.json().catch(() => null)
      console.error('Gemini request failed with status.', providerResponse.status, JSON.stringify(errBody))
      if (providerResponse.status === 429) {
        return responseError('Rate limit reached. Wait a moment and try again.', 429)
      }
      if (providerResponse.status === 400) {
        const errorMsg = (errBody as { error?: { message?: string } })?.error?.message ?? ''
        if (errorMsg.toLowerCase().includes('api key')) {
          return responseError('Gemini rejected the API key. Verify GEMINI_API_KEY in your deployment environment.', 502)
        }
        return responseError('Gemini rejected the request. Check your CV text and try again.', 400)
      }
      if (providerResponse.status === 403) {
        return responseError('Gemini rejected the API key or permissions. Check GEMINI_API_KEY in the deployment environment.', 502)
      }
      if (providerResponse.status === 404) {
        return responseError(`Gemini model "${activeModel}" was not found. Please use a supported model such as gemini-2.0-flash or gemini-1.5-flash.`, 502)
      }
      return responseError('The AI provider could not generate a cover letter right now. Try again later.', 502)
    }

    const result: unknown = await providerResponse.json()

    /* Gemini response shape: { candidates: [{ content: { parts: [{ text: "..." }] } }] } */
    const text =
      result &&
      typeof result === 'object' &&
      'candidates' in result &&
      Array.isArray((result as { candidates: unknown[] }).candidates) &&
      (result as { candidates: unknown[] }).candidates.length > 0 &&
      typeof (result as { candidates: { content?: { parts?: { text?: string }[] } }[] }).candidates[0]?.content?.parts?.[0]?.text === 'string'
        ? (result as { candidates: { content: { parts: { text: string }[] } }[] }).candidates[0].content.parts[0].text
        : null

    if (!text) {
      console.error('Gemini returned an unexpected response shape.', JSON.stringify(result).slice(0, 500))
      return responseError('The AI provider returned an empty response. Try again later.', 502)
    }

    return NextResponse.json(
      { draft: text.trim(), model: activeModel },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return responseError('The request timed out. Try again.', 504)
    }
    console.error('Gemini request failed.', error)
    return responseError('Could not reach the AI provider. Check your connection and try again.', 502)
  } finally {
    clearTimeout(timeout)
  }
}
