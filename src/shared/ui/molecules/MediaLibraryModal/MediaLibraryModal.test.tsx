import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { StorageFile } from '@/shared/api/storage'
import { MediaLibraryModal } from './MediaLibraryModal'
import type { MediaLibraryModalTexts } from './MediaLibraryModal.types'

const mockUseStorageFiles = vi.fn()
vi.mock('@/shared/api/storage.queries', () => ({
  useStorageFiles: (...args: unknown[]) => mockUseStorageFiles(...args),
}))

const texts: MediaLibraryModalTexts = {
  titleImage: 'Choose image',
  titleVideo: 'Choose video',
  searchPlaceholder: 'Search…',
  empty: 'No files',
  selectLabel: 'Select',
  prevPage: 'Previous',
  nextPage: 'Next',
  addSelectedLabel: 'Add selected',
  selectAllLabel: 'Select all',
  selectItemLabel: 'Select file',
  previewLabel: 'Preview',
  closePreviewLabel: 'Close preview',
  addToSelectionLabel: 'Add to selection',
  removeFromSelectionLabel: 'Remove from selection',
}

const videoFile: StorageFile = {
  id: 'video-1',
  entityType: 'editor',
  entityId: 'entity-1',
  originalName: 'clip.mp4',
  mimeType: 'video/mp4',
  size: 1000,
  isImage: false,
  original: { pathname: 'clip.mp4', url: 'https://cdn.example.com/clip.mp4' },
  // thumb already set so MediaThumbnail takes the cheap <img> path and its
  // own async play/capture effects never run in this test.
  thumb: { pathname: 'clip-thumb.webp', url: 'https://cdn.example.com/clip-thumb.webp' },
  uploadedBy: 'user-1',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const imageFile: StorageFile = {
  ...videoFile,
  id: 'image-1',
  isImage: true,
  originalName: 'photo.jpg',
  original: { pathname: 'photo.jpg', url: 'https://cdn.example.com/photo.jpg' },
}

describe('MediaLibraryModal video preview', () => {
  beforeEach(() => {
    mockUseStorageFiles.mockReturnValue({
      data: { items: [videoFile], meta: { total: 1, page: 1, limit: 12, totalPages: 1 } },
      isLoading: false,
      isFetching: false,
    })
  })

  it('shows a preview trigger on video tiles but not image tiles', () => {
    mockUseStorageFiles.mockReturnValue({
      data: { items: [imageFile], meta: { total: 1, page: 1, limit: 12, totalPages: 1 } },
      isLoading: false,
      isFetching: false,
    })
    render(<MediaLibraryModal isOpen kind="image" onSelect={vi.fn()} onClose={vi.fn()} texts={texts} />)
    expect(screen.queryByLabelText(`Preview: ${imageFile.originalName}`)).not.toBeInTheDocument()
  })

  it('opens an in-place preview without selecting, on clicking the preview trigger', () => {
    const onSelect = vi.fn()
    render(<MediaLibraryModal isOpen kind="video" onSelect={onSelect} onClose={vi.fn()} texts={texts} />)

    fireEvent.click(screen.getByLabelText(`Preview: ${videoFile.originalName}`))

    const video = document.querySelector('video[autoplay]')
    expect(video).toHaveAttribute('src', videoFile.original.url)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('single-select mode: the preview action button selects the file and closes the modal', () => {
    const onSelect = vi.fn()
    const onClose = vi.fn()
    render(<MediaLibraryModal isOpen kind="video" onSelect={onSelect} onClose={onClose} texts={texts} />)

    fireEvent.click(screen.getByLabelText(`Preview: ${videoFile.originalName}`))
    fireEvent.click(screen.getByRole('button', { name: 'Select' }))

    expect(onSelect).toHaveBeenCalledWith(videoFile)
    expect(onClose).toHaveBeenCalled()
  })

  it('multiple mode: the preview action button toggles selection and only closes the preview', () => {
    const onClose = vi.fn()
    render(
      <MediaLibraryModal isOpen kind="video" multiple onSelectMultiple={vi.fn()} onClose={onClose} texts={texts} />,
    )

    fireEvent.click(screen.getByLabelText(`Preview: ${videoFile.originalName}`))
    fireEvent.click(screen.getByRole('button', { name: 'Add to selection' }))

    expect(onClose).not.toHaveBeenCalled()
    expect(document.querySelector('video[autoplay]')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: `Add selected (1)` })).toBeInTheDocument()
  })

  it('closes the preview when clicking the close button', () => {
    render(<MediaLibraryModal isOpen kind="video" onSelect={vi.fn()} onClose={vi.fn()} texts={texts} />)

    fireEvent.click(screen.getByLabelText(`Preview: ${videoFile.originalName}`))
    fireEvent.click(screen.getByLabelText('Close preview'))

    expect(document.querySelector('video[autoplay]')).not.toBeInTheDocument()
  })
})
