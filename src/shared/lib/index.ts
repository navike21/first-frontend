/* Shared library utilities barrel.
   Export pure utility functions and hooks from this folder. */
export { notify } from './notify'
export { captureVideoFrame, drawVideoFrameToBlob } from './captureVideoFrame'
export { formatDate } from './formatDate'
export { isOfflineQueued, onQueuedOr } from './offline-queue/handleQueued'
export { useMounted } from './use-mounted'
export { useNetworkStatus } from './useNetworkStatus'
export { useSessionSync } from './useSessionSync'
export { hasPermission, useHasPermission } from './permissions'
export * from './animations'
export { requiredLabel } from './requiredLabel'
export { langDotClass } from './langDotClass'
export { MAX_IMAGE_UPLOAD_BYTES, MAX_VIDEO_UPLOAD_BYTES } from './storageLimits'
