import { useRef, useState } from 'react'
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
import type { ClientRect, CollisionDetection, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
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
  /** Sin índice (clic) se añade al final; con índice (soltar sobre/entre
   * secciones) se inserta ahí. */
  onAddSection: (atIndex?: number) => void
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

// Cada tipo de arrastre colisiona solo contra sus destinos válidos:
// - paleta: solo secciones + el lienzo (así "sobre un elemento anidado"
//   cuenta como "sobre la sección que lo contiene", ya que su rect envuelve
//   al del hijo — sin necesitar rastrear sectionId manualmente).
// - secciones: entre sí (reordenar).
// - elementos: contra otros elementos y columnas (de cualquier sección).
function makeCollisionDetection(): CollisionDetection {
  return (args) => {
    const kind = (args.active.data.current as DragData | undefined)?.kind

    if (kind === 'palette') {
      const containers = args.droppableContainers.filter((c) => {
        const k = (c.data.current as DragData | undefined)?.kind
        return k === 'section' || c.id === CANVAS_ID
      })
      const scoped = { ...args, droppableContainers: containers }
      const within = pointerWithin(scoped)
      if (within.length > 0) return within
      const intersecting = rectIntersection(scoped)
      if (intersecting.length > 0) return intersecting
      return closestCenter(scoped)
    }

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
      if (within.length > 0) return within
      return rectIntersection({ ...args, droppableContainers: containers })
    }

    return closestCenter(args)
  }
}

function handleElementDrop(
  active: DragEndEvent['active'],
  over: NonNullable<DragEndEvent['over']>,
  aData: DragData,
  onElementMove: BuilderCanvasProps['onElementMove'],
): void {
  if (!aData.sectionId || !aData.columnId) return
  const oData = over.data.current as DragData | undefined
  if (!oData?.sectionId || !oData.columnId) return
  if (oData.kind === 'element' && String(over.id) === String(active.id)) return
  const overElementId = oData.kind === 'element' ? String(over.id) : null
  onElementMove(
    String(active.id),
    { sectionId: aData.sectionId, columnId: aData.columnId },
    { sectionId: oData.sectionId, columnId: oData.columnId },
    overElementId,
  )
}

/** ¿En qué índice del array de secciones debería insertarse una sección
 * nueva soltada sobre `overId` (una sección o el lienzo)? Mitad superior del
 * rect destino → antes; mitad inferior → después. */
function resolveInsertIndex(
  sections: BuilderSection[],
  overId: string,
  activeRect: ClientRect | null,
  overRect: ClientRect | null,
): number {
  const idx = sections.findIndex((s) => s.sectionId === overId)
  if (idx < 0) return sections.length
  if (!activeRect || !overRect) return idx
  const activeCenterY = activeRect.top + activeRect.height / 2
  const overMidY = overRect.top + overRect.height / 2
  return activeCenterY < overMidY ? idx : idx + 1
}

interface PaletteCardProps {
  label: string
  hint: string
  onClick: () => void
  /** true justo después de un drag real: evita que el click sintético que
   * algunos navegadores disparan tras soltar duplique la acción. */
  suppressClickRef: { current: boolean }
}

const PaletteCard = ({ label, hint, onClick, suppressClickRef }: PaletteCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: PALETTE_COLUMNS_ID,
    data: { kind: 'palette' },
  })

  const handleActivate = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    onClick()
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleActivate()
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

/** Barra que marca "la nueva sección aterrizará aquí" — crece/aparece solo
 * cuando está activa, en vez de un texto ("suéltalo aquí" ya lo dice el
 * cambio de color del lienzo). */
const InsertLine = ({ active }: { active: boolean }) => (
  <div
    aria-hidden="true"
    className={clsx(
      'rounded-full bg-primary-600 transition-all duration-150 ease-out',
      active ? 'h-1.5 opacity-100' : 'h-0 opacity-0',
    )}
  />
)

export const BuilderCanvas = (props: BuilderCanvasProps) => {
  const { sections, language, pendingChoiceId, onAddSection, onSectionMove, onElementMove } = props
  const { t } = usePagesTranslation()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const { setNodeRef: setCanvasRef } = useDroppable({ id: CANVAS_ID })
  const [collisionDetection] = useState(() => makeCollisionDetection())
  const [activeDrag, setActiveDrag] = useState<{ kind: DragKind; elementType?: string } | null>(null)
  const [insertIndex, setInsertIndex] = useState<number | null>(null)
  const suppressPaletteClickRef = useRef(false)

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined
    // 'column' solo existe como droppable, nunca como arrastrable activo.
    if (!data?.kind || data.kind === 'column') return
    if (data.kind === 'palette') suppressPaletteClickRef.current = true
    const elementType =
      data.kind === 'element'
        ? sections
            .flatMap((s) => s.content.columns ?? [])
            .flatMap((c) => c.elements)
            .find((e) => e.id === event.active.id)?.type
        : undefined
    setActiveDrag({ kind: data.kind, ...(elementType && { elementType }) })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const aData = event.active.data.current as DragData | undefined
    if (aData?.kind !== 'palette') return
    const { over, active } = event
    if (!over) {
      setInsertIndex(null)
      return
    }
    const activeRect = active.rect.current.translated ?? active.rect.current.initial
    setInsertIndex(resolveInsertIndex(sections, String(over.id), activeRect, over.rect))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null)
    setInsertIndex(null)
    const { active, over } = event
    const aData = active.data.current as DragData | undefined

    if (aData?.kind === 'palette') {
      if (over) {
        const activeRect = active.rect.current.translated ?? active.rect.current.initial
        onAddSection(resolveInsertIndex(sections, String(over.id), activeRect, over.rect))
      }
      // Red de seguridad: si el navegador no dispara un click sintético tras
      // este drag, no dejamos el guard bloqueado para el próximo clic real.
      requestAnimationFrame(() => {
        suppressPaletteClickRef.current = false
      })
      return
    }
    if (!over) return
    if (aData?.kind === 'section') {
      if (active.id !== over.id) onSectionMove(String(active.id), String(over.id))
      return
    }
    if (aData?.kind === 'element') handleElementDrop(active, over, aData, onElementMove)
  }

  const paletteDragging = activeDrag?.kind === 'palette'
  const elementDragging = activeDrag?.kind === 'element'

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveDrag(null)
        setInsertIndex(null)
        suppressPaletteClickRef.current = false
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Paleta */}
        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-52">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.builder.palette}</span>
            <PaletteCard
              label={t.builder.paletteColumns}
              hint={t.builder.paletteHint}
              onClick={() => onAddSection()}
              suppressClickRef={suppressPaletteClickRef}
            />
          </div>
        </aside>

        {/* Lienzo */}
        <div
          ref={setCanvasRef}
          className={clsx(
            'flex min-h-64 flex-1 flex-col gap-1 rounded-xl border-2 border-dashed p-3 transition-colors',
            paletteDragging ? 'border-primary-600 bg-primary-700/10' : 'border-border bg-surface-subtle',
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

          {sections.length > 0 && <InsertLine active={paletteDragging && insertIndex === 0} />}

          <SortableContext items={sections.map((s) => s.sectionId)} strategy={verticalListSortingStrategy}>
            {sections.map((section, index) => (
              <div key={section.sectionId} className="flex flex-col gap-1">
                <SectionCard
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
                <InsertLine active={paletteDragging && insertIndex === index + 1} />
              </div>
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
