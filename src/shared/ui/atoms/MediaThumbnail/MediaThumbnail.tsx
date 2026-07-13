import type { MediaThumbnailProps } from './MediaThumbnail.types'

/**
 * Real thumbnail for both images and videos — a plain `<video>` with no
 * `autoplay` renders its first frame once metadata loads, so this needs no
 * poster/backend support to show what a video actually looks like (instead
 * of a generic icon).
 */
export const MediaThumbnail = ({ src, kind, alt = '', className }: MediaThumbnailProps) => {
  if (kind === 'image') {
    return <img src={src} alt={alt} className={className} />
  }
  return <video src={src} muted playsInline preload="metadata" className={className} />
}
