const DEFAULT_SEEK_SECONDS = 0.3

/**
 * Draws a video element's current frame to a canvas and exports it as a JPEG
 * `Blob`. Shared by `captureVideoFrame` (a local `File`, loaded into its own
 * detached video element) and `MediaThumbnail`'s legacy-video backfill
 * (an already-live, already-seeked `<video>` — no need to load anything twice).
 * Resolves `null` if the canvas context is unavailable.
 */
export function drawVideoFrameToBlob(
  video: HTMLVideoElement
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve(null)
      return
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
  })
}

/**
 * Captures a frame from a local video `File` as a JPEG `Blob` — used to
 * generate a cover thumbnail at upload time instead of ever re-fetching the
 * video just to render a grid tile (see `MediaThumbnail`). The file is
 * already in memory (just picked/dropped), so this never touches the
 * network. Seeking a bit past 0s avoids landing on a blank fade-in frame,
 * which many videos open with. Never throws — resolves `null` on failure so
 * callers can treat the cover as a best-effort nicety.
 */
export function captureVideoFrame(
  file: File,
  seekSeconds = DEFAULT_SEEK_SECONDS
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
      URL.revokeObjectURL(url)
    }

    const onError = () => {
      cleanup()
      resolve(null)
    }

    const onSeeked = () => {
      drawVideoFrameToBlob(video).then((blob) => {
        cleanup()
        resolve(blob)
      })
    }

    const onLoadedMetadata = () => {
      video.currentTime = Math.min(seekSeconds, video.duration || seekSeconds)
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    video.src = url
  })
}
