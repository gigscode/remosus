'use client'

import { useEffect, useState } from 'react'
import { BriefcaseBusiness, Check, Clipboard, LoaderCircle, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { Opportunity } from '@/components/dashboard'

const documentTypes = [
  { id: 'master-cv', label: 'Master CV' },
  { id: 'content-writer', label: 'Social media & content writer' },
  { id: 'wordpress', label: 'WordPress CV' },
] as const

type DocumentType = (typeof documentTypes)[number]['id']
type CareerDocument = { name: string; id: string | null }

export function PitchGenerator({ opportunities }: { opportunities: Opportunity[] }) {
  const [opportunityId, setOpportunityId] = useState('')
  const [documentType, setDocumentType] = useState<DocumentType>('master-cv')
  const [documents, setDocuments] = useState<CareerDocument[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState('')
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadDocuments() {
      setLoadingDocuments(true)
      setError('')
      setSelectedDocument('')
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        if (!cancelled) {
          setError('Sign in again to access your saved CVs.')
          setLoadingDocuments(false)
        }
        return
      }

      const { data, error: listError } = await supabase.storage
        .from('career-documents')
        .list(`${user.id}/${documentType}`, { limit: 50, sortBy: { column: 'updated_at', order: 'desc' } })
      if (cancelled) return
      if (listError) {
        setError(`Could not load saved CVs: ${listError.message}`)
        setDocuments([])
      } else {
        const supported = (data ?? [])
          .filter((file) => file.id !== null && /\.(pdf|docx|txt)$/i.test(file.name))
          .map((file) => ({ name: file.name, id: file.id }))
        setDocuments(supported)
        if (supported.length === 1) setSelectedDocument(supported[0].name)
      }
      setLoadingDocuments(false)
    }
    void loadDocuments()
    return () => { cancelled = true }
  }, [documentType])

  async function generatePitch() {
    setGenerating(true)
    setError('')
    setDraft('')
    try {
      const response = await fetch('/api/ai/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, documentType, documentName: selectedDocument }),
      })
      const result: unknown = await response.json()
      if (!response.ok) {
        const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
          ? result.error
          : 'Could not generate a draft.'
        throw new Error(message)
      }
      if (!result || typeof result !== 'object' || !('draft' in result) || typeof result.draft !== 'string') {
        throw new Error('The server returned an invalid draft.')
      }
      setDraft(result.draft)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not generate a draft.')
    } finally {
      setGenerating(false)
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Could not copy the draft. Select and copy the text manually.')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.85fr)]">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-800">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">Create a tailored draft</h2>
              <p className="mt-1 text-sm leading-5 text-slate-600">Use a saved opportunity and the most relevant CV to draft a short application email.</p>
            </div>
          </div>

          {opportunities.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-600">
              Add an opportunity first. Its title, company, and description will help ground the draft in the actual role.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Opportunity
                <select
                  value={opportunityId}
                  onChange={(event) => setOpportunityId(event.target.value)}
                  className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
                >
                  <option value="">Choose an opportunity</option>
                  {opportunities.map((opportunity) => (
                    <option key={opportunity.id} value={opportunity.id}>{opportunity.title} · {opportunity.company_name}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                CV category
                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value as DocumentType)}
                  className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
                >
                  {documentTypes.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Saved CV
                <select
                  value={selectedDocument}
                  onChange={(event) => setSelectedDocument(event.target.value)}
                  disabled={loadingDocuments || documents.length === 0}
                  className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm disabled:bg-slate-50"
                >
                  <option value="">{loadingDocuments ? 'Loading CVs…' : 'Choose a saved CV'}</option>
                  {documents.map((document) => (
                    <option key={document.name} value={document.name}>
                      {document.name.replace(/^[0-9a-f-]+-/i, '')}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-normal text-slate-500">
                  {documents.length === 0 && !loadingDocuments
                    ? 'No PDF, DOCX, or TXT CV found in this category. Add one in Profile.'
                    : 'PDF, DOCX, and TXT are supported for text extraction. DOC files can be stored but not read yet.'}
                </span>
              </label>

              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                The selected CV and opportunity details will be sent to OpenRouter and its model provider to create this draft. Don’t include information you do not want processed by those services.
              </div>
              {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={generating || loadingDocuments || !opportunityId || !selectedDocument}
                onClick={() => void generatePitch()}
              >
                {generating ? <LoaderCircle aria-hidden="true" data-icon="inline-start" className="animate-spin" /> : <Sparkles aria-hidden="true" data-icon="inline-start" />}
                {generating ? 'Drafting…' : 'Generate reviewable draft'}
              </Button>
              <p className="text-xs text-slate-500">Free model: NVIDIA Nemotron 3.5 Lightning · 500 output tokens maximum. Drafts are not saved or sent.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="min-h-80 border-slate-200 bg-white shadow-sm">
        <CardContent className="flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness aria-hidden="true" className="size-4 text-violet-800" />
              <h2 className="font-semibold text-slate-950">Your draft</h2>
            </div>
            {draft && <Badge variant="outline">Review before use</Badge>}
          </div>
          {draft ? (
            <>
              <label className="sr-only" htmlFor="pitch-draft">Generated pitch draft. Review and edit before use.</label>
              <textarea
                id="pitch-draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={5000}
                className="mt-4 min-h-64 flex-1 resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
              />
              <Button type="button" variant="outline" className="mt-3 self-start" onClick={() => void copyDraft()}>
                {copied ? <Check aria-hidden="true" data-icon="inline-start" /> : <Clipboard aria-hidden="true" data-icon="inline-start" />}
                {copied ? 'Copied' : 'Copy draft'}
              </Button>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                {generating ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : <BriefcaseBusiness aria-hidden="true" className="size-5" />}
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">{generating ? 'Writing a first draft…' : 'Your editable draft will appear here.'}</p>
              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Check every claim for accuracy before you use it. The AI can make mistakes.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
