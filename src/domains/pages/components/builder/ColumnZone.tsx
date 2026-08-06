import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { ActionMenu, type ActionMenuItem } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderColumn, BuilderElementPatch } from '../../model/page.types'
import { TextElementCard } from './TextElementCard'
import { ImageElementCard } from './ImageElementCard'
import { SliderElementCard } from './SliderElementCard'
import { ButtonElementCard } from './ButtonElementCard'
import { GalleryElementCard } from './GalleryElementCard'
import { AccordionElementCard } from './AccordionElementCard'
import { TestimonialsElementCard } from './TestimonialsElementCard'
import { StatsElementCard } from './StatsElementCard'
import { VideoElementCard } from './VideoElementCard'
import { MapElementCard } from './MapElementCard'

export interface ColumnZoneProps {
  sectionId: string
  column: BuilderColumn
  language: Language
  languages: readonly Language[]
  /** true mientras se arrastra un elemento en cualquier parte del lienzo. */
  elementDragActive: boolean
  onAddText: () => void
  onAddImage: () => void
  onAddSlider: () => void
  onAddButton: () => void
  onAddGallery: () => void
  onAddAccordion: () => void
  onAddTestimonials: () => void
  onAddStats: () => void
  onAddVideo: () => void
  onAddMap: () => void
  onElementChange: (elementId: string, patch: BuilderElementPatch) => void
  onElementDelete: (elementId: string) => void
  onPickFile: (elementId: string, file: File) => void
  onSelectImageLibrary: (elementId: string, file: StorageFile) => void
  onPickSliderFile: (
    elementId: string,
    url: string,
    file: File,
    kind: 'image' | 'video'
  ) => void
  onRemoveSliderFile: (url: string) => void
  onPickGalleryFile: (elementId: string, url: string, file: File) => void
  onRemoveGalleryFile: (url: string) => void
  onPickTestimonialAvatarFile: (
    elementId: string,
    url: string,
    file: File
  ) => void
  onRemoveTestimonialAvatarFile: (url: string) => void
  onPickVideoFile: (elementId: string, url: string, file: File) => void
  onRemoveVideoFile: (url: string) => void
}

/**
 * Una columna del section: zona droppable (los elementos SOLO viven dentro de
 * columnas) + lista sortable. El DndContext es global, así que un elemento
 * puede nacer aquí y soltarse en cualquier otra columna o sección.
 */
export const ColumnZone = ({
  sectionId,
  column,
  language,
  languages,
  elementDragActive,
  onAddText,
  onAddImage,
  onAddSlider,
  onAddButton,
  onAddGallery,
  onAddAccordion,
  onAddTestimonials,
  onAddStats,
  onAddVideo,
  onAddMap,
  onElementChange,
  onElementDelete,
  onPickFile,
  onSelectImageLibrary,
  onPickSliderFile,
  onRemoveSliderFile,
  onPickGalleryFile,
  onRemoveGalleryFile,
  onPickTestimonialAvatarFile,
  onRemoveTestimonialAvatarFile,
  onPickVideoFile,
  onRemoveVideoFile,
}: ColumnZoneProps) => {
  const { t } = usePagesTranslation()
  const { setNodeRef, isOver } = useDroppable({
    id: `col:${sectionId}:${column.id}`,
    data: { kind: 'column', sectionId, columnId: column.id },
  })

  const addElementItems: ActionMenuItem[] = [
    { id: 'text', label: t.builder.addText, icon: 'RiText', onClick: onAddText },
    {
      id: 'image',
      label: t.builder.addImage,
      icon: 'RiImageAddLine',
      onClick: onAddImage,
    },
    {
      id: 'slider',
      label: t.builder.addSlider,
      icon: 'RiCarouselView',
      onClick: onAddSlider,
    },
    {
      id: 'button',
      label: t.builder.addButton,
      icon: 'RiCursorLine',
      onClick: onAddButton,
    },
    {
      id: 'gallery',
      label: t.builder.addGallery,
      icon: 'RiGalleryLine',
      onClick: onAddGallery,
    },
    {
      id: 'accordion',
      label: t.builder.addAccordion,
      icon: 'RiQuestionAnswerLine',
      onClick: onAddAccordion,
    },
    {
      id: 'testimonials',
      label: t.builder.addTestimonials,
      icon: 'RiDoubleQuotesL',
      onClick: onAddTestimonials,
    },
    {
      id: 'stats',
      label: t.builder.addStats,
      icon: 'RiBarChartBoxLine',
      onClick: onAddStats,
    },
    {
      id: 'video',
      label: t.builder.addVideo,
      icon: 'RiVideoLine',
      onClick: onAddVideo,
    },
    { id: 'map', label: t.builder.addMap, icon: 'RiMapPin2Line', onClick: onAddMap },
  ]

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'flex min-h-28 flex-col gap-2 rounded-lg border border-dashed p-2 transition-colors',
        isOver && elementDragActive
          ? 'border-primary-600 bg-primary-700/10'
          : 'border-border bg-surface-subtle',
        !isOver && elementDragActive && 'border-primary-600/40'
      )}
    >
      <SortableContext
        items={column.elements.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.elements.map((element) => {
          if (element.type === 'text') {
            return (
              <TextElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'image') {
            return (
              <ImageElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(file) => onPickFile(element.id, file)}
                onSelectLibrary={(file) =>
                  onSelectImageLibrary(element.id, file)
                }
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'slider') {
            return (
              <SliderElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(url, file, kind) =>
                  onPickSliderFile(element.id, url, file, kind)
                }
                onRemoveSlide={onRemoveSliderFile}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'button') {
            return (
              <ButtonElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'gallery') {
            return (
              <GalleryElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(url, file) =>
                  onPickGalleryFile(element.id, url, file)
                }
                onRemoveImage={onRemoveGalleryFile}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'accordion') {
            return (
              <AccordionElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'testimonials') {
            return (
              <TestimonialsElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickAvatarFile={(url, file) =>
                  onPickTestimonialAvatarFile(element.id, url, file)
                }
                onRemoveAvatarFile={onRemoveTestimonialAvatarFile}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'stats') {
            return (
              <StatsElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          if (element.type === 'video') {
            return (
              <VideoElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
                languages={languages}
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(url, file) =>
                  onPickVideoFile(element.id, url, file)
                }
                onRemoveFile={onRemoveVideoFile}
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
          return (
            <MapElementCard
              key={element.id}
              element={element}
              sectionId={sectionId}
              columnId={column.id}
              language={language}
              languages={languages}
              onChange={(patch) => onElementChange(element.id, patch)}
              onDelete={() => onElementDelete(element.id)}
            />
          )
        })}
      </SortableContext>

      <div className="mt-auto pt-1">
        <ActionMenu
          wide
          triggerIcon="RiAddLine"
          triggerLabel={t.builder.addElement}
          items={addElementItems}
        />
      </div>
    </div>
  )
}
