/**
 * Mirrors backend's `STORAGE_MAX_IMAGE_SIZE_BYTES` (kept intentionally under
 * Vercel's ~4.5 MB serverless request-body ceiling). Client-side pickers must
 * reject an oversized file at this same threshold — otherwise a file the UI
 * accepts as "fine" can still be killed by the platform before the backend
 * ever runs, returning an opaque error with no reason for the user to see.
 */
export const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024
