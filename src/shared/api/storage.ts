import { upload } from '@vercel/blob/client'
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

/**
 * Scans HTML produced by the rich-text editor, uploads any base64 `data:image/`
 * src attributes via `uploader`, and replaces them with the returned URLs.
 * Images that fail to upload are left as-is (non-blocking).
 */
export async function resolveRichTextImages(
  html: string,
  uploader: (file: File) => Promise<string>,
): Promise<string> {
  if (!html || !html.includes('data:image/')) return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const images = Array.from(doc.querySelectorAll('img')).filter((img) =>
    img.src.startsWith('data:image/'),
  )
  if (images.length === 0) return html
  await Promise.all(
    images.map(async (img) => {
      try {
        const res = await fetch(img.src)
        const blob = await res.blob()
        const ext = blob.type.split('/')[1] ?? 'jpg'
        const file = new File([blob], `image.${ext}`, { type: blob.type })
        img.setAttribute('src', await uploader(file))
      } catch {
        // leave the base64 intact if the upload fails
      }
    }),
  )
  return doc.body.innerHTML
}

export async function uploadEditorImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('image', file)
  const res = await request<ApiResponse<{ url: string | null }>>({
    api: '/storage/editor-image',
    method: 'POST',
    body: form,
  })
  if (!res.data.url) throw new Error('Upload did not return a URL')
  return res.data.url
}

export interface DirectUploadResult {
  url: string
  mimeType: string
}

/**
 * Uploads directly from the browser to blob storage (bypasses Express
 * entirely) — needed for video, which can easily exceed the ~4.5MB body
 * limit of the serverless function that fronts /storage/editor-image. See
 * first-backend's application/directUpload.ts.
 */
export async function directUploadVideo(file: File): Promise<DirectUploadResult> {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const token = useSessionStore.getState().token
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: `${baseUrl}/storage/direct-upload`,
    clientPayload: JSON.stringify({ originalName: file.name, size: file.size }),
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  })
  return { url: blob.url, mimeType: blob.contentType }
}

export interface StorageListParams {
  page?: number
  limit?: number
  kind?: 'image' | 'video'
  search?: string
}

export interface StorageListResult {
  items: StorageFile[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

function storageListQuerySuffix(params: StorageListParams): string {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.kind) query.set('kind', params.kind)
  if (params.search) query.set('search', params.search)
  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

export async function listStorageFiles(params: StorageListParams = {}): Promise<StorageListResult> {
  const res = await request<ApiResponse<StorageListResult>>({
    api: `/storage/files${storageListQuerySuffix(params)}`,
    method: 'GET',
  })
  return res.data
}

export async function listDeletedStorageFiles(params: StorageListParams = {}): Promise<StorageListResult> {
  const res = await request<ApiResponse<StorageListResult>>({
    api: `/storage/trash${storageListQuerySuffix(params)}`,
    method: 'GET',
  })
  return res.data
}

/**
 * Uploads images through the entity-agnostic bulk endpoint — used by the
 * Multimedia library, which isn't scoped to a single business entity like
 * clients/portfolio/etc. Each call gets its own `entityId` (uuid), same as
 * any other batch upload; it has no meaning beyond grouping that one upload.
 * Videos can't go through this (body-size limit) — use {@link directUploadVideo}.
 */
export async function uploadStorageImages(files: File[], entityType = 'media'): Promise<StorageFile[]> {
  const form = new FormData()
  form.append('entityType', entityType)
  form.append('entityId', crypto.randomUUID())
  files.forEach((file) => form.append('files', file))
  const res = await request<ApiResponse<StorageFile[]>, FormData>({
    api: '/storage/upload-bulk',
    method: 'POST',
    body: form,
  })
  return res.data
}

export async function deleteStorageFiles(ids: string[]): Promise<void> {
  await request<ApiResponse<null>, { ids: string[] }>({
    api: '/storage/delete',
    method: 'DELETE',
    body: { ids },
  })
}

export async function restoreStorageFile(id: string): Promise<StorageFile> {
  const res = await request<ApiResponse<StorageFile>>({ api: `/storage/${id}/restore`, method: 'PATCH' })
  return res.data
}

export async function bulkRestoreStorageFiles(ids: string[]): Promise<void> {
  await request<ApiResponse<unknown>, { ids: string[] }>({
    api: '/storage/bulk/restore',
    method: 'PATCH',
    body: { ids },
  })
}

export async function purgeStorageFiles(ids: string[]): Promise<void> {
  await request<ApiResponse<null>, { ids: string[] }>({
    api: '/storage/delete/permanent',
    method: 'DELETE',
    body: { ids },
  })
}

export type StorageUsageModule =
  | 'clients'
  | 'users'
  | 'collaborators'
  | 'portfolio'
  | 'services'
  | 'pages'
  | 'app-settings'

export type StorageUsageContext = 'cover' | 'gallery' | 'ogImage' | 'background' | 'logo' | 'favicon'

export interface StorageFileUsage {
  module: StorageUsageModule
  id: string
  label: string
  context?: StorageUsageContext
}

/**
 * Informational only — no module holds a live reference to a StorageFile, so
 * this is a best-effort search across the fields known to store its URL
 * (see first-backend's findStorageFileUsages.ts for the exact list and its
 * one documented gap: images pasted into rich-text page content).
 */
export async function getStorageFileUsages(id: string): Promise<StorageFileUsage[]> {
  const res = await request<ApiResponse<StorageFileUsage[]>>({ api: `/storage/${id}/usages`, method: 'GET' })
  return res.data
}
