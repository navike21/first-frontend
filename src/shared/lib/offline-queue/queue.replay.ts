import { request } from '@/shared/api'
import { getAll, remove } from './queue'

/**
 * Replays all queued offline requests in FIFO order.
 * Each successful request is removed from the queue immediately.
 * Throws on first failure so the caller can handle sync errors.
 */
export const replayQueue = async (): Promise<void> => {
  const items = await getAll()
  for (const item of items) {
    await request({ api: item.api, method: item.method, body: item.body })
    await remove(item.id)
  }
}
