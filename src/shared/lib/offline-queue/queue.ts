import localforage from 'localforage'
import type { QueuedRequest } from './queue.types'

const QUEUE_KEY = 'pt_offline_queue'

const getQueue = async (): Promise<QueuedRequest[]> =>
  (await localforage.getItem<QueuedRequest[]>(QUEUE_KEY)) ?? []

export const enqueue = async (req: Omit<QueuedRequest, 'id'>): Promise<void> => {
  const queue = await getQueue()
  const item: QueuedRequest = { ...req, id: crypto.randomUUID() }
  await localforage.setItem(QUEUE_KEY, [...queue, item])
}

export const getAll = async (): Promise<QueuedRequest[]> => getQueue()

export const remove = async (id: string): Promise<void> => {
  const queue = await getQueue()
  await localforage.setItem(
    QUEUE_KEY,
    queue.filter((item) => item.id !== id),
  )
}

export const clear = async (): Promise<void> => {
  await localforage.removeItem(QUEUE_KEY)
}
