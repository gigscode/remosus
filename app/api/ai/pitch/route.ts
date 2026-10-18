import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const model = 'llama-3.1-8b-instant'
const documentTypes = ['master-cv', 'content-writer', 'wordpress'] as const
type DocumentType = (typeof documentTypes)[number]

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return responseError('Sign in again to generate a cover letter.', 401)

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return responseError('Groq is not configured on the server.', 503)

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

  /* Read opportunity and CV text in parallel — both are fast DB reads */
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
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    const providerResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `You write cover letter paragraphs for job applications.
Write ONE short paragraph (4-6 sentences, under 120 words) that the applicant can paste into a job application form's "Cover letter" or "Tell us about yourself" field.
Rules:
- Use only facts from the CV and role description provided. Do not invent experience, skills, or achievements.
- Be specific about why this person fits this role.
- Write in first person as the applicant.
- No greeting, no sign-off, no subject line. Just the paragraph.
- Plain text only, no markdown.`,
          },
          {
            role: 'user',
            content: [
              `Role: ${opportunity.title} at ${opportunity.company_name}`,
              jobDescription ? `Job description:\n${jobDescription}` : 'No job description provided.',
              `My CV:\n${cvText.slice(0, 15000)}`,
            ].join('\n\n'),
          },
        ],
      }),
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!providerResponse.ok) {
      console.error('Groq request failed with status.', providerResponse.status)
      if (providerResponse.status === 429) {
        return responseError('Rate limit reached. Wait a moment and try again.', 429)
      }
      if (providerResponse.status === 401 || providerResponse.status === 403) {
        return responseError('Groq rejected the API key. Check GROQ_API_KEY in the deployment environment.', 502)
      }
      return responseError('The AI provider could not generate a draft right now. Try again later.', 502)
    }

    const result: unknown = await providerResponse.json()
    if (
      !result || typeof result !== 'object' ||
      !('choices' in result) || !Array.isArray(result.choices)
    ) {
      return responseError('The AI provider returned an unexpected response. Try again later.', 502)
    }
    const firstChoice: unknown = result.choices[0]
    if (
      !firstChoice || typeof firstChoice !== 'object' ||
      !('message' in firstChoice) || !firstChoice.message ||
      typeof firstChoice.message !== 'object' ||
      !('content' in firstChoice.message) ||
      typeof firstChoice.message.content !== 'string'
    ) {
      return responseError('The AI provider returned an empty response. Try again later.', 502)
    }

    return NextResponse.json(
      { draft: firstChoice.message.content, model },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return responseError('The request timed out. Try again.', 504)
    }
    console.error('Groq request failed.', error)
    return responseError('Could not reach the AI provider. Check your connection and try again.', 502)
  } finally {
    clearTimeout(timeout)
  }
}
