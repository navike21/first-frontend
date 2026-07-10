import {
  DndContext,
  closestCenter,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { DragEndEvent } from '@dnd-kit/core'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type {
  BuilderColumnsCount,
  BuilderImageElement,
  BuilderSection,
  BuilderTextElement,
} from '../../model/page.types'
import { SectionCard } from './SectionCard'

const PALETTE_COLUMNS_ID = 'palette:columns'
const CANVAS_ID = 'builder-canvas'

export interface BuilderCanvasProps {
  sections: BuilderSection[]
  language: Language
  pendingChoiceId: string | null
  onAddSection: () => void
  onSectionMove: (activeId: string, overId: string) => void
  onChooseColumns: (sectionId: string, count: BuilderColumnsCount) => void
  onColumnsChange: (sectionId: string, count: BuilderColumnsCount) => void
  onDeleteRequest: (sectionId: string) => void
  onAddText: (sectionId: string, columnId: string) => void
  onAddImage: (sectionId: string, columnId: string) => void
  onElementChange: (
    sectionId: string,
    columnId: string,
    elementId: string,
    patch: Partial<BuilderTextElement> | Partial<BuilderImageElement>,
  ) => void
  onElementDelete: (sectionId: string, columnId: string, elementId: string) => void
  onElementMove: (sectionId: string, columnId: string, activeId: string, overId: string) => void
  onPickFile: (elementId: string, file: File) => void
}

const PaletteCard = ({ label, hint }: { label: string; hint: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: PALETTE_COLUMNS_ID })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        'flex cursor-grab flex-col gap-2 rounded-xl border border-border bg-surface p-3 active:cursor-grabbing',
        isDragging && 'z-50 opacity-80 shadow-lg ring-1 ring-primary-700/30',
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex h-12 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-surface-subtle">
        <span className="h-6 w-1/4 rounded-sm border border-dashed border-border bg-surface" />
        <span className="h-6 w-1/4 rounded-sm border border-dashed border-border bg-surface" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="text-[10px] leading-snug text-muted">{hint}</span>
    </div>
  )
}

export const BuilderCanvas = (props: BuilderCanvasProps) => {
  const { sections, language, pendingChoiceId, onAddSection, onSectionMove } = props
  const { t } = usePagesTranslation()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const { setNodeRef: setCanvasRef, isOver } = useDroppable({ id: CANVAS_ID })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    if (active.id === PALETTE_COLUMNS_ID) {
      onAddSection()
      return
    }
    if (active.id !== over.id) onSectionMove(String(active.id), String(over.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Paleta */}
        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-52">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.builder.palette}</span>
            <button type="button" onClick={onAddSection} className="text-left">
              <PaletteCard label={t.builder.paletteColumns} hint={t.builder.paletteHint} />
            </button>
          </div>
        </aside>

        {/* Lienzo */}
        <div
          ref={setCanvasRef}
          className={clsx(
            'flex min-h-64 flex-1 flex-col gap-3 rounded-xl border border-dashed p-3 transition-colors',
            isOver ? 'border-primary-600 bg-primary-700/10' : 'border-border bg-surface-subtle',
          )}
        >
          {sections.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
              <IconComponent icon="RiDragDropLine" className="h-8 w-8 text-muted" />
              <p className="text-sm text-muted">{t.builder.empty}</p>
            </div>
          )}

          <SortableContext items={sections.map((s) => s.sectionId)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SectionCard
                key={section.sectionId}
                section={section}
                language={language}
                pendingChoice={pendingChoiceId === section.sectionId}
                onChooseColumns={(count) => props.onChooseColumns(section.sectionId, count)}
                onColumnsChange={(count) => props.onColumnsChange(section.sectionId, count)}
                onDeleteRequest={() => props.onDeleteRequest(section.sectionId)}
                onAddText={(columnId) => props.onAddText(section.sectionId, columnId)}
                onAddImage={(columnId) => props.onAddImage(section.sectionId, columnId)}
                onElementChange={(columnId, elementId, patch) =>
                  props.onElementChange(section.sectionId, columnId, elementId, patch)
                }
                onElementDelete={(columnId, elementId) =>
                  props.onElementDelete(section.sectionId, columnId, elementId)
                }
                onElementMove={(columnId, activeId, overId) =>
                  props.onElementMove(section.sectionId, columnId, activeId, overId)
                }
                onPickFile={props.onPickFile}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  )
}
