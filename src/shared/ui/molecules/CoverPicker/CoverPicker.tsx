import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent'
import { useCoverPicker } from './CoverPicker.hooks'
import type { CoverPickerProps } from './CoverPicker.types'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'

export const CoverPicker = ({
  currentUrl,
  uploadLabel = 'Drop or select files',
  dragLabel = 'Drop to upload',
  browseLabel = 'browse',
  formatsHint,
  onChange,
  onRemove,
  removeLabel = 'Remove image',
  disabled,
  maxBytes,
  accept = ACCEPTED,
  variant = 'default',
}: CoverPickerProps) => {
  const {
    inputRef,
    preview,
    error,
    isDragging,
    handleChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openPicker,
    handleRemove,
  } = useCoverPicker({ currentUrl, onChange, onRemove, maxBytes })

  const isCompact = variant === 'compact'

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={disabled ? undefined : handleDragOver}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDrop={disabled ? undefined : handleDrop}
        className={clsx(
          // Layout
          'relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl',
          isCompact ? 'min-h-24 gap-2 p-3' : 'min-h-44 gap-3 p-6',
          // Visual
          'border-2 border-dashed transition-colors',
          // States
          isDragging
            ? 'border-primary-600 bg-primary-700/5'
            : 'border-border bg-surface-subtle',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && !preview && 'cursor-pointer hover:border-primary-600/60 hover:bg-primary-700/5'
        )}
        onClick={preview ? undefined : (!disabled ? openPicker : undefined)}
        role={preview ? undefined : 'button'}
        tabIndex={preview || disabled ? undefined : 0}
        onKeyDown={
          preview || disabled
            ? undefined
            : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openPicker()
                }
              }
        }
        aria-label={uploadLabel}
      >
        {preview ? (
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
                  onClick={(e) => {
                    e.stopPropagation()
                    openPicker()
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  aria-label={removeLabel}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5',
                    'text-xs font-medium text-secondary transition-colors',
                    'hover:border-red-500 hover:text-red-500'
                  )}
                >
                  <IconComponent icon="RiDeleteBinLine" className="h-3.5 w-3.5" />
                  {removeLabel}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div
              className={clsx(
                'flex items-center justify-center rounded-xl',
                isCompact ? 'h-10 w-10' : 'h-14 w-14',
                'bg-surface text-muted',
                'border border-border',
                'transition-colors',
                isDragging && 'border-primary-600 text-primary-600'
              )}
            >
              <IconComponent
                icon={isDragging ? 'RiDownloadLine' : 'RiImageAddLine'}
                className={isCompact ? 'h-5 w-5' : 'h-7 w-7'}
              />
            </div>
            <div className="text-center">
              <p className={clsx('font-semibold text-foreground', isCompact ? 'text-xs' : 'text-sm')}>
                {isDragging ? dragLabel : uploadLabel}
              </p>
              {!isDragging && (
                <p className={clsx('mt-0.5 text-secondary', isCompact ? 'text-xs' : 'text-sm mt-1')}>
                  Drag here or{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openPicker()
                    }}
                    className="font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
                  >
                    {browseLabel}
                  </button>
                </p>
              )}
            </div>
          </>
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

      {formatsHint && !error && (
        <p className="text-xs text-muted">{formatsHint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
