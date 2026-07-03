import clsx from 'clsx'
import { IconComponent } from '@/shared/ui/atoms/IconComponent'
import { usePhotoPicker } from './PhotoPicker.hooks'
import type { PhotoPickerProps } from './PhotoPicker.types'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/svg+xml'

export const PhotoPicker = ({
  currentUrl,
  uploadLabel,
  formatsHint,
  onChange,
  onRemove,
  removeLabel,
  disabled,
}: PhotoPickerProps) => {
  const { inputRef, preview, error, handleChange, openPicker, handleRemove } =
    usePhotoPicker({
      currentUrl,
      onChange,
      onRemove,
    })

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {preview && onRemove && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            aria-label={removeLabel}
            className={clsx(
              // Layout
              'absolute top-0 right-0 z-10 flex h-7 w-7 items-center justify-center',
              // Visual base
              'rounded-full bg-red-600 text-white ring-2 ring-surface',
              // Transitions
              'transition-colors',
              // Hover
              'hover:bg-red-700',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <IconComponent icon="RiCloseLine" className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={openPicker}
          className={clsx(
            // Layout
            'group relative cursor-pointer',
            // States
            'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label={uploadLabel}
        >
          <div
            className={clsx(
              'h-32 w-32 overflow-hidden rounded-full border-2 border-dashed transition-colors',
              preview
                ? 'border-transparent'
                : 'border-slate-300 group-hover:border-blue-400 dark:border-slate-600'
            )}
          >
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800">
                <IconComponent
                  icon="RiCameraLine"
                  className="h-7 w-7 text-slate-400 transition-colors group-hover:text-blue-400 dark:text-slate-500"
                />
                <span className="px-2 text-center text-xs leading-tight text-slate-400 transition-colors group-hover:text-blue-400 dark:text-slate-500">
                  {uploadLabel}
                </span>
              </div>
            )}
          </div>
          {preview && (
            <span className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white ring-2 ring-surface">
              <IconComponent icon="RiCameraLine" className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <p className="text-center text-xs leading-snug text-secondary">
        {formatsHint}
      </p>
      {error && <p className="text-center text-xs text-red-500">{error}</p>}
    </div>
  )
}
