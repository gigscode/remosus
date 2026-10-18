import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const documentTypes = ['master-cv', 'content-writer', 'wordpress'] as const
type DocumentType = (typeof documentTypes)[number]

function responseError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

/* Cache the last confirmed working model name in memory across requests in this serverless instance */
let cachedWorkingModel: string | null = null

/**
 * Dynamically queries Google's Generative Language API to discover which models
 * are currently available and authorized for this specific API key.
 */
async function discoverWorkingModels(apiKey: string): Promise<string[]> {
  for (const apiVersion of ['v1beta', 'v1'] as const) {
    try {
      const url = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${encodeURIComponent(apiKey)}`
      const res = await fetch(url, {
        headers: { 'x-goog-api-key': apiKey },
        cache: 'no-store',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        console.error(`Gemini models list (${apiVersion}) returned status ${res.status}:`, JSON.stringify(err))
        continue
      }
      const data = (await res.json()) as {
        models?: { name?: string; supportedGenerationMethods?: string[] }[]
      }
      if (Array.isArray(data.models) && data.models.length > 0) {
        const generateModels = data.models
          .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map((m) => (m.name || '').replace(/^models\//, ''))
          .filter(Boolean)

        if (generateModels.length > 0) {
          /* Sort flash and lightweight models first, followed by others */
          return generateModels.sort((a, b) => {
            const aScore = a.includes('flash') ? 0 : 1
            const bScore = b.includes('flash') ? 0 : 1
            return aScore - bScore
          })
        }
      }
    } catch (error) {
      console.error(`Failed to query Gemini models list (${apiVersion}):`, error)
    }
  }
  return []
}

/**
 * Execute generateContent against a specific Gemini model
 */
async function executeGeminiRequest(
  modelName: string,
  prompt: string,
  apiKey: string,
  signal: AbortSignal,
  apiVersion: 'v1beta' | 'v1' = 'v1beta',
) {
  const cleanModel = modelName.replace(/^models\//, '')
  const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${cleanModel}:generateContent?key=${encodeURIComponent(apiKey)}`

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
      },
    }),
    signal,
    cache: 'no-store',
  })
}

/**
 * Extract generated text safely, taking into account reasoning / thinking tokens
 */
function extractGeminiText(result: unknown): string | null {
  if (!result || typeof result !== 'object') return null
  const candidates = (result as { candidates?: unknown[] }).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) return null

  const firstCandidate = candidates[0] as {
    content?: { parts?: { text?: string; thought?: boolean }[] }
  }
  const parts = firstCandidate?.content?.parts
  if (!Array.isArray(parts) || parts.length === 0) return null

  /* Filter out thought parts from reasoning models if present */
  const answerParts = parts.filter((part) => !part.thought && typeof part.text === 'string')
  let rawText = ''
  if (answerParts.length > 0) {
    rawText = answerParts.map((p) => p.text?.trim() || '').filter(Boolean).join('\n\n')
  } else {
    for (const part of parts) {
      if (typeof part.text === 'string' && part.text.trim()) {
        rawText = part.text.trim()
        break
      }
    }
  }

  if (!rawText) return null

  /* Strip wrapping quotes if the model wrapped the paragraph in quotation marks */
  return rawText.replace(/^["'“”]+|["'“”]+$/g, '').trim()
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return responseError('Sign in again to generate a cover letter.', 401)

  const apiKey = (process.env.GEMINI_API_KEY || '').trim()
  if (!apiKey) {
    return responseError('Gemini is not configured on the server. Set GEMINI_API_KEY in your environment variables.', 503)
  }

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
    'Write a strong, complete cover letter paragraph (4 to 6 complete sentences, approximately 100-140 words) that an applicant can paste into a job application form.',
    'Highlight relevant skills and direct experience from the CV that align with the role description below. Do not invent experience, skills, or metrics.',
    'Write in the first person ("I"). Do not include any greeting, subject line, or sign-off. Ensure all sentences are fully completed. Output plain text only without markdown.',
    '',
    `Target Role: ${opportunity.title} at ${opportunity.company_name}`,
    jobDescription ? `Job Description:\n${jobDescription}` : 'No job description provided.',
    `Candidate CV:\n${cvText.slice(0, 15000)}`,
  ].join('\n')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  try {
    /* Determine candidate models to attempt in order */
    const candidateModels: string[] = []

    /* 1. If explicit env variable GEMINI_MODEL is set, check it first */
    if (process.env.GEMINI_MODEL?.trim()) {
      candidateModels.push(process.env.GEMINI_MODEL.trim())
    }

    /* 2. If we already found a working model in a previous request, reuse it */
    if (cachedWorkingModel) {
      candidateModels.push(cachedWorkingModel)
    }

    /* 3. Common production model identifiers */
    candidateModels.push('gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b')

    /* Deduplicate candidate list */
    const uniqueCandidates = Array.from(new Set(candidateModels))

    let workingResponse: Response | null = null
    let chosenModel = uniqueCandidates[0]
    let lastErrorBody: unknown = null

    for (const modelCandidate of uniqueCandidates) {
      try {
        const res = await executeGeminiRequest(modelCandidate, prompt, apiKey, controller.signal, 'v1beta')
        if (res.ok) {
          workingResponse = res
          chosenModel = modelCandidate
          cachedWorkingModel = modelCandidate
          break
        }

        /* If 404, this specific model name does not exist for this key/version; continue to next candidate */
        if (res.status === 404) {
          console.warn(`Model ${modelCandidate} returned 404 on v1beta, trying next candidate...`)
          /* Also try v1 endpoint before giving up on this candidate */
          const resV1 = await executeGeminiRequest(modelCandidate, prompt, apiKey, controller.signal, 'v1')
          if (resV1.ok) {
            workingResponse = resV1
            chosenModel = modelCandidate
            cachedWorkingModel = modelCandidate
            break
          }
          continue
        }

        /* If 400 or 403, it could be an invalid key or permission issue. Capture error and break */
        lastErrorBody = await res.json().catch(() => null)
        console.error(`Gemini request failed on model ${modelCandidate} with status ${res.status}:`, JSON.stringify(lastErrorBody))
        workingResponse = res
        chosenModel = modelCandidate
        break
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') throw err
        console.warn(`Attempt with model ${modelCandidate} encountered error:`, err)
      }
    }

    /* If all standard candidates returned 404, dynamically query Google's model list for this key */
    if (!workingResponse || workingResponse.status === 404) {
      console.log('Querying Google for list of models enabled on this API key...')
      const discoveredModels = await discoverWorkingModels(apiKey)
      console.log('Discovered models for key:', discoveredModels)

      for (const discovered of discoveredModels) {
        const res = await executeGeminiRequest(discovered, prompt, apiKey, controller.signal, 'v1beta')
        if (res.ok) {
          workingResponse = res
          chosenModel = discovered
          cachedWorkingModel = discovered
          break
        }
      }
    }

    if (!workingResponse || !workingResponse.ok) {
      const status = workingResponse?.status ?? 502
      const errBody = lastErrorBody || (workingResponse ? await workingResponse.json().catch(() => null) : null)
      console.error('Final Gemini request failed with status.', status, JSON.stringify(errBody))

      const errorObj = errBody as { error?: { message?: string; status?: string } } | null
      const detailedMessage = errorObj?.error?.message ?? ''

      if (status === 429) {
        return responseError('Rate limit reached on Google Gemini. Wait a moment and try again.', 429)
      }
      if (status === 400) {
        if (detailedMessage.toLowerCase().includes('api key') || detailedMessage.toLowerCase().includes('invalid')) {
          return responseError(`Gemini API key error: ${detailedMessage}`, 502)
        }
        return responseError(detailedMessage ? `Gemini rejected request: ${detailedMessage}` : 'Check your CV text and try again.', 400)
      }
      if (status === 403) {
        return responseError(
          detailedMessage
            ? `Gemini permission error: ${detailedMessage}`
            : 'Gemini rejected the API key or Generative Language API is disabled. Verify GEMINI_API_KEY in Vercel.',
          502,
        )
      }
      if (status === 404) {
        return responseError(
          'No compatible Gemini model found for this API key. Verify that "Generative Language API" is enabled in your Google Cloud / AI Studio project.',
          502,
        )
      }
      return responseError(
        detailedMessage
          ? `Gemini error: ${detailedMessage}`
          : 'Google Gemini could not generate a response right now. Try again shortly.',
        502,
      )
    }

    const result: unknown = await workingResponse.json()
    const text = extractGeminiText(result)

    if (!text) {
      console.error('Gemini returned an unexpected response shape.', JSON.stringify(result).slice(0, 500))
      return responseError('The AI provider returned an empty response. Try again later.', 502)
    }

    return NextResponse.json(
      { draft: text.trim(), model: chosenModel },
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
