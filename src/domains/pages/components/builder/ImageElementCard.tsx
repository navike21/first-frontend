import { useState } from 'react'
import clsx from 'clsx'
import { Button, IconButton, InputField, MediaLibraryModal, Modal, Select, Tooltip } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderImageElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'

export interface ImageElementCardProps {
  element: BuilderImageElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderImageElement>) => void
  onPickFile: (file: File) => void
  onSelectLibrary: (file: StorageFile) => void
  onDelete: () => void
}

const ALIGN_CLASS: Record<BuilderImageElement['align'], string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const ImageElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onPickFile,
  onSelectLibrary,
  onDelete,
}: ImageElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const alignOptions: { value: BuilderImageElement['align']; label: string }[] = [
    { value: 'left', label: t.builder.alignLeft },
    { value: 'center', label: t.builder.alignCenter },
    { value: 'right', label: t.builder.alignRight },
  ]

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiImageLine"
      label={t.builder.imageElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      {element.url ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx('flex w-full rounded-md transition-colors hover:bg-surface-subtle', ALIGN_CLASS[element.align])}
        >
          <img
            src={element.url}
            alt={element.alt[language] || ''}
            className="max-h-40 rounded-md object-cover"
            style={{
              ...(element.width && { width: element.width }),
              ...(element.height && { height: element.height }),
            }}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsLibraryOpen(true)}
          className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.imageSelect}
        </button>
      )}

      {/* Editor de imagen: 2 columnas — preview con botón flotante de cambio | opciones */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="xl"
        title={t.builder.imageElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative">
            {element.url ? (
              <div
                className={clsx(
                  'flex min-h-48 rounded-lg border border-border bg-surface-subtle p-2',
                  ALIGN_CLASS[element.align],
                )}
              >
                <img
                  src={element.url}
                  alt={element.alt[editing] || ''}
                  className="max-h-72 rounded-md object-contain"
                  style={{
                    ...(element.width && { width: element.width }),
                    ...(element.height && { height: element.height }),
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
              >
                {t.builder.imageSelect}
              </button>
            )}
            {element.url && (
              <div className="absolute right-4 top-4">
                <Tooltip heading={t.builder.imageReplace} position="top" size="small">
                  <span className="inline-flex rounded-full bg-surface shadow-md ring-1 ring-border">
                    <IconButton
                      icon="RiImageEditLine"
                      variant="text"
                      size="small"
                      aria-label={t.builder.imageReplace}
                      onClick={() => setIsLibraryOpen(true)}
                    />
                  </span>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <InputField
                  label={t.builder.widthLabel}
                  value={element.width}
                  onChange={(e) => onChange({ width: e.target.value.trim() })}
                />
                <p className="text-xs text-muted">{t.builder.sizeHint}</p>
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  label={t.builder.heightLabel}
                  value={element.height}
                  onChange={(e) => onChange({ height: e.target.value.trim() })}
                />
                <p className="text-xs text-muted">{t.builder.sizeHint}</p>
              </div>
            </div>
            <Select
              label={t.builder.alignLabel}
              options={alignOptions}
              value={element.align}
              lang={language}
              onChange={(e) => onChange({ align: e.target.value as BuilderImageElement['align'] })}
            />
            <div className="flex flex-col gap-2">
              <LangChips editing={editing} userLanguage={language} values={element.alt} onChange={setEditing} />
              <InputField
                label={t.builder.imageAlt}
                value={element.alt[editing] ?? ''}
                onChange={(e) => onChange({ alt: { ...element.alt, [editing]: e.target.value } })}
              />
            </div>
          </div>
        </div>
      </Modal>

      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        kind="image"
        onSelect={onSelectLibrary}
        onUploadNew={onPickFile}
        uploadAccept={ACCEPTED}
        texts={t.builder.mediaLibrary}
      />
    </ElementShell>
  )
}
