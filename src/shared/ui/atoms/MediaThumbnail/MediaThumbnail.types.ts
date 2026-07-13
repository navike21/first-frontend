export interface MediaThumbnailProps {
  src: string
  kind: 'image' | 'video'
  /** Pre-generated cover image for a video (thumb/full URL) — when present,
   * renders a plain `<img>` instead of ever touching the video file itself. */
  posterSrc?: string
  /** StorageFile id — when a video has no `posterSrc` yet, enables a one-time
   * background backfill: the frame already being painted for the fallback
   * preview is also captured and persisted as the video's cover, so future
   * renders anywhere skip the video entirely. No-op for images. */
  entityId?: string
  alt?: string
  className?: string
}
