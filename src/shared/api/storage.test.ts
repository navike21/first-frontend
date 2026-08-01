import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSessionStore } from '@/shared/model'
import type { StorageFile } from './storage'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const mockUpload = vi.fn()
vi.mock('@vercel/blob/client', () => ({
  upload: (...args: unknown[]) => mockUpload(...args),
}))

import { uploadFile, directUploadVideo } from './storage'

const makeStorageFile = (): StorageFile => ({
  id: 'file-1',
  entityType: 'user',
  entityId: 'u-1',
  originalName: 'avatar.jpg',
  mimeType: 'image/jpeg',
  size: 12345,
  isImage: true,
  original: {
    pathname: '/files/avatar.jpg',
    url: 'https://cdn.example.com/avatar.jpg',
  },
  uploadedBy: 'u-1',
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
})

describe('uploadFile', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('VITE_API_BASE_URL', '')
    useSessionStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    })
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
    useSessionStore.setState({
      isAuthenticated: true,
      token: 'my-token',
      user: null,
    })
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: makeStorageFile() }),
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await uploadFile(file, 'user', 'u-1')

    const [, options] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Record<string, string> },
    ]
    expect((options.headers as Record<string, string>)['Authorization']).toBe(
      'Bearer my-token'
    )
  })

  it('omits Authorization header when token is null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: makeStorageFile() }),
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await uploadFile(file, 'user', 'u-1')

    const [, options] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Record<string, string> },
    ]
    expect(
      (options.headers as Record<string, string>)['Authorization']
    ).toBeUndefined()
  })

  it('throws Error when response is not ok with JSON message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 413,
      json: async () => ({ message: 'File too large' }),
    })

    const file = new File(['content'], 'big.jpg', { type: 'image/jpeg' })
    await expect(uploadFile(file, 'user', 'u-1')).rejects.toThrow(
      'File too large'
    )
  })

  it('throws Error with status code when response is not ok and JSON parse fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('invalid json')
      },
    })

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    await expect(uploadFile(file, 'user', 'u-1')).rejects.toThrow(
      'Upload failed: 500'
    )
  })

  it('uses empty string when VITE_API_BASE_URL is undefined (line 27 ?? right branch)', async () => {
    vi.stubEnv('VITE_API_BASE_URL', undefined as unknown as string)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: makeStorageFile() }),
    })
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

interface MockUploadOptions {
  abortSignal: AbortSignal
  onUploadProgress: (event: {
    loaded: number
    total: number
    percentage: number
  }) => void
}

describe('directUploadVideo', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('VITE_API_BASE_URL', '')
    useSessionStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves with the uploaded url/mimeType and forwards progress', async () => {
    mockUpload.mockImplementation(
      async (_name: string, _file: File, options: MockUploadOptions) => {
        options.onUploadProgress({ loaded: 50, total: 100, percentage: 50 })
        return { url: 'https://blob.example/video.mp4', contentType: 'video/mp4' }
      }
    )
    const onProgress = vi.fn()
    const file = new File(['x'], 'video.mp4', { type: 'video/mp4' })

    const result = await directUploadVideo(file, 'id-1', onProgress)

    expect(result).toEqual({
      url: 'https://blob.example/video.mp4',
      mimeType: 'video/mp4',
    })
    expect(onProgress).toHaveBeenCalledWith({
      loaded: 50,
      total: 100,
      percentage: 50,
    })
  })

  it('aborts a stalled upload (no progress at all) once the stall timeout elapses', async () => {
    vi.useFakeTimers()
    let capturedSignal: AbortSignal | undefined
    mockUpload.mockImplementation(
      (_name: string, _file: File, options: MockUploadOptions) =>
        new Promise((_resolve, reject) => {
          capturedSignal = options.abortSignal
          options.abortSignal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        })
    )
    const file = new File(['x'], 'video.mp4', { type: 'video/mp4' })

    const promise = directUploadVideo(file, 'id-2')
    const assertion = expect(promise).rejects.toThrow()
    await vi.advanceTimersByTimeAsync(90_000)
    await assertion

    expect(capturedSignal?.aborted).toBe(true)
  })

  it('does not abort while progress keeps ticking within the stall window', async () => {
    vi.useFakeTimers()
    mockUpload.mockImplementation(
      (_name: string, _file: File, options: MockUploadOptions) =>
        new Promise((resolve) => {
          let ticks = 0
          const interval = setInterval(() => {
            ticks++
            options.onUploadProgress({
              loaded: ticks,
              total: 3,
              percentage: ticks * 33,
            })
            if (ticks === 3) {
              clearInterval(interval)
              resolve({
                url: 'https://blob.example/video.mp4',
                contentType: 'video/mp4',
              })
            }
            // Each tick lands well inside the 90s stall window, but the total
            // (180s) comfortably exceeds it — proving progress resets the timer
            // instead of the upload getting killed by the overall duration.
          }, 60_000)
        })
    )
    const file = new File(['x'], 'video.mp4', { type: 'video/mp4' })

    const promise = directUploadVideo(file, 'id-3')
    await vi.advanceTimersByTimeAsync(180_000)

    await expect(promise).resolves.toEqual({
      url: 'https://blob.example/video.mp4',
      mimeType: 'video/mp4',
    })
  })
})
