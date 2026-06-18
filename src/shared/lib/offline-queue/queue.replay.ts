import { request, HttpError } from '@/shared/api'
import type { QueuedRequest } from './queue.types'
import { getAll, remove } from './queue'

export interface ReplayResult {
  /** Requests that were sent successfully and removed from the queue. */
  synced: number
  /** Requests permanently rejected (4xx) — dropped and reported. */
  failed: QueuedRequest[]
}

/**
 * A 4xx the server will keep rejecting no matter how often we retry, so the
 * item is dropped instead of blocking the queue forever. 401 (auth), 408
 * (timeout) and 429 (rate limit) are excluded: those are transient.
 */
const isPermanentFailure = (error: unknown): boolean =>
  error instanceof HttpError &&
  error.status >= 400 &&
  error.status < 500 &&
  error.status !== 401 &&
  error.status !== 408 &&
  error.status !== 429

// Prevents the startup replay and the `online` event from running concurrently.
let running = false

/**
 * Replays queued offline requests in FIFO order.
 *
 * - Success → removed from the queue.
 * - Permanent 4xx → dropped and collected into `failed` (e.g. duplicate email).
 * - Transient (401/408/429/5xx/network) → stop and keep the rest for the next
 *   attempt, so a flaky connection never discards pending changes.
 */
export const replayQueue = async (): Promise<ReplayResult> => {
  if (running) return { synced: 0, failed: [] }
  running = true
  try {
    const items = await getAll()
    let synced = 0
    const failed: QueuedRequest[] = []

    for (const item of items) {
      try {
        await request({ api: item.api, method: item.method, body: item.body })
        await remove(item.id)
        synced++
      } catch (error) {
        if (isPermanentFailure(error)) {
          await remove(item.id)
          failed.push(item)
          continue
        }
        // Transient — leave this item (and the rest) for a later attempt.
        break
      }
    }

    return { synced, failed }
  } finally {
    running = false
  }
}
