import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const model = 'nvidia/nemotron-3.5-lightning:free'
const documentTypes = ['master-cv', 'content-writer', 'wordpress'] as const
type DocumentType = (typeof documentTypes)[number]

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
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
  const { opportunityId, documentType } = values

  if (typeof opportunityId !== 'string' || opportunityId.length > 100) {
    return responseError('Choose an opportunity before generating a pitch.', 400)
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
      .eq('doc_type', documentType)
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
              `CV text:\n${cvText.slice(0, 20000)}`,
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
        return responseError('The free model is rate-limited or temporarily busy. Wait a moment and try again.', 429)
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
    if (
      !firstChoice || typeof firstChoice !== 'object' ||
      !('message' in firstChoice) || !firstChoice.message ||
      typeof firstChoice.message !== 'object' ||
      !('content' in firstChoice.message) ||
      typeof firstChoice.message.content !== 'string'
    ) {
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
