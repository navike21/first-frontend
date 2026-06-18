import { describe, it, expect, vi, beforeEach } from 'vitest'
import localforage from 'localforage'
import type { QueuedRequest } from './queue.types'
import { enqueue, getAll, remove, clear, size } from './queue'

vi.mock('localforage')

const makeRequest = (
  overrides?: Partial<Omit<QueuedRequest, 'id'>>
): Omit<QueuedRequest, 'id'> => ({
  api: '/api/test',
  method: 'POST',
  body: { key: 'value' },
  timestamp: 1000,
  ...overrides,
})

describe('offline queue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('enqueue', () => {
    it('should add a request with a generated id to an empty queue', async () => {
      // Arrange
      vi.mocked(localforage.getItem).mockResolvedValue(null)
      vi.mocked(localforage.setItem).mockResolvedValue(undefined)
      // Act
      await enqueue(makeRequest())
      // Assert
      const [[, saved]] = vi.mocked(localforage.setItem).mock.calls
      const queue = saved as QueuedRequest[]
      expect(queue).toHaveLength(1)
      expect(typeof queue[0].id).toBe('string')
      expect(queue[0].api).toBe('/api/test')
    })

    it('should append to an existing queue', async () => {
      // Arrange
      const existing: QueuedRequest = {
        id: 'existing-id',
        api: '/api/existing',
        method: 'PUT',
        timestamp: 500,
      }
      vi.mocked(localforage.getItem).mockResolvedValue([existing])
      vi.mocked(localforage.setItem).mockResolvedValue(undefined)
      // Act
      await enqueue(makeRequest())
      // Assert
      const [[, saved]] = vi.mocked(localforage.setItem).mock.calls
      expect((saved as QueuedRequest[]).length).toBe(2)
    })
  })

  describe('getAll', () => {
    it('should return all queued requests', async () => {
      // Arrange
      const items: QueuedRequest[] = [
        { id: 'a', api: '/api/a', method: 'POST', timestamp: 1 },
        { id: 'b', api: '/api/b', method: 'DELETE', timestamp: 2 },
      ]
      vi.mocked(localforage.getItem).mockResolvedValue(items)
      // Act
      const result = await getAll()
      // Assert
      expect(result).toEqual(items)
    })

    it('should return an empty array when no items are queued', async () => {
      // Arrange
      vi.mocked(localforage.getItem).mockResolvedValue(null)
      // Act
      const result = await getAll()
      // Assert
      expect(result).toEqual([])
    })
  })

  describe('remove', () => {
    it('should remove only the request with the given id', async () => {
      // Arrange
      const items: QueuedRequest[] = [
        { id: 'keep', api: '/api/a', method: 'POST', timestamp: 1 },
        { id: 'drop', api: '/api/b', method: 'DELETE', timestamp: 2 },
      ]
      vi.mocked(localforage.getItem).mockResolvedValue(items)
      vi.mocked(localforage.setItem).mockResolvedValue(undefined)
      // Act
      await remove('drop')
      // Assert
      const [[, saved]] = vi.mocked(localforage.setItem).mock.calls
      const queue = saved as QueuedRequest[]
      expect(queue).toHaveLength(1)
      expect(queue[0].id).toBe('keep')
    })
  })

  describe('clear', () => {
    it('should call localforage.removeItem with the queue key', async () => {
      // Arrange
      vi.mocked(localforage.removeItem).mockResolvedValue(undefined)
      // Act
      await clear()
      // Assert
      expect(localforage.removeItem).toHaveBeenCalledTimes(1)
    })
  })

  describe('size', () => {
    it('returns the number of queued requests', async () => {
      vi.mocked(localforage.getItem).mockResolvedValue([
        { id: 'a', api: '/a', method: 'POST', timestamp: 1 },
        { id: 'b', api: '/b', method: 'POST', timestamp: 2 },
      ])
      expect(await size()).toBe(2)
    })

    it('returns 0 when the queue is empty', async () => {
      vi.mocked(localforage.getItem).mockResolvedValue(null)
      expect(await size()).toBe(0)
    })
  })
})
