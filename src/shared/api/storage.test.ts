import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSessionStore } from '@/shared/model'
import type { StorageFile } from './storage'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { uploadFile } from './storage'

const makeStorageFile = (): StorageFile => ({
  id: 'file-1',
  entityType: 'user',
  entityId: 'u-1',
  originalName: 'avatar.jpg',
  mimeType: 'image/jpeg',
  size: 12345,
  isImage: true,
  original: { pathname: '/files/avatar.jpg', url: 'https://cdn.example.com/avatar.jpg' },
  uploadedBy: 'u-1',
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
})

describe('uploadFile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('VITE_API_BASE_URL', '')
    useSessionStore.setState({ isAuthenticated: false, token: null, user: null })
  })

  it('sends a POST to /storage/upload with FormData', async () => {
    const storageFile = makeStorageFile()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: storageFile }),
    })

    const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' })
    const result = await uploadFile(file, 'user', 'u-1')

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/storage/upload')
    expect(options.method).toBe('POST')
    expect(result).toEqual(storageFile)
  })

  it('includes Authorization header when token is present', async () => {
    useSessionStore.setState({ isAuthenticated: true, token: 'my-token', user: null })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: makeStorageFile() }),
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await uploadFile(file, 'user', 'u-1')

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }]
    expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer my-token')
  })

  it('omits Authorization header when token is null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: makeStorageFile() }),
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await uploadFile(file, 'user', 'u-1')

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit & { headers: Record<string, string> }]
    expect((options.headers as Record<string, string>)['Authorization']).toBeUndefined()
  })

  it('throws Error when response is not ok with JSON message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 413,
      json: async () => ({ message: 'File too large' }),
    })

    const file = new File(['content'], 'big.jpg', { type: 'image/jpeg' })
    await expect(uploadFile(file, 'user', 'u-1')).rejects.toThrow('File too large')
  })

  it('throws Error with status code when response is not ok and JSON parse fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => { throw new Error('invalid json') },
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await expect(uploadFile(file, 'user', 'u-1')).rejects.toThrow('Upload failed: 500')
  })

  it('uses empty string when VITE_API_BASE_URL is undefined (line 27 ?? right branch)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.stubEnv('VITE_API_BASE_URL', undefined as any)
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: makeStorageFile() }) })
    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    await uploadFile(file, 'user', 'u-1')
    const [url] = mockFetch.mock.calls[0] as [string]
    expect(url).toBe('/storage/upload')
    vi.stubEnv('VITE_API_BASE_URL', '')
  })

  it('uses quality parameter in FormData', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: makeStorageFile() }),
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await uploadFile(file, 'user', 'u-1', 60)

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    const body = options.body as FormData
    expect(body.get('quality')).toBe('60')
  })
})
