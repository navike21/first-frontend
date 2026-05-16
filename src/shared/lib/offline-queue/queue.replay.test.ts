import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { QueuedRequest } from './queue.types'

const { getAllMock, removeMock, requestMock } = vi.hoisted(() => ({
  getAllMock: vi.fn<() => Promise<QueuedRequest[]>>(),
  removeMock: vi.fn<(id: string) => Promise<void>>(),
  requestMock: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('./queue', () => ({
  getAll: getAllMock,
  remove: removeMock,
}))

vi.mock('@/shared/api', () => ({
  request: requestMock,
}))

import { replayQueue } from './queue.replay'

const makeItem = (overrides?: Partial<QueuedRequest>): QueuedRequest => ({
  id: 'item-1',
  api: '/api/test',
  method: 'POST',
  timestamp: 1000,
  ...overrides,
})

describe('replayQueue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should do nothing when the queue is empty', async () => {
    // Arrange
    getAllMock.mockResolvedValue([])
    // Act
    await replayQueue()
    // Assert
    expect(requestMock).not.toHaveBeenCalled()
    expect(removeMock).not.toHaveBeenCalled()
  })

  it('should call request and then remove for each queued item', async () => {
    // Arrange
    const items = [makeItem({ id: 'a' }), makeItem({ id: 'b', method: 'PUT' })]
    getAllMock.mockResolvedValue(items)
    requestMock.mockResolvedValue(undefined)
    removeMock.mockResolvedValue(undefined)
    // Act
    await replayQueue()
    // Assert
    expect(requestMock).toHaveBeenCalledTimes(2)
    expect(removeMock).toHaveBeenCalledWith('a')
    expect(removeMock).toHaveBeenCalledWith('b')
  })

  it('should replay items in FIFO order', async () => {
    // Arrange
    const items = [
      makeItem({ id: 'first', timestamp: 100 }),
      makeItem({ id: 'second', timestamp: 200 }),
    ]
    getAllMock.mockResolvedValue(items)
    requestMock.mockResolvedValue(undefined)
    const order: string[] = []
    removeMock.mockImplementation(async (id) => {
      order.push(id)
    })
    // Act
    await replayQueue()
    // Assert
    expect(order).toEqual(['first', 'second'])
  })

  it('should throw and stop replay when a request fails', async () => {
    // Arrange
    const items = [makeItem({ id: 'fail' }), makeItem({ id: 'never-reached' })]
    getAllMock.mockResolvedValue(items)
    requestMock.mockRejectedValue(new Error('network error'))
    // Act & Assert
    await expect(replayQueue()).rejects.toThrow('network error')
    expect(removeMock).not.toHaveBeenCalledWith('never-reached')
  })
})
