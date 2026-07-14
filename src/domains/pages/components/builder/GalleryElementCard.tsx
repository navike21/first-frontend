import { useRef, useState } from 'react'
import clsx from 'clsx'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { Button, IconButton, IconComponent, InputField, MediaLibraryModal, MediaThumbnail, Modal, SortableMediaTile, Tooltip } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import { MAX_BUILDER_COLUMNS } from '../../model/page.builder'
import type { BuilderColumnsCount, BuilderGalleryElement, BuilderGalleryImage, PageLocalizedString } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

const ACCEPTED = 'image/jpeg,image/png,image/webp'
const COLUMN_OPTIONS = Array.from({ length: MAX_BUILDER_COLUMNS }, (_, i) => (i + 1) as BuilderColumnsCount)

export interface GalleryElementCardProps {
  element: BuilderGalleryElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderGalleryElement>) => void
  /** `url` es la misma blob preview ya insertada en `images` — así el padre
   * sabe exactamente cuál reemplazar cuando la subida real termine. */
  onPickFile: (url: string, file: File) => void
  onRemoveImage: (url: string) => void
  onDelete: () => void
}

const isLangComplete = (images: BuilderGalleryImage[], lang: Language): boolean =>
  images.length > 0 && images.every((img) => !!img.alt[lang]?.trim())


export const GalleryElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onPickFile,
  onRemoveImage,
  onDelete,
}: GalleryElementCardProps) => {
  const { t } = usePagesTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const emptyAlt = (): PageLocalizedString => Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as PageLocalizedString

  const addFiles = (files: FileList | File[]) => {
    const newImages: BuilderGalleryImage[] = []
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      newImages.push({ url, alt: emptyAlt() })
      onPickFile(url, file)
    })
    if (newImages.length > 0) onChange({ images: [...element.images, ...newImages] })
  }

  // Ya tienen URL real (vienen de la biblioteca): se agregan directo, sin
  // pasar por `pendingGalleryFiles` — no hay nada que subir al guardar.
  const addLibraryFiles = (files: StorageFile[]) => {
    if (files.length === 0) return
    const newImages = files.map((file) => ({ url: file.original.url, alt: emptyAlt() }))
    onChange({ images: [...element.images, ...newImages] })
  }

  const removeImage = (url: string) => {
    onChange({ images: element.images.filter((img) => img.url !== url) })
    onRemoveImage(url)
  }

  const updateAlt = (url: string, value: string) => {
    onChange({ images: element.images.map((img) => (img.url === url ? { ...img, alt: { ...img.alt, [editing]: value } } : img)) })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = element.images.findIndex((img) => img.url === active.id)
    const to = element.images.findIndex((img) => img.url === over.id)
    if (from < 0 || to < 0) return
    onChange({ images: arrayMove(element.images, from, to) })
  }

  const langChipValues = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, isLangComplete(element.images, l) ? '1' : '']),
  ) as PageLocalizedString

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiGalleryLine"
      label={t.builder.galleryElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {element.images.length > 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full gap-1 overflow-x-auto rounded-md p-0.5 transition-colors hover:bg-surface-subtle"
        >
          {element.images.map((image) => (
            <span
              key={image.url}
              className="flex aspect-square h-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-subtle"
            >
              <MediaThumbnail src={image.url} kind="image" className="h-full w-full object-cover" />
            </span>
          ))}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.galleryEmpty}
        </button>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.galleryElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files)
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
            className={clsx(
              'flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-4 text-center transition-colors',
              isDragging ? 'border-primary-600 bg-primary-700/5' : 'border-border bg-surface-subtle hover:border-primary-600/60',
            )}
          >
            <IconComponent
              icon={isDragging ? 'RiDownloadLine' : 'RiUploadCloud2Line'}
              className={clsx('h-6 w-6', isDragging ? 'text-primary-600' : 'text-muted')}
            />
            <span className="text-sm font-medium text-foreground">
              {isDragging ? t.builder.galleryDragLabel : t.builder.galleryAddLabel}
            </span>
            {!isDragging && <span className="text-xs text-muted">{t.builder.galleryFormatsHint}</span>}
          </div>

          <Tooltip heading={t.builder.galleryLibraryLabel} position="top" size="small">
            <IconButton
              icon="RiFolderImageLine"
              variant="text"
              size="small"
              aria-label={t.builder.galleryLibraryLabel}
              onClick={() => setIsLibraryOpen(true)}
            />
          </Tooltip>

          <div className="flex items-center gap-1">
            {COLUMN_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${t.builder.columnsLabel}: ${n}`}
                aria-pressed={element.columns === n}
                onClick={() => onChange({ columns: n })}
                className={clsx(
                  'h-6 w-6 rounded-md text-xs font-semibold transition-colors',
                  element.columns === n
                    ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
                    : 'bg-surface-subtle text-muted hover:text-foreground',
                )}
              >
                {n}
              </button>
            ))}
          </div>

          <LangChips editing={editing} userLanguage={language} values={langChipValues} onChange={setEditing} />

          {element.images.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={element.images.map((img) => img.url)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {element.images.map((image) => (
                    <SortableMediaTile
                      key={image.url}
                      id={image.url}
                      src={image.url}
                      kind="image"
                      dragMode="handle"
                      dragLabel={t.builder.dragElement}
                      removeLabel={t.builder.galleryRemoveLabel}
                      onRemove={() => removeImage(image.url)}
                      footer={
                        <InputField
                          label={t.builder.galleryAlt}
                          value={image.alt[editing] ?? ''}
                          onChange={(e) => updateAlt(image.url, e.target.value)}
                        />
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </Modal>

      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        kind="image"
        multiple
        onSelectMultiple={addLibraryFiles}
        onUploadNew={(file) => addFiles([file])}
        uploadAccept={ACCEPTED}
        texts={t.builder.mediaLibrary}
      />
    </ElementShell>
  )
}
