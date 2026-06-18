import { OfflineQueuedError } from '@/shared/api'
import { notify } from '../notify'

/**
 * True when a mutation "failed" only because it was saved to the offline queue.
 */
export const isOfflineQueued = (error: unknown): error is OfflineQueuedError =>
  error instanceof OfflineQueuedError

/**
 * Builds a mutation `onError` handler that treats an offline-queued error as a
 * soft success: it runs `onQueued` — the same side-effects as `onSuccess`
 * (navigate away, close a modal, clear a selection) — while the global
 * MutationCache shows the "saved offline" toast. Any real error falls back to
 * `notify.queryError`.
 *
 * @example
 * onError: onQueuedOr(() => setDeletingUser(null))
 */
export const onQueuedOr =
  (onQueued: () => void) =>
  (error: unknown): void => {
    if (isOfflineQueued(error)) {
      onQueued()
      return
    }
    notify.queryError(error)
  }
