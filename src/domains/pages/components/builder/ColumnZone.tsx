import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { Button } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderColumn, BuilderImageElement, BuilderTextElement } from '../../model/page.types'
import { TextElementCard } from './TextElementCard'
import { ImageElementCard } from './ImageElementCard'

export interface ColumnZoneProps {
  column: BuilderColumn
  language: Language
  onAddText: () => void
  onAddImage: () => void
  onElementChange: (elementId: string, patch: Partial<BuilderTextElement> | Partial<BuilderImageElement>) => void
  onElementDelete: (elementId: string) => void
  onElementMove: (activeId: string, overId: string) => void
  onPickFile: (elementId: string, file: File) => void
}

/**
 * Una columna del section: lista sortable de elementos + botonera para añadir
 * (los elementos SOLO viven dentro de una columna — no hay zonas muertas).
 * DndContext propio y aislado: reordenar elementos nunca arrastra la sección.
 */
export const ColumnZone = ({
  column,
  language,
  onAddText,
  onAddImage,
  onElementChange,
  onElementDelete,
  onElementMove,
  onPickFile,
}: ColumnZoneProps) => {
  const { t } = usePagesTranslation()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) onElementMove(String(active.id), String(over.id))
  }

  return (
    <div className="flex min-h-32 flex-col gap-2 rounded-lg border border-dashed border-border bg-surface-subtle p-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={column.elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {column.elements.map((element) =>
            element.type === 'text' ? (
              <TextElementCard
                key={element.id}
                element={element}
                language={language}
                onChange={(patch) => onElementChange(element.id, patch)}
                onDelete={() => onElementDelete(element.id)}
              />
            ) : (
              <ImageElementCard
                key={element.id}
                element={element}
                language={language}
                onChange={(patch) => onElementChange(element.id, patch)}
                onPickFile={(file) => onPickFile(element.id, file)}
                onDelete={() => onElementDelete(element.id)}
              />
            ),
          )}
        </SortableContext>
      </DndContext>

      <div className="mt-auto flex items-center justify-center gap-2 pt-1">
        <Button type="button" variant="outline" size="small" onClick={onAddText}>
          + {t.builder.addText}
        </Button>
        <Button type="button" variant="outline" size="small" onClick={onAddImage}>
          + {t.builder.addImage}
        </Button>
      </div>
    </div>
  )
}
