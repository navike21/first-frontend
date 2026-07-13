import { useEffect, useRef } from 'react'
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

export const MediaThumbnail = ({ src, kind, alt = '', className }: MediaThumbnailProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (kind !== 'video') return
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    const start = () => {
      void paintVideoFrame(video, () => cancelled)
    }
    if (video.readyState >= 1) start()
    else video.addEventListener('loadedmetadata', start, { once: true })
    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', start)
    }
  }, [kind, src])

  if (kind === 'image') {
    return <img src={src} alt={alt} className={className} />
  }
  return <video ref={videoRef} src={src} muted playsInline preload="metadata" className={className} />
}
