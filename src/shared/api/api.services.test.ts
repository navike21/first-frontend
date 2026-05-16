import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpError, request } from './api.services'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

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
      await expect(request({ api: '/secure', method: 'GET' })).rejects.toThrow(HttpError)
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
  })
})
