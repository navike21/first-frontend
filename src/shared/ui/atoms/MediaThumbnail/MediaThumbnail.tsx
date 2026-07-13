import { useEffect, useRef } from 'react'
import { attachVideoCoverWithRetry } from '@/shared/api/storage'
import { drawVideoFrameToBlob } from '@/shared/lib/captureVideoFrame'
import type { MediaThumbnailProps } from './MediaThumbnail.types'

/** Frame 0 is often a blank fade-in frame (many videos open on a beat of
 * black/white before the content appears) — starting a bit past it gives a
 * more representative thumbnail. */
const THUMBNAIL_SEEK_SECONDS = 0.3

/** Resolves once a frame has actually been presented for compositing —
 * `requestVideoFrameCallback` gives the precise signal; falls back to a
 * fixed delay on browsers that don't support it. */
function waitForFramePaint(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    if (typeof video.requestVideoFrameCallback === 'function') video.requestVideoFrameCallback(() => resolve())
    else setTimeout(resolve, 300)
  })
}

/** `preload="metadata"` alone loads the file's metadata but Chrome never
 * actually decodes/paints a frame from that — a blank box shows even once
 * `readyState` reports the video as fully loaded (confirmed: seeking
 * `currentTime` alone doesn't trigger a paint either, and pausing right
 * after `play()` resolves is too early — the promise settles before that
 * frame is composited). Playing from a small offset until a frame is
 * actually presented, then pausing, forces that paint with no poster/
 * backend support needed. */
async function paintVideoFrame(video: HTMLVideoElement, isCancelled: () => boolean): Promise<void> {
  video.currentTime = Math.min(THUMBNAIL_SEEK_SECONDS, video.duration || THUMBNAIL_SEEK_SECONDS)
  try {
    await video.play()
  } catch {
    return
  }
  await waitForFramePaint(video)
  if (!isCancelled()) video.pause()
}

/** One-time self-heal for legacy videos with no cover yet: the frame already
 * being painted for the fallback preview is captured and persisted, so this
 * video never needs the expensive path again anywhere it's rendered. */
async function backfillCover(video: HTMLVideoElement, entityId: string, isCancelled: () => boolean): Promise<void> {
  const blob = await drawVideoFrameToBlob(video)
  if (!blob || isCancelled()) return
  await attachVideoCoverWithRetry(entityId, blob)
}

async function paintAndBackfill(
  video: HTMLVideoElement,
  entityId: string | undefined,
  isCancelled: () => boolean,
): Promise<void> {
  await paintVideoFrame(video, isCancelled)
  if (entityId && !isCancelled()) await backfillCover(video, entityId, isCancelled)
}

export const MediaThumbnail = ({ src, kind, posterSrc, entityId, alt = '', className }: MediaThumbnailProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideoFallback = kind === 'video' && !posterSrc

  useEffect(() => {
    if (!isVideoFallback) return
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    const start = () => {
      paintAndBackfill(video, entityId, () => cancelled).catch(() => {})
    }
    if (video.readyState >= 1) start()
    else video.addEventListener('loadedmetadata', start, { once: true })
    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', start)
      // React StrictMode runs this effect twice in dev (setup → cleanup →
      // setup again) on the SAME <video> node — without an immediate pause
      // here, the first pass's pending play() and the second pass's play()/
      // pause() calls race on the shared element and can reject each
      // other's promise, silently killing the whole chain before it ever
      // reaches the backfill upload (confirmed: reproduced live, zero
      // network calls to /storage/:id/cover from a fresh dev reload).
      video.pause()
    }
  }, [isVideoFallback, entityId, src])

  if (kind === 'image') {
    return <img src={src} alt={alt} className={className} />
  }
  if (posterSrc) {
    return <img src={posterSrc} alt={alt} className={className} />
  }
  // crossOrigin is required for the backfill: without it, drawing this
  // cross-origin video onto a <canvas> taints it and toBlob() throws a
  // SecurityError (confirmed live) — silently swallowed by the caller's
  // catch, so the cover upload never happened despite everything else
  // working. Storage (Vercel Blob) already serves permissive CORS headers.
  return (
    <video ref={videoRef} src={src} muted playsInline preload="metadata" crossOrigin="anonymous" className={className} />
  )
}
