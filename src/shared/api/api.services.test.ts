import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  HttpError,
  OfflineQueuedError,
  request,
  registerLanguageProvider,
} from './api.services'
import { useSessionStore } from '@/shared/model'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Prevent offline-queue from trying to access IndexedDB/localStorage in tests
vi.mock('@/shared/lib/offline-queue/queue', () => ({
  enqueue: vi.fn().mockResolvedValue(undefined),
}))

describe('api.services', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('VITE_API_BASE_URL', '')
  })

  describe('HttpError', () => {
    it('should create instance with correct status, statusText, and name', () => {
      // Arrange & Act
      const err = new HttpError(404, 'Not Found')
      // Assert
      expect(err.status).toBe(404)
      expect(err.statusText).toBe('Not Found')
      expect(err.name).toBe('HttpError')
      expect(err.message).toBe('HTTP 404: Not Found')
    })

    it('should use custom message when provided', () => {
      // Arrange & Act
      const err = new HttpError(500, 'Server Error', 'Custom message')
      // Assert
      expect(err.message).toBe('Custom message')
    })

    it('should be an instance of Error', () => {
      // Arrange & Act
      const err = new HttpError(400, 'Bad Request')
      // Assert
      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('request()', () => {
    beforeEach(() => {
      useSessionStore.setState({
        token: null,
        isAuthenticated: false,
        user: null,
      })
    })

    it('should call fetch with correct URL, method and headers for GET', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      })
      // Act
      const result = await request<{ id: number }>({
        api: '/test',
        method: 'GET',
      })
      // Assert
      expect(mockFetch).toHaveBeenCalledOnce()
      const [url, options] = mockFetch.mock.calls[0] as [
        string,
        RequestInit & { headers: Record<string, string> },
      ]
      expect(url).toBe('/test')
      expect(options.method).toBe('GET')
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(result).toEqual({ id: 1 })
    })

    it('should serialise body to JSON for POST', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ created: true }),
      })
      // Act
      await request({ api: '/items', method: 'POST', body: { name: 'test' } })
      // Assert
      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
      expect(options.body).toBe(JSON.stringify({ name: 'test' }))
    })

    it('should not set body when body is undefined', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
      // Act
      await request({ api: '/ping', method: 'GET' })
      // Assert
      const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
      expect(options.body).toBeUndefined()
    })

    it('should throw HttpError when response is not ok', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })
      // Act & Assert
      await expect(request({ api: '/secure', method: 'GET' })).rejects.toThrow(
        HttpError
      )
    })

    it('should use apiMessage in HttpError when 401 response has json message', async () => {
      // Arrange — 401 with parseable JSON body containing a message
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Token expirado' }),
      })
      // Act & Assert
      const err = (await request({ api: '/secure', method: 'GET' }).catch(
        (e) => e
      )) as HttpError
      expect(err).toBeInstanceOf(HttpError)
      expect(err.message).toBe('Token expirado')
    })

    it('should return undefined for 204 No Content', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      })
      // Act
      const result = await request<void>({ api: '/delete', method: 'DELETE' })
      // Assert
      expect(result).toBeUndefined()
    })

    it('should include Authorization header when session token is present', async () => {
      useSessionStore.setState({
        token: 'bearer-tok',
        isAuthenticated: true,
        user: null,
      })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
      await request({ api: '/me', method: 'GET' })
      const [, options] = mockFetch.mock.calls[0] as [
        string,
        RequestInit & { headers: Record<string, string> },
      ]
      expect(options.headers['Authorization']).toBe('Bearer bearer-tok')
    })

    it('uses empty string when VITE_API_BASE_URL is undefined (line 75 ?? right branch)', async () => {
      vi.stubEnv('VITE_API_BASE_URL', undefined as unknown as string)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
      await request({ api: '/test', method: 'GET' })
      const [url] = mockFetch.mock.calls[0] as [string]
      expect(url).toBe('/test')
      vi.stubEnv('VITE_API_BASE_URL', '')
    })

    it('should prepend VITE_API_BASE_URL when set', async () => {
      // Arrange
      vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com')
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
      // Act
      await request({ api: '/users', method: 'GET' })
      // Assert
      const [url] = mockFetch.mock.calls[0] as [string]
      expect(url).toBe('https://api.example.com/users')
    })

    it('should queue request and throw OfflineQueuedError when offline for non-GET', async () => {
      // Arrange
      vi.stubGlobal('navigator', { onLine: false })
      // Act & Assert
      await expect(
        request({ api: '/items', method: 'POST', body: { name: 'test' } })
      ).rejects.toThrow(OfflineQueuedError)
      vi.stubGlobal('navigator', { onLine: true })
    })

    it('should use apiMessage from error body when available', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Validation failed' }),
      })
      // Act & Assert
      await expect(
        request({ api: '/test', method: 'POST', body: {} })
      ).rejects.toThrow('Validation failed')
    })

    it('should use HTTP defaults when error body json fails to parse', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('invalid json')
        },
      })
      // Act & Assert
      const err = (await request({ api: '/test', method: 'GET' }).catch(
        (e) => e
      )) as HttpError
      expect(err).toBeInstanceOf(HttpError)
      expect(err.status).toBe(500)
    })

    it('should send FormData as body without forcing Content-Type', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ ok: true }),
      })
      const fd = new FormData()
      fd.append('data', JSON.stringify({ name: 'x' }))
      // Act
      await request({ api: '/users', method: 'POST', body: fd })
      // Assert
      const [, options] = mockFetch.mock.calls[0] as [
        string,
        RequestInit & { headers: Record<string, string> },
      ]
      expect(options.body).toBe(fd)
      expect(options.headers['Content-Type']).toBeUndefined()
    })

    it('should not queue FormData uploads when offline', async () => {
      // Arrange — offline, but a multipart upload must hit the network, not the queue
      vi.stubGlobal('navigator', { onLine: false })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ ok: true }),
      })
      const fd = new FormData()
      fd.append('file', new Blob(['x']))
      // Act & Assert
      await expect(
        request({ api: '/upload', method: 'POST', body: fd })
      ).resolves.toEqual({ ok: true })
      expect(mockFetch).toHaveBeenCalledOnce()
      vi.stubGlobal('navigator', { onLine: true })
    })

    it('adds Accept-Language from the registered language provider', async () => {
      // Arrange
      registerLanguageProvider(() => 'es')
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
      // Act
      await request({ api: '/x', method: 'GET' })
      // Assert
      const [, options] = mockFetch.mock.calls[0] as [
        string,
        RequestInit & { headers: Record<string, string> },
      ]
      expect(options.headers['Accept-Language']).toBe('es')
      registerLanguageProvider(() => undefined) // reset for other tests
    })

    it('should attach code and details from the error body to HttpError', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: async () => ({
          message: 'Validation failed',
          code: 'VALIDATION_SCHEMA_ERROR',
          details: { validation: [{ path: 'email', message: 'Invalid' }] },
        }),
      })
      // Act
      const err = (await request({
        api: '/users',
        method: 'POST',
        body: {},
      }).catch((e) => e)) as HttpError
      // Assert
      expect(err.code).toBe('VALIDATION_SCHEMA_ERROR')
      expect(err.details?.validation?.[0]?.path).toBe('email')
    })
  })

  describe('OfflineQueuedError', () => {
    it('has correct name and message', () => {
      const err = new OfflineQueuedError('POST', '/api/items')
      expect(err.name).toBe('OfflineQueuedError')
      expect(err.message).toBe('Request queued offline: POST /api/items')
    })

    it('is an instance of Error', () => {
      expect(new OfflineQueuedError('DELETE', '/items')).toBeInstanceOf(Error)
    })
  })
})
