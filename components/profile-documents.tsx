'use client'

import { useEffect, useState, type ChangeEvent } from 'react'
import { FileText, LoaderCircle, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const bucket = 'career-documents'
const maxFileSize = 10 * 1024 * 1024

const documentTypes = [
  {
    id: 'master-cv',
    title: 'Master CV',
    description: 'Your complete work history and core skills.',
  },
  {
    id: 'content-writer',
    title: 'Social media & content writer',
    description: 'Writing, content strategy, social media, and UGC work.',
  },
  {
    id: 'wordpress',
    title: 'WordPress CV',
    description: 'WordPress, Shopify, and website projects.',
  },
] as const

type DocumentType = (typeof documentTypes)[number]['id']
type StoredDocument = {
  name: string
  id: string | null
  updated_at: string | null
  metadata: { size?: number } | null
}
type DocumentsByType = Record<DocumentType, StoredDocument[]>

const emptyDocuments: DocumentsByType = {
  'master-cv': [],
  'content-writer': [],
  wordpress: [],
}

const contentTypes: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
}

function formatFileSize(size?: number) {
  if (size === undefined) return 'Size unavailable'
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function ProfileDocuments({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<DocumentsByType>(emptyDocuments)
  const [loading, setLoading] = useState(true)
  const [busyType, setBusyType] = useState<DocumentType | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDocuments() {
      setLoading(true)
      setError('')
      const supabase = createClient()
      const results = await Promise.all(documentTypes.map(async (type) => {
        const { data, error: listError } = await supabase.storage
          .from(bucket)
          .list(`${userId}/${type.id}`, { limit: 50, sortBy: { column: 'updated_at', order: 'desc' } })
        if (listError) throw new Error(listError.message)
        const files: StoredDocument[] = (data ?? [])
          .filter((item) => item.id !== null)
          .map((item) => ({
            name: item.name,
            id: item.id,
            updated_at: item.updated_at,
            metadata: typeof item.metadata?.size === 'number' ? { size: item.metadata.size } : null,
          }))
        return [type.id, files] as const
      }))
      if (cancelled) return
      const nextDocuments = { ...emptyDocuments }
      results.forEach(([type, files]) => {
        nextDocuments[type] = files
      })
      setDocuments(nextDocuments)
      setLoading(false)
    }

    loadDocuments().catch((caughtError: unknown) => {
      if (cancelled) return
      setError(caughtError instanceof Error ? caughtError.message : 'Could not load your documents.')
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [userId])

  async function uploadDocument(type: DocumentType, file: File) {
    setError('')
    setNotice('')
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    const contentType = contentTypes[extension]
    if (!contentType) {
      setError('Choose a PDF, DOC, DOCX, or TXT file.')
      return
    }
    if (file.size > maxFileSize) {
      setError('Each document must be 10 MB or smaller.')
      return
    }

    setBusyType(type)
    try {
      const supabase = createClient()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-100)
      const path = `${userId}/${type}/${crypto.randomUUID()}-${safeName}`
      const { data: uploaded, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType, cacheControl: '3600', upsert: false })
      if (uploadError) throw uploadError

      setDocuments((current) => ({
        ...current,
        [type]: [{
          name: uploaded.path.split('/').slice(2).join('/'),
          id: uploaded.id,
          updated_at: new Date().toISOString(),
          metadata: { size: file.size },
        }, ...current[type]],
      }))
      setNotice('Document uploaded privately to your account.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not upload this document.')
    } finally {
      setBusyType(null)
    }
  }

  async function removeDocument(type: DocumentType, document: StoredDocument) {
    setError('')
    setNotice('')
    setBusyType(type)
    try {
      const supabase = createClient()
      const path = `${userId}/${type}/${document.name}`
      const { error: deleteError } = await supabase.storage.from(bucket).remove([path])
      if (deleteError) throw deleteError
      setDocuments((current) => ({
        ...current,
        [type]: current[type].filter((item) => item.name !== document.name),
      }))
      setNotice('Document removed.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Could not remove this document.')
    } finally {
      setBusyType(null)
    }
  }

  function onFileSelected(type: DocumentType, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) void uploadDocument(type, file)
  }

  return (
    <section aria-labelledby="profile-documents-heading" className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.12em] text-violet-800">Application source material</p>
        <h2 id="profile-documents-heading" className="mt-1 text-xl font-bold text-slate-950">Your CVs and work profiles</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Keep a separate source document for each kind of work you are pursuing. Files are private to your account.
          A CV is sent to the AI provider only if you select it in the pitch generator.
        </p>
      </div>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">Document action failed: {error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <div className="grid gap-4 xl:grid-cols-3">
        {documentTypes.map((type) => (
          <Card key={type.id} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex h-full flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-800">
                  <FileText aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-950">{type.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{type.description}</p>
                </div>
              </div>

              <div className="mt-5 flex-1">
                {loading ? (
                  <p className="text-sm text-slate-500">Loading saved files…</p>
                ) : documents[type.id].length ? (
                  <ul className="space-y-2">
                    {documents[type.id].map((document) => (
                      <li key={document.name} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                        <FileText aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">{document.name.replace(/^[0-9a-f-]+-/i, '')}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(document.metadata?.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${document.name}`}
                          disabled={busyType !== null}
                          onClick={() => void removeDocument(type.id, document)}
                        >
                          {busyType === type.id ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Trash2 aria-hidden="true" className="size-4 text-red-700" />}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-sm text-slate-500">
                    No files added yet.
                  </p>
                )}
              </div>

              <label className="mt-4">
                <span className="sr-only">Add a file for {type.title}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="peer sr-only"
                  disabled={busyType !== null}
                  onChange={(event) => onFileSelected(type.id, event)}
                />
                <span className={`flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400 peer-focus-visible:ring-offset-2 ${busyType !== null ? 'pointer-events-none opacity-50' : ''}`}>
                  {busyType === type.id ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Upload aria-hidden="true" className="size-4" />}
                  {busyType === type.id ? 'Working…' : 'Add document'}
                </span>
              </label>
              <p className="mt-2 text-xs text-slate-500">PDF, DOC, DOCX, or TXT. Up to 10 MB each.</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs leading-5 text-slate-500">If uploads fail, storage may not be set up for your account yet.</p>
    </section>
  )
}
