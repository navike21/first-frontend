import { request } from '@/shared/api/api.services'
import { useSessionStore } from '@/shared/model'
import type { ApiResponse } from '@/shared/api/types'

export interface StorageFile {
  id: string
  entityType: string
  entityId: string
  originalName: string
  mimeType: string
  size: number
  isImage: boolean
  original: { pathname: string; url: string }
  full?: { pathname: string; url: string }
  thumb?: { pathname: string; url: string }
  uploadedBy: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  /** Soft-delete marker (backend migrated from `status:'deleted'` to this). */
  deletedAt?: string
}

/**
 * @deprecated Upload-first flow. The backend now owns uploads: send the file as
 * a part of the create/update request (multipart `data` + file part) per
 * `docs/API-UPLOADS.md`. Kept only for any generic, non-entity upload need.
 */
export async function uploadFile(
  file: File,
  entityType: string,
  entityId: string,
  quality = 80
): Promise<StorageFile> {
  const baseUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const token = useSessionStore.getState().token

  const form = new FormData()
  form.append('file', file)
  form.append('entityType', entityType)
  form.append('entityId', entityId)
  form.append('quality', String(quality))

  const res = await fetch(`${baseUrl}/storage/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(err.message ?? `Upload failed: ${res.status}`)
  }

  const body = (await res.json()) as ApiResponse<StorageFile>
  return body.data
}

export async function uploadEditorImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('image', file)
  const res = await request<{ url: string }>({ api: '/storage/editor-image', method: 'POST', body: form })
  if (!res.url) throw new Error('Upload did not return a URL')
  return res.url
}
