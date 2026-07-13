import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MediaThumbnail } from './MediaThumbnail'

vi.mock('@/shared/api/storage', () => ({
  attachVideoCoverWithRetry: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/shared/lib/captureVideoFrame', () => ({
  drawVideoFrameToBlob: vi.fn().mockResolvedValue(new Blob(['frame'], { type: 'image/jpeg' })),
}))

import { attachVideoCoverWithRetry } from '@/shared/api/storage'

describe('MediaThumbnail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    HTMLMediaElement.prototype.pause = vi.fn()
  })

  it('renders a plain img for images', () => {
    const { container } = render(<MediaThumbnail src="photo.jpg" kind="image" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', 'photo.jpg')
    expect(container.querySelector('video')).not.toBeInTheDocument()
  })

  it('renders the poster image directly for video when posterSrc is present — no video element at all', () => {
    const { container } = render(<MediaThumbnail src="clip.mp4" kind="video" posterSrc="cover.jpg" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', 'cover.jpg')
    expect(container.querySelector('video')).not.toBeInTheDocument()
  })

  it('falls back to a video element when no posterSrc is available', () => {
    const { container } = render(<MediaThumbnail src="clip.mp4" kind="video" />)
    const video = container.querySelector('video')
    expect(video).toHaveAttribute('src', 'clip.mp4')
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('backfills a cover once the fallback frame paints, when entityId is provided', async () => {
    const { container } = render(<MediaThumbnail src="clip.mp4" kind="video" entityId="file-1" />)
    const video = container.querySelector('video') as HTMLVideoElement
    Object.defineProperty(video, 'readyState', { value: 1, configurable: true })
    video.dispatchEvent(new Event('loadedmetadata'))

    await vi.waitFor(() => expect(attachVideoCoverWithRetry).toHaveBeenCalledWith('file-1', expect.any(Blob)))
  })

  it('does not attempt a backfill when entityId is absent', async () => {
    const { container } = render(<MediaThumbnail src="clip.mp4" kind="video" />)
    const video = container.querySelector('video') as HTMLVideoElement
    Object.defineProperty(video, 'readyState', { value: 1, configurable: true })
    video.dispatchEvent(new Event('loadedmetadata'))

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(attachVideoCoverWithRetry).not.toHaveBeenCalled()
  })
})
