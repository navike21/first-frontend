import { useState } from 'react'
import clsx from 'clsx'
import {
  Button,
  IconButton,
  IconComponent,
  InputField,
  MediaLibraryModal,
  MediaThumbnail,
  Modal,
  Select,
  Tooltip,
} from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type {
  BackgroundSourceKind,
  BuilderVideoElement,
} from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

const LIBRARY_ACCEPT = 'video/mp4,video/webm'

export interface VideoElementCardProps {
  element: BuilderVideoElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderVideoElement>) => void
  /** `url` es la misma blob preview ya fijada en el elemento — así el padre
   * sabe cuál reemplazar cuando la subida real termine (mismo patrón que el
   * slider). */
  onPickFile: (url: string, file: File) => void
  /** Notifica que un video pendiente de subir fue quitado/reemplazado, para
   * que el padre no lo suba igual al guardar (bug de subida huérfana). */
  onRemoveFile: (url: string) => void
  onDelete: () => void
}

export const VideoElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onPickFile,
  onRemoveFile,
  onDelete,
}: VideoElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const sourceOptions = [
    { value: 'upload', label: t.builder.videoSourceLibrary },
    { value: 'embed', label: t.builder.videoSourceEmbed },
  ]

  const hasContent =
    element.sourceKind === 'embed' ? !!element.url : !!element.fileUrl

  // Ya tiene URL real (de la biblioteca): se aplica directo, sin subida
  // diferida; limpia cualquier pendiente que hubiera quedado de una subida
  // previa para este mismo elemento (mutuamente excluyentes).
  const selectFromLibrary = (file: StorageFile) => {
    if (element.fileUrl) onRemoveFile(element.fileUrl)
    onChange({
      sourceKind: 'upload',
      fileUrl: file.original.url,
      posterUrl: file.thumb?.url ?? file.full?.url,
    })
    setIsLibraryOpen(false)
  }

  // Subida diferida: preview optimista con blob local, el archivo real se sube
  // al guardar (mismo patrón que slider/imagen).
  const pickUpload = (file: File) => {
    if (element.fileUrl) onRemoveFile(element.fileUrl)
    const previewUrl = URL.createObjectURL(file)
    onChange({
      sourceKind: 'upload',
      fileUrl: previewUrl,
      posterUrl: undefined,
    })
    onPickFile(previewUrl, file)
    setIsLibraryOpen(false)
  }

  const removeUpload = () => {
    if (element.fileUrl) onRemoveFile(element.fileUrl)
    onChange({ fileUrl: undefined, posterUrl: undefined })
  }

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiVideoLine"
      label={t.builder.videoElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:bg-surface-subtle flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-left transition-colors"
      >
        {element.sourceKind === 'upload' && element.fileUrl ? (
          <span className="bg-surface-subtle flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md">
            <MediaThumbnail
              src={element.fileUrl}
              kind="video"
              posterSrc={element.posterUrl}
              className="h-full w-full object-cover"
            />
          </span>
        ) : (
          <IconComponent
            icon="RiVideoLine"
            className="text-muted h-5 w-5 shrink-0"
          />
        )}
        {hasContent ? (
          <span className="text-foreground truncate text-xs">
            {element.sourceKind === 'embed'
              ? element.url
              : t.builder.videoFromLibrary}
          </span>
        ) : (
          <span className="text-muted text-xs">{t.builder.videoEmpty}</span>
        )}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.videoElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <Select
            label={t.builder.videoSourceLabel}
            options={sourceOptions}
            value={element.sourceKind}
            onChange={(e) =>
              onChange({ sourceKind: e.target.value as BackgroundSourceKind })
            }
          />

          {element.sourceKind === 'embed' && (
            <InputField
              label={t.builder.videoUrlLabel}
              helperText={t.builder.videoUrlHint}
              value={element.url}
              onChange={(e) => onChange({ url: e.target.value.trim() })}
            />
          )}

          {element.sourceKind === 'upload' && (
            <div className="border-border bg-surface-subtle flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground text-xs font-medium">
                  {t.builder.videoFile}
                </span>
                <div className="flex items-center gap-1">
                  <Tooltip
                    heading={
                      element.fileUrl
                        ? t.builder.videoReplace
                        : t.builder.videoChoose
                    }
                    position="top"
                    size="small"
                  >
                    <IconButton
                      icon="RiFolderVideoLine"
                      variant="text"
                      size="small"
                      aria-label={
                        element.fileUrl
                          ? t.builder.videoReplace
                          : t.builder.videoChoose
                      }
                      onClick={() => setIsLibraryOpen(true)}
                    />
                  </Tooltip>
                  {element.fileUrl && (
                    <Tooltip
                      heading={t.builder.videoRemove}
                      position="top"
                      size="small"
                    >
                      <IconButton
                        icon="RiDeleteBinLine"
                        variant="text"
                        size="small"
                        aria-label={t.builder.videoRemove}
                        onClick={removeUpload}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>

              {element.fileUrl ? (
                <video
                  src={element.fileUrl}
                  poster={element.posterUrl}
                  controls
                  muted
                  className="h-40 w-full rounded-md bg-black object-contain"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(true)}
                  className={clsx(
                    'border-border text-muted hover:border-primary-600/50 hover:text-foreground flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed text-xs transition-colors'
                  )}
                >
                  <IconComponent icon="RiVideoAddLine" className="h-6 w-6" />
                  {t.builder.videoChoose}
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <LangChips
              editing={editing}
              userLanguage={language}
              values={element.caption}
              onChange={setEditing}
            />
            <InputField
              label={t.builder.videoCaptionLabel}
              value={element.caption[editing] ?? ''}
              onChange={(e) =>
                onChange({
                  caption: { ...element.caption, [editing]: e.target.value },
                })
              }
            />
          </div>
        </div>
      </Modal>

      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        kind="video"
        onSelect={selectFromLibrary}
        onUploadNew={pickUpload}
        uploadAccept={LIBRARY_ACCEPT}
        texts={t.builder.mediaLibrary}
      />
    </ElementShell>
  )
}
