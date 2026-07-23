/**
 * Mirrors backend's `STORAGE_MAX_IMAGE_SIZE_BYTES` (kept intentionally under
 * Vercel's ~4.5 MB serverless request-body ceiling). Client-side pickers must
 * reject an oversized file at this same threshold — otherwise a file the UI
 * accepts as "fine" can still be killed by the platform before the backend
 * ever runs, returning an opaque error with no reason for the user to see.
 */
export const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024

/**
 * Mirrors backend's `STORAGE_MAX_VIDEO_SIZE_BYTES` (`directUpload.ts`'s
 * `onBeforeGenerateToken` passes it as `maximumSizeInBytes` to
 * `@vercel/blob/client`'s `handleUpload`). That check runs server-side only —
 * the SDK has no client-side pre-check of its own — so an oversized video
 * otherwise starts a real upload over the network before failing, and the
 * failure surfaces as an opaque connection-level error (Vercel's storage
 * backend resets the connection on seeing an oversized declared body, which
 * the browser can only report as a generic network failure, not a clean
 * HTTP response with a reason). Rejecting client-side first avoids both the
 * wasted upload and the meaningless error message.
 */
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024
