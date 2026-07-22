import clsx from 'clsx'
import { useState, type KeyboardEvent } from 'react'
import { IconComponent } from '../../atoms/IconComponent'
import { MediaLibraryModal } from '../MediaLibraryModal'
import { useCoverPicker } from './CoverPicker.hooks'
import type { CoverPickerProps } from './CoverPicker.types'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'

// ─── Internal sub-components ──────────────────────────────────────────────────

interface PreviewContentProps {
  preview: string
  isCompact: boolean
  uploadLabel: string
  removeLabel: string
  disabled?: boolean
  onRemove?: () => void
  openPicker: () => void
  handleRemove: () => void
}

const PreviewContent = ({
  preview,
  isCompact,
  uploadLabel,
  removeLabel,
  disabled,
  onRemove,
  openPicker,
  handleRemove,
}: PreviewContentProps) => (
  <>
    <img
      src={preview}
      alt="preview"
      className={clsx(
        'rounded-lg object-contain',
        isCompact ? 'max-h-14 w-auto' : 'max-h-48 w-full'
      )}
    />
    {!disabled && onRemove && (
      <div className={clsx('flex items-center gap-2', isCompact ? 'mt-1' : 'mt-2 gap-3')}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openPicker() }}
          className={clsx(
            'flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5',
            'text-xs font-medium text-secondary transition-colors',
            'hover:border-primary-600 hover:text-primary-600'
          )}
        >
          <IconComponent icon="RiUploadLine" className="h-3.5 w-3.5" />
          {uploadLabel}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleRemove() }}
          aria-label={removeLabel}
          className={clsx(
            'flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5',
            'text-xs font-medium text-secondary transition-colors',
            'hover:border-danger-600 hover:text-danger-600'
          )}
        >
          <IconComponent icon="RiDeleteBinLine" className="h-3.5 w-3.5" />
          {removeLabel}
        </button>
      </div>
    )}
  </>
)

interface EmptyContentProps {
  isCompact: boolean
  isDragging: boolean
  hasError: boolean
  uploadLabel: string
  dragLabel: string
  dragOrLabel: string
  browseLabel: string
  displayError?: string | null
  openPicker: () => void
}

const EmptyContent = ({
  isCompact,
  isDragging,
  hasError,
  uploadLabel,
  dragLabel,
  dragOrLabel,
  browseLabel,
  displayError,
  openPicker,
}: EmptyContentProps) => {
  let dropIcon: 'RiDownloadLine' | 'RiErrorWarningLine' | 'RiImageAddLine' = 'RiImageAddLine'
  if (isDragging) dropIcon = 'RiDownloadLine'
  else if (hasError) dropIcon = 'RiErrorWarningLine'
  return (
  <>
    <div
      className={clsx(
        'flex items-center justify-center rounded-xl',
        isCompact ? 'h-10 w-10' : 'h-14 w-14',
        'border transition-colors',
        isDragging && 'border-primary-600 bg-surface text-primary-600',
        hasError && !isDragging && 'border-danger-200 bg-surface text-danger-600',
        !isDragging && !hasError && 'border-border bg-surface text-muted',
      )}
    >
      <IconComponent
        icon={dropIcon}
        className={isCompact ? 'h-5 w-5' : 'h-7 w-7'}
      />
    </div>
    <div className="text-center">
      <p className={clsx(
        'font-semibold',
        isCompact ? 'text-xs' : 'text-sm',
        hasError ? 'text-danger-600' : 'text-foreground',
      )}>
        {isDragging ? dragLabel : uploadLabel}
      </p>
      {!isDragging && (
        <p className={clsx('mt-0.5 text-secondary', isCompact ? 'text-xs' : 'mt-1 text-sm')}>
          {dragOrLabel}{' '}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openPicker() }}
            className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
          >
            {browseLabel}
          </button>
        </p>
      )}
      {displayError && (
        <p className="mt-1.5 text-xs font-medium text-danger-600">{displayError}</p>
      )}
    </div>
  </>
  )
}

// Opens picker on Enter/Space — defined at module scope to avoid nesting penalty
function makeKeyHandler(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }
}

interface DropzoneClassNameArgs {
  isCompact: boolean
  isDragging: boolean
  hasError: boolean
  disabled?: boolean
  isInteractive: boolean
}

// Extracted to keep the component's own cognitive complexity under the
// sonar limit — this is pure class computation, no behavior.
function dropzoneClassName({ isCompact, isDragging, hasError, disabled, isInteractive }: DropzoneClassNameArgs) {
  return clsx(
    // Layout
    'relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl',
    isCompact ? 'min-h-24 gap-2 p-3' : 'min-h-44 gap-3 p-6',
    // Visual
    'border-2 border-dashed transition-colors',
    // States — el manual muestra el dropzone vacío en blanco con borde
    // dashed border-hover (#B9C2D0, no el border por defecto), y el estado
    // arrastrando con un azul sólido claro (primary-100), no una opacidad.
    isDragging && 'border-primary-600 bg-primary-100',
    hasError && !isDragging && 'border-danger-200 bg-danger-50',
    !isDragging && !hasError && 'border-border-hover bg-surface',
    disabled && 'cursor-not-allowed opacity-50',
    isInteractive && !hasError && 'cursor-pointer hover:border-primary-600',
    isInteractive && hasError && 'cursor-pointer hover:border-danger-600',
  )
}

// Only an interactive (empty, enabled) dropzone gets click/keyboard/role
// semantics — extracted so the component itself doesn't carry these branches.
function dropzoneInteractionProps(isInteractive: boolean, onOpen: () => void) {
  if (!isInteractive) return {}
  return { onClick: onOpen, role: 'button' as const, tabIndex: 0, onKeyDown: makeKeyHandler(onOpen) }
}

// ─── Public component ─────────────────────────────────────────────────────────

export const CoverPicker = ({
  currentUrl,
  uploadLabel = 'Drop or select files',
  dragLabel = 'Drop to upload',
  dragOrLabel = 'Drag here or',
  browseLabel = 'browse',
  formatsHint,
  errorMessage,
  onChange,
  onRemove,
  removeLabel = 'Remove image',
  disabled,
  maxBytes,
  accept = ACCEPTED,
  variant = 'default',
  onSelectLibrary,
  libraryTexts,
}: CoverPickerProps) => {
  const {
    inputRef,
    preview,
    error,
    isDragging,
    handleChange,
    handleFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openPicker,
    handleRemove,
  } = useCoverPicker({ currentUrl, onChange, onRemove, maxBytes })
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const libraryFirst = Boolean(onSelectLibrary && libraryTexts)
  const openMain = libraryFirst ? () => setIsLibraryOpen(true) : openPicker

  const isCompact = variant === 'compact'
  const isInteractive = !preview && !disabled
  const dragHandlers = disabled
    ? {}
    : { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop }

  const displayError = error || errorMessage
  const hasError = !!displayError && !preview

  return (
    <div className="flex flex-col gap-2">
      <div
        {...dragHandlers}
        {...dropzoneInteractionProps(isInteractive, openMain)}
        className={dropzoneClassName({ isCompact, isDragging, hasError, disabled, isInteractive })}
        aria-label={uploadLabel}
      >
        {preview ? (
          <PreviewContent
            preview={preview}
            isCompact={isCompact}
            uploadLabel={uploadLabel}
            removeLabel={removeLabel}
            disabled={disabled}
            onRemove={onRemove}
            openPicker={openMain}
            handleRemove={handleRemove}
          />
        ) : (
          <EmptyContent
            isCompact={isCompact}
            isDragging={isDragging}
            hasError={hasError}
            uploadLabel={uploadLabel}
            dragLabel={dragLabel}
            dragOrLabel={dragOrLabel}
            browseLabel={browseLabel}
            displayError={displayError}
            openPicker={openMain}
          />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {formatsHint && !displayError && (
        <p className="text-xs text-muted">{formatsHint}</p>
      )}

      {onSelectLibrary && libraryTexts && (
        <MediaLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          kind="image"
          onSelect={onSelectLibrary}
          onUploadNew={handleFile}
          uploadAccept={accept}
          texts={libraryTexts}
        />
      )}
    </div>
  )
}
