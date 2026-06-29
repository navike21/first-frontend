import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { QueuedRequest } from './queue.types'

// Lightweight stand-in for the real HttpError — replayQueue only reads `.status`
// and checks `instanceof HttpError`, so a class with the same shape suffices.
// Declared inside vi.hoisted so the (hoisted) mock factory can reference it.
const { getAllMock, removeMock, requestMock, FakeHttpError } = vi.hoisted(
  () => {
    class FakeHttpError extends Error {
      status: number
      constructor(status: number) {
        super(`HTTP ${status}`)
        this.status = status
      }
    }
    return {
      getAllMock: vi.fn<() => Promise<QueuedRequest[]>>(),
      removeMock: vi.fn<(id: string) => Promise<void>>(),
      requestMock: vi.fn<() => Promise<unknown>>(),
      FakeHttpError,
    }
  }
)

vi.mock('./queue', () => ({
  getAll: getAllMock,
  remove: removeMock,
}))

vi.mock('@/shared/api', () => ({
  request: requestMock,
  HttpError: FakeHttpError,
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

  it('does nothing when the queue is empty', async () => {
    getAllMock.mockResolvedValue([])
    const result = await replayQueue()
    expect(result).toEqual({ synced: 0, failed: [] })
    expect(requestMock).not.toHaveBeenCalled()
    expect(removeMock).not.toHaveBeenCalled()
  })

  it('sends and removes each item in FIFO order', async () => {
    const items = [makeItem({ id: 'a' }), makeItem({ id: 'b', method: 'PUT' })]
    getAllMock.mockResolvedValue(items)
    requestMock.mockResolvedValue(undefined)
    const order: string[] = []
    removeMock.mockImplementation(async (id) => {
      order.push(id)
    })

    const result = await replayQueue()

    expect(result.synced).toBe(2)
    expect(result.failed).toEqual([])
    expect(order).toEqual(['a', 'b'])
  })

  it('drops a permanent 4xx and reports it, continuing with the rest', async () => {
    const items = [makeItem({ id: 'dup' }), makeItem({ id: 'ok' })]
    getAllMock.mockResolvedValue(items)
    requestMock
      .mockRejectedValueOnce(new FakeHttpError(409))
      .mockResolvedValueOnce(undefined)
    removeMock.mockResolvedValue(undefined)

    const result = await replayQueue()

    expect(result.synced).toBe(1)
    expect(result.failed.map((i) => i.id)).toEqual(['dup'])
    // Both are removed: the duplicate is dropped, the valid one is synced.
    expect(removeMock).toHaveBeenCalledWith('dup')
    expect(removeMock).toHaveBeenCalledWith('ok')
  })

  it('stops on a transient (network) error and keeps the queue intact', async () => {
    const items = [makeItem({ id: 'flaky' }), makeItem({ id: 'later' })]
    getAllMock.mockResolvedValue(items)
    requestMock.mockRejectedValue(new Error('network down'))

    const result = await replayQueue()

    expect(result.synced).toBe(0)
    expect(result.failed).toEqual([])
    expect(removeMock).not.toHaveBeenCalled()
  })

  it('treats 401 as transient — does not drop the item', async () => {
    getAllMock.mockResolvedValue([makeItem({ id: 'auth' })])
    requestMock.mockRejectedValue(new FakeHttpError(401))

    const result = await replayQueue()

    expect(result).toEqual({ synced: 0, failed: [] })
    expect(removeMock).not.toHaveBeenCalled()
  })

  it('does not run concurrently (in-flight guard)', async () => {
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    getAllMock.mockImplementation(async () => {
      await gate
      return []
    })

    const first = replayQueue()
    const second = await replayQueue() // returns immediately while first runs

    expect(second).toEqual({ synced: 0, failed: [] })
    release()
    await first
    expect(getAllMock).toHaveBeenCalledTimes(1)
  })
})
