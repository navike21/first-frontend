import { useState } from 'react'
import clsx from 'clsx'
import {
  IconButton,
  IconComponent,
  InputField,
  MediaLibraryModal,
  Select,
  Switch,
  Tooltip,
} from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import type {
  BackgroundSourceKind,
  BackgroundVideo,
  BackgroundVideoFile,
} from '../../model/page.types'

export interface BackgroundVideoFieldsProps {
  config: BackgroundVideo
  onChange: (patch: Partial<BackgroundVideo>) => void
  onPickFile: (slot: 'video-mp4' | 'video-webm', file: File) => void
  onSelectLibrary: (slot: 'video-mp4' | 'video-webm', file: StorageFile) => void
}

interface VideoFormatSlotProps {
  label: string
  mimeType: string
  file?: BackgroundVideoFile
  onPickFile: (file: File) => void
  onSelectLibrary: (file: StorageFile) => void
  onRemove: () => void
}

const VideoFormatSlot = ({
  label,
  mimeType,
  file,
  onPickFile,
  onSelectLibrary,
  onRemove,
}: VideoFormatSlotProps) => {
  const { t } = usePagesTranslation()
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  return (
    <div className="border-border bg-surface flex flex-col gap-2 rounded-lg border p-2">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-xs font-medium">{label}</span>
        <div className="flex items-center gap-1">
          <Tooltip
            heading={
              file
                ? t.builder.background.replaceLabel
                : t.builder.background.uploadLabel
            }
            position="top"
            size="small"
          >
            <IconButton
              icon="RiFolderVideoLine"
              variant="text"
              size="small"
              aria-label={
                file
                  ? t.builder.background.replaceLabel
                  : t.builder.background.uploadLabel
              }
              onClick={() => setIsLibraryOpen(true)}
            />
          </Tooltip>
          {file && (
            <Tooltip
              heading={t.builder.background.removeLabel}
              position="top"
              size="small"
            >
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
        <video
          src={file.url}
          controls
          muted
          className="h-24 w-full rounded-md bg-black object-contain"
        />
      ) : (
        <div
          className={clsx(
            'border-border bg-surface-subtle flex h-24 items-center justify-center rounded-md border border-dashed'
          )}
        >
          <IconComponent icon="RiVideoAddLine" className="text-muted h-6 w-6" />
        </div>
      )}

      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        kind="video"
        onSelect={onSelectLibrary}
        onUploadNew={onPickFile}
        uploadAccept={mimeType}
        texts={t.builder.mediaLibrary}
      />
    </div>
  )
}

export const BackgroundVideoFields = ({
  config,
  onChange,
  onPickFile,
  onSelectLibrary,
}: BackgroundVideoFieldsProps) => {
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
    <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-xl border p-3">
      <Select
        label={t.builder.background.sourceKindLabel}
        options={sourceOptions}
        value={config.sourceKind}
        onChange={(e) =>
          onChange({ sourceKind: e.target.value as BackgroundSourceKind })
        }
      />

      {config.sourceKind === 'upload' && (
        <div className="grid grid-cols-2 gap-2">
          <VideoFormatSlot
            label={t.builder.background.formatMp4}
            mimeType="video/mp4"
            file={mp4File}
            onPickFile={(file) => onPickFile('video-mp4', file)}
            onSelectLibrary={(file) => onSelectLibrary('video-mp4', file)}
            onRemove={() => removeFile('video/mp4')}
          />
          <VideoFormatSlot
            label={t.builder.background.formatWebm}
            mimeType="video/webm"
            file={webmFile}
            onPickFile={(file) => onPickFile('video-webm', file)}
            onSelectLibrary={(file) => onSelectLibrary('video-webm', file)}
            onRemove={() => removeFile('video/webm')}
          />
        </div>
      )}
      {config.sourceKind === 'upload' && (
        <p className="text-muted text-xs">{t.builder.background.formatHint}</p>
      )}

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
