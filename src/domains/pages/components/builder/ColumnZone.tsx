import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { IconButton, Tooltip } from '@/shared/ui'
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
  onPickSliderFile: (elementId: string, url: string, file: File, kind: 'image' | 'video') => void
  onRemoveSliderFile: (url: string) => void
  onPickGalleryFile: (elementId: string, url: string, file: File) => void
  onRemoveGalleryFile: (url: string) => void
  onPickTestimonialAvatarFile: (elementId: string, url: string, file: File) => void
  onRemoveTestimonialAvatarFile: (url: string) => void
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
}: ColumnZoneProps) => {
  const { t } = usePagesTranslation()
  const { setNodeRef, isOver } = useDroppable({
    id: `col:${sectionId}:${column.id}`,
    data: { kind: 'column', sectionId, columnId: column.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'flex min-h-28 flex-col gap-2 rounded-lg border border-dashed p-2 transition-colors',
        isOver && elementDragActive
          ? 'border-primary-600 bg-primary-700/10'
          : 'border-border bg-surface-subtle',
        !isOver && elementDragActive && 'border-primary-600/40',
      )}
    >
      <SortableContext items={column.elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        {column.elements.map((element) => {
          if (element.type === 'text') {
            return (
              <TextElementCard
                key={element.id}
                element={element}
                sectionId={sectionId}
                columnId={column.id}
                language={language}
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
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(file) => onPickFile(element.id, file)}
                onSelectLibrary={(file) => onSelectImageLibrary(element.id, file)}
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
                onPickFile={(url, file, kind) => onPickSliderFile(element.id, url, file, kind)}
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
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(url, file) => onPickGalleryFile(element.id, url, file)}
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
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickAvatarFile={(url, file) => onPickTestimonialAvatarFile(element.id, url, file)}
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
                onChange={(patch) => onElementChange(element.id, patch)}
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
              onChange={(patch) => onElementChange(element.id, patch)}
              onDelete={() => onElementDelete(element.id)}
            />
          )
        })}
      </SortableContext>

      <div className="mt-auto flex items-center justify-center gap-1 pt-1">
        <Tooltip heading={t.builder.addText} position="top" size="small">
          <IconButton icon="RiText" variant="text" size="small" aria-label={t.builder.addText} onClick={onAddText} />
        </Tooltip>
        <Tooltip heading={t.builder.addImage} position="top" size="small">
          <IconButton
            icon="RiImageAddLine"
            variant="text"
            size="small"
            aria-label={t.builder.addImage}
            onClick={onAddImage}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addSlider} position="top" size="small">
          <IconButton
            icon="RiCarouselView"
            variant="text"
            size="small"
            aria-label={t.builder.addSlider}
            onClick={onAddSlider}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addButton} position="top" size="small">
          <IconButton
            icon="RiCursorLine"
            variant="text"
            size="small"
            aria-label={t.builder.addButton}
            onClick={onAddButton}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addGallery} position="top" size="small">
          <IconButton
            icon="RiGalleryLine"
            variant="text"
            size="small"
            aria-label={t.builder.addGallery}
            onClick={onAddGallery}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addAccordion} position="top" size="small">
          <IconButton
            icon="RiQuestionAnswerLine"
            variant="text"
            size="small"
            aria-label={t.builder.addAccordion}
            onClick={onAddAccordion}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addTestimonials} position="top" size="small">
          <IconButton
            icon="RiDoubleQuotesL"
            variant="text"
            size="small"
            aria-label={t.builder.addTestimonials}
            onClick={onAddTestimonials}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addStats} position="top" size="small">
          <IconButton
            icon="RiBarChartBoxLine"
            variant="text"
            size="small"
            aria-label={t.builder.addStats}
            onClick={onAddStats}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addVideo} position="top" size="small">
          <IconButton
            icon="RiVideoLine"
            variant="text"
            size="small"
            aria-label={t.builder.addVideo}
            onClick={onAddVideo}
          />
        </Tooltip>
        <Tooltip heading={t.builder.addMap} position="top" size="small">
          <IconButton
            icon="RiMapPin2Line"
            variant="text"
            size="small"
            aria-label={t.builder.addMap}
            onClick={onAddMap}
          />
        </Tooltip>
      </div>
    </div>
  )
}
