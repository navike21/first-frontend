import { useRef } from 'react'
import clsx from 'clsx'
import { IconButton, IconComponent, InputField, Select, Switch, Tooltip } from '@/shared/ui'
import { usePagesTranslation } from '../../i18n'
import type { BackgroundSourceKind, BackgroundVideo, BackgroundVideoFile } from '../../model/page.types'

export interface BackgroundVideoFieldsProps {
  config: BackgroundVideo
  onChange: (patch: Partial<BackgroundVideo>) => void
  onPickFile: (slot: 'video-mp4' | 'video-webm', file: File) => void
  onOpenLibrary: (slot: 'video-mp4' | 'video-webm') => void
}

interface VideoFormatSlotProps {
  label: string
  mimeType: string
  file?: BackgroundVideoFile
  onPickFile: (file: File) => void
  onOpenLibrary: () => void
  onRemove: () => void
}

const VideoFormatSlot = ({ label, mimeType, file, onPickFile, onOpenLibrary, onRemove }: VideoFormatSlotProps) => {
  const { t } = usePagesTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <Tooltip heading={t.builder.background.pickFromLibrary} position="top" size="small">
            <IconButton
              icon="RiFolderVideoLine"
              variant="text"
              size="small"
              aria-label={t.builder.background.pickFromLibrary}
              onClick={onOpenLibrary}
            />
          </Tooltip>
          <Tooltip heading={file ? t.builder.background.replaceLabel : t.builder.background.uploadLabel} position="top" size="small">
            <IconButton
              icon="RiUploadLine"
              variant="text"
              size="small"
              aria-label={file ? t.builder.background.replaceLabel : t.builder.background.uploadLabel}
              onClick={() => inputRef.current?.click()}
            />
          </Tooltip>
          {file && (
            <Tooltip heading={t.builder.background.removeLabel} position="top" size="small">
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.builder.background.removeLabel}
                onClick={onRemove}
              />
            </Tooltip>
          )}
        </div>
      </div>

      {file ? (
        <video src={file.url} controls muted className="h-24 w-full rounded-md bg-black object-contain" />
      ) : (
        <div className={clsx('flex h-24 items-center justify-center rounded-md border border-dashed border-border bg-surface-subtle')}>
          <IconComponent icon="RiVideoAddLine" className="h-6 w-6 text-muted" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={mimeType}
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files?.[0]
          if (picked) onPickFile(picked)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export const BackgroundVideoFields = ({ config, onChange, onPickFile, onOpenLibrary }: BackgroundVideoFieldsProps) => {
  const { t } = usePagesTranslation()

  const sourceOptions = [
    { value: 'upload', label: t.builder.background.sourceUpload },
    { value: 'embed', label: t.builder.background.sourceEmbed },
  ]

  const mp4File = config.files.find((f) => f.mimeType === 'video/mp4')
  const webmFile = config.files.find((f) => f.mimeType === 'video/webm')

  const removeFile = (mimeType: string) => {
    onChange({ files: config.files.filter((f) => f.mimeType !== mimeType) })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-subtle p-3">
      <Select
        label={t.builder.background.sourceKindLabel}
        options={sourceOptions}
        value={config.sourceKind}
        onChange={(e) => onChange({ sourceKind: e.target.value as BackgroundSourceKind })}
      />

      {config.sourceKind === 'upload' && (
        <div className="grid grid-cols-2 gap-2">
          <VideoFormatSlot
            label={t.builder.background.formatMp4}
            mimeType="video/mp4"
            file={mp4File}
            onPickFile={(file) => onPickFile('video-mp4', file)}
            onOpenLibrary={() => onOpenLibrary('video-mp4')}
            onRemove={() => removeFile('video/mp4')}
          />
          <VideoFormatSlot
            label={t.builder.background.formatWebm}
            mimeType="video/webm"
            file={webmFile}
            onPickFile={(file) => onPickFile('video-webm', file)}
            onOpenLibrary={() => onOpenLibrary('video-webm')}
            onRemove={() => removeFile('video/webm')}
          />
        </div>
      )}
      {config.sourceKind === 'upload' && <p className="text-xs text-muted">{t.builder.background.formatHint}</p>}

      {config.sourceKind === 'embed' && (
        <InputField
          label={t.builder.background.embedUrlLabel}
          helperText={t.builder.background.embedUrlHint}
          value={config.embedUrl ?? ''}
          onChange={(e) => onChange({ embedUrl: e.target.value })}
        />
      )}

      <Switch
        label={t.builder.background.parallax}
        checked={config.parallax}
        onChange={(e) => onChange({ parallax: e.target.checked })}
      />
    </div>
  )
}
