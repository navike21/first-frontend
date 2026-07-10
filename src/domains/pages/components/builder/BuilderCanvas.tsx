import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  rectIntersection,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CollisionDetection, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { ElementLocation } from '../../model/page.builder'
import type {
  BuilderColumnsCount,
  BuilderImageElement,
  BuilderSection,
  BuilderTextElement,
} from '../../model/page.types'
import { SectionCard } from './SectionCard'

const PALETTE_COLUMNS_ID = 'palette:columns'
const CANVAS_ID = 'builder-canvas'

type DragKind = 'palette' | 'section' | 'element'

interface DragData {
  kind?: DragKind | 'column'
  sectionId?: string
  columnId?: string
}

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
  onElementMove: (elementId: string, source: ElementLocation, target: ElementLocation, overElementId: string | null) => void
  onPickFile: (elementId: string, file: File) => void
}

// Cada tipo de arrastre colisiona solo contra sus destinos válidos: la paleta
// contra cualquier zona, las secciones entre sí, los elementos contra
// elementos y columnas (de cualquier sección).
const collisionDetection: CollisionDetection = (args) => {
  const kind = (args.active.data.current as DragData | undefined)?.kind
  if (kind === 'section') {
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) => (c.data.current as DragData | undefined)?.kind === 'section',
      ),
    })
  }
  if (kind === 'element') {
    const containers = args.droppableContainers.filter((c) => {
      const k = (c.data.current as DragData | undefined)?.kind
      return k === 'element' || k === 'column'
    })
    const within = pointerWithin({ ...args, droppableContainers: containers })
    return within.length > 0 ? within : rectIntersection({ ...args, droppableContainers: containers })
  }
  // paleta: basta con estar sobre cualquier zona del lienzo
  const within = pointerWithin(args)
  return within.length > 0 ? within : rectIntersection(args)
}

const PaletteCard = ({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: PALETTE_COLUMNS_ID,
    data: { kind: 'palette' },
  })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        'flex cursor-grab flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-left active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
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

const OverlayChip = ({ icon, label }: { icon: IconName; label: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-primary-600 bg-surface px-3 py-2 shadow-lg">
    <IconComponent icon={icon} className="h-4 w-4 text-primary-600" />
    <span className="text-xs font-medium text-foreground">{label}</span>
  </div>
)

export const BuilderCanvas = (props: BuilderCanvasProps) => {
  const { sections, language, pendingChoiceId, onAddSection, onSectionMove, onElementMove } = props
  const { t } = usePagesTranslation()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const { setNodeRef: setCanvasRef, isOver: canvasOver } = useDroppable({ id: CANVAS_ID })
  const [activeDrag, setActiveDrag] = useState<{ kind: DragKind; elementType?: string } | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined
    // 'column' solo existe como droppable, nunca como arrastrable activo.
    if (!data?.kind || data.kind === 'column') return
    const elementType =
      data.kind === 'element'
        ? sections
            .flatMap((s) => s.content.columns ?? [])
            .flatMap((c) => c.elements)
            .find((e) => e.id === event.active.id)?.type
        : undefined
    setActiveDrag({ kind: data.kind, ...(elementType && { elementType }) })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null)
    const { active, over } = event
    if (!over) return
    const aData = active.data.current as DragData | undefined

    if (aData?.kind === 'palette') {
      onAddSection()
      return
    }
    if (aData?.kind === 'section') {
      if (active.id !== over.id) onSectionMove(String(active.id), String(over.id))
      return
    }
    if (aData?.kind === 'element' && aData.sectionId && aData.columnId) {
      const oData = over.data.current as DragData | undefined
      if (!oData?.sectionId || !oData.columnId) return
      const overElementId = oData.kind === 'element' ? String(over.id) : null
      if (oData.kind === 'element' && String(over.id) === String(active.id)) return
      onElementMove(
        String(active.id),
        { sectionId: aData.sectionId, columnId: aData.columnId },
        { sectionId: oData.sectionId, columnId: oData.columnId },
        overElementId,
      )
    }
  }

  const paletteDragging = activeDrag?.kind === 'palette'
  const elementDragging = activeDrag?.kind === 'element'

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Paleta */}
        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-52">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.builder.palette}</span>
            <PaletteCard label={t.builder.paletteColumns} hint={t.builder.paletteHint} onClick={onAddSection} />
          </div>
        </aside>

        {/* Lienzo */}
        <div
          ref={setCanvasRef}
          className={clsx(
            'flex min-h-64 flex-1 flex-col gap-3 rounded-xl border-2 border-dashed p-3 transition-colors',
            paletteDragging && canvasOver && 'border-primary-600 bg-primary-700/10',
            paletteDragging && !canvasOver && 'animate-pulse border-primary-600/50 bg-primary-700/10',
            !paletteDragging && 'border-border bg-surface-subtle',
          )}
        >
          {sections.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
              <IconComponent
                icon="RiDragDropLine"
                className={clsx('h-8 w-8', paletteDragging ? 'text-primary-600' : 'text-muted')}
              />
              <p className={clsx('text-sm', paletteDragging ? 'font-medium text-primary-600' : 'text-muted')}>
                {t.builder.empty}
              </p>
            </div>
          )}

          <SortableContext items={sections.map((s) => s.sectionId)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SectionCard
                key={section.sectionId}
                section={section}
                language={language}
                pendingChoice={pendingChoiceId === section.sectionId}
                elementDragActive={elementDragging}
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
                onPickFile={props.onPickFile}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      {/* Portal a <body>: el contenido de la página vive en contenedores con
          transform (animaciones), que romperían el posicionamiento fijo del
          overlay — el chip se dibujaría lejos del cursor. */}
      {createPortal(
        <DragOverlay>
          {paletteDragging && <OverlayChip icon="RiLayoutColumnLine" label={t.builder.paletteColumns} />}
          {elementDragging && (
            <OverlayChip
              icon={activeDrag?.elementType === 'image' ? 'RiImageLine' : 'RiText'}
              label={activeDrag?.elementType === 'image' ? t.builder.imageElement : t.builder.textElement}
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
