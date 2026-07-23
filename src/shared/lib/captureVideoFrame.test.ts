import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { captureVideoFrame, drawVideoFrameToBlob } from './captureVideoFrame'

const file = new File(['fake-video'], 'clip.mp4', { type: 'video/mp4' })

/** The video is deliberately never attached to the DOM (matches every
 * "generate a thumbnail from a local video" recipe — no browser requires it
 * in the tree just to seek/drawImage), so tests must capture the actual
 * element via `createElement` rather than querying the document. */
function installVideoCapture(): () => HTMLVideoElement {
  const realCreateElement = document.createElement.bind(document)
  let created: HTMLVideoElement | null = null
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    const el = realCreateElement(tag)
    if (tag === 'video') created = el as HTMLVideoElement
    return el
  })
  return () => {
    if (!created) throw new Error('video element was not created yet')
    return created
  }
}

function triggerVideoLoad(
  video: HTMLVideoElement,
  width = 640,
  height = 360,
  duration = 4
) {
  Object.defineProperty(video, 'videoWidth', {
    value: width,
    configurable: true,
  })
  Object.defineProperty(video, 'videoHeight', {
    value: height,
    configurable: true,
  })
  Object.defineProperty(video, 'duration', {
    value: duration,
    configurable: true,
  })
  video.dispatchEvent(new Event('loadedmetadata'))
  video.dispatchEvent(new Event('seeked'))
}

describe('captureVideoFrame', () => {
  let revokeObjectURL: ReturnType<typeof vi.fn>
  let drawImage: ReturnType<typeof vi.fn>

  beforeEach(() => {
    URL.createObjectURL = vi.fn(
      () => 'blob:mock-url'
    ) as typeof URL.createObjectURL
    revokeObjectURL = vi.fn()
    URL.revokeObjectURL = revokeObjectURL as typeof URL.revokeObjectURL

    drawImage = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(
      function (this: HTMLCanvasElement, callback: BlobCallback) {
        callback(new Blob(['fake-frame'], { type: 'image/jpeg' }))
      }
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('seeks past 0s and resolves the captured frame as a jpeg blob', async () => {
    const getVideo = installVideoCapture()
    const promise = captureVideoFrame(file)
    triggerVideoLoad(getVideo())
    const blob = await promise

    expect(blob).toBeInstanceOf(Blob)
    expect(blob?.type).toBe('image/jpeg')
    expect(drawImage).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })

  it('clamps the seek target to the video duration', async () => {
    const getVideo = installVideoCapture()
    const promise = captureVideoFrame(file, 10)
    triggerVideoLoad(getVideo(), 640, 360, 2)
    await promise

    expect(getVideo().currentTime).toBe(2)
  })

  it('resolves null when the canvas context is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const getVideo = installVideoCapture()

    const promise = captureVideoFrame(file)
    triggerVideoLoad(getVideo())

    await expect(promise).resolves.toBeNull()
  })

  it('resolves null when the video fails to load', async () => {
    const getVideo = installVideoCapture()
    const promise = captureVideoFrame(file)
    getVideo().dispatchEvent(new Event('error'))

    await expect(promise).resolves.toBeNull()
  })
})

describe('drawVideoFrameToBlob', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('draws an already-live video element straight to a jpeg blob', async () => {
    const drawImage = vi.fn()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(
      function (this: HTMLCanvasElement, callback: BlobCallback) {
        callback(new Blob(['fake-frame'], { type: 'image/jpeg' }))
      }
    )
    const video = document.createElement('video')
    Object.defineProperty(video, 'videoWidth', {
      value: 640,
      configurable: true,
    })
    Object.defineProperty(video, 'videoHeight', {
      value: 360,
      configurable: true,
    })

    const blob = await drawVideoFrameToBlob(video)

    expect(blob?.type).toBe('image/jpeg')
    expect(drawImage).toHaveBeenCalledWith(video, 0, 0, 640, 360)
  })

  it('resolves null when the canvas context is unavailable', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const video = document.createElement('video')

    await expect(drawVideoFrameToBlob(video)).resolves.toBeNull()
  })
})
