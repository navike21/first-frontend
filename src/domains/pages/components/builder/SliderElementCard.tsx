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
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, IconButton, IconComponent, MediaLibraryModal, MediaThumbnail, Modal, Tooltip } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import type { BuilderSliderElement, BuilderSliderSlide } from '../../model/page.types'
import { ElementShell } from './ElementShell'

const ACCEPTED = 'image/jpeg,image/png,image/webp,video/mp4,video/webm'
const LIBRARY_ACCEPT: Record<'image' | 'video', string> = {
  image: 'image/jpeg,image/png,image/webp',
  video: 'video/mp4,video/webm',
}

export interface SliderElementCardProps {
  element: BuilderSliderElement
  sectionId: string
  columnId: string
  onChange: (patch: Partial<BuilderSliderElement>) => void
  /** `url` es la misma blob preview ya insertada en `slides` — así el padre
   * sabe exactamente cuál reemplazar cuando la subida real termine. */
  onPickFile: (url: string, file: File, kind: 'image' | 'video') => void
  /** Notifica que una diapositiva pendiente de subir fue quitada, para que el
   * padre no intente subirla igual al guardar (ver bug de subida huérfana). */
  onRemoveSlide: (url: string) => void
  onDelete: () => void
}

interface SlideTileProps {
  slide: BuilderSliderSlide
  removeLabel: string
  onRemove: (url: string) => void
}

const SlideTile = ({ slide, removeLabel, onRemove }: SlideTileProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.url })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={clsx(
        'relative aspect-square touch-none cursor-grab overflow-hidden rounded-lg border border-border bg-surface-subtle transition-opacity active:cursor-grabbing',
        isDragging && 'opacity-50',
      )}
    >
      <MediaThumbnail src={slide.url} kind={slide.kind} className="h-full w-full object-cover" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onRemove(slide.url)
        }}
        aria-label={removeLabel}
        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white ring-2 ring-surface transition-colors hover:bg-red-700"
      >
        <IconComponent icon="RiDeleteBinLine" className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export const SliderElementCard = ({
  element,
  sectionId,
  columnId,
  onChange,
  onPickFile,
  onRemoveSlide,
  onDelete,
}: SliderElementCardProps) => {
  const { t } = usePagesTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [libraryKind, setLibraryKind] = useState<'image' | 'video' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const addFiles = (files: FileList | File[]) => {
    const newSlides: BuilderSliderSlide[] = []
    Array.from(files).forEach((file) => {
      const kind: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image'
      const url = URL.createObjectURL(file)
      newSlides.push({ url, kind })
      onPickFile(url, file, kind)
    })
    if (newSlides.length > 0) onChange({ slides: [...element.slides, ...newSlides] })
  }

  // Ya tienen URL real (vienen de la biblioteca): se agregan directo, sin
  // pasar por `pendingSliderFiles` — no hay nada que subir al guardar.
  const addLibraryFiles = (files: StorageFile[]) => {
    if (!libraryKind || files.length === 0) return
    const newSlides = files.map((file) => ({ url: file.original.url, kind: libraryKind }))
    onChange({ slides: [...element.slides, ...newSlides] })
    setLibraryKind(null)
  }

  const removeSlide = (url: string) => {
    onChange({ slides: element.slides.filter((s) => s.url !== url) })
    onRemoveSlide(url)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = element.slides.findIndex((s) => s.url === active.id)
    const to = element.slides.findIndex((s) => s.url === over.id)
    if (from < 0 || to < 0) return
    onChange({ slides: arrayMove(element.slides, from, to) })
  }

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiCarouselView"
      label={t.builder.sliderElement}
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

      {element.slides.length > 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full gap-1 overflow-x-auto rounded-md p-0.5 transition-colors hover:bg-surface-subtle"
        >
          {element.slides.map((slide) => (
            <span
              key={slide.url}
              className="flex aspect-square h-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-subtle"
            >
              <MediaThumbnail src={slide.url} kind={slide.kind} className="h-full w-full object-cover" />
            </span>
          ))}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.sliderEmpty}
        </button>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.sliderElement}
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
              {isDragging ? t.builder.sliderDragLabel : t.builder.sliderAddLabel}
            </span>
            {!isDragging && <span className="text-xs text-muted">{t.builder.sliderFormatsHint}</span>}
          </div>

          <div className="flex items-center gap-1">
            <Tooltip heading={t.builder.sliderLibraryImage} position="top" size="small">
              <IconButton
                icon="RiFolderImageLine"
                variant="text"
                size="small"
                aria-label={t.builder.sliderLibraryImage}
                onClick={() => setLibraryKind('image')}
              />
            </Tooltip>
            <Tooltip heading={t.builder.sliderLibraryVideo} position="top" size="small">
              <IconButton
                icon="RiFolderVideoLine"
                variant="text"
                size="small"
                aria-label={t.builder.sliderLibraryVideo}
                onClick={() => setLibraryKind('video')}
              />
            </Tooltip>
          </div>

          {element.slides.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={element.slides.map((s) => s.url)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {element.slides.map((slide) => (
                    <SlideTile
                      key={slide.url}
                      slide={slide}
                      removeLabel={t.builder.sliderRemoveLabel}
                      onRemove={removeSlide}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </Modal>

      <MediaLibraryModal
        isOpen={libraryKind !== null}
        onClose={() => setLibraryKind(null)}
        kind={libraryKind ?? 'image'}
        multiple
        onSelectMultiple={addLibraryFiles}
        onUploadNew={(file) => addFiles([file])}
        uploadAccept={libraryKind ? LIBRARY_ACCEPT[libraryKind] : undefined}
        texts={t.builder.mediaLibrary}
      />
    </ElementShell>
  )
}
