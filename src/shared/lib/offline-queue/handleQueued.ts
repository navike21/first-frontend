import { OfflineQueuedError } from '@/shared/api'
import { notify } from '../notify'
import { hasServerFieldErrors } from '../serverFormErrors'

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

/**
 * Same as `onQueuedOr`, for pages whose form already calls
 * `applyServerFieldErrors` in an effect — skips the generic toast when the
 * error would already be shown inline under the offending field, instead of
 * stacking a redundant "invalid data" toast on top of a precise one.
 *
 * @example
 * onError: onQueuedOrFieldErrors(() => navigate({ to: navPaths.users(language) }))
 */
export const onQueuedOrFieldErrors =
  (onQueued: () => void) =>
  (error: unknown): void => {
    if (isOfflineQueued(error)) {
      onQueued()
      return
    }
    if (hasServerFieldErrors(error)) return
    notify.queryError(error)
  }
