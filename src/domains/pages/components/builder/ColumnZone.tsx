import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { IconButton, Tooltip } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type {
  BuilderColumn,
  BuilderImageElement,
  BuilderSliderElement,
  BuilderTextElement,
} from '../../model/page.types'
import { TextElementCard } from './TextElementCard'
import { ImageElementCard } from './ImageElementCard'
import { SliderElementCard } from './SliderElementCard'

export interface ColumnZoneProps {
  sectionId: string
  column: BuilderColumn
  language: Language
  /** true mientras se arrastra un elemento en cualquier parte del lienzo. */
  elementDragActive: boolean
  onAddText: () => void
  onAddImage: () => void
  onAddSlider: () => void
  onElementChange: (
    elementId: string,
    patch: Partial<BuilderTextElement> | Partial<BuilderImageElement> | Partial<BuilderSliderElement>,
  ) => void
  onElementDelete: (elementId: string) => void
  onPickFile: (elementId: string, file: File) => void
  onPickSliderFile: (elementId: string, url: string, file: File, kind: 'image' | 'video') => void
  onRemoveSliderFile: (url: string) => void
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
  onElementChange,
  onElementDelete,
  onPickFile,
  onPickSliderFile,
  onRemoveSliderFile,
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
                onDelete={() => onElementDelete(element.id)}
              />
            )
          }
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
      </div>
    </div>
  )
}
