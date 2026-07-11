import { Fragment, useCallback, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
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
import type { CollisionDetection, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
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
  /** Sin índice (clic en la paleta) añade al final. */
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

/**
 * Colisión de la paleta contra las secciones existentes (para poder anclar la
 * línea de inserción arriba/entre/al final de una en concreto) + el lienzo
 * (única opción cuando está vacío, o hueco tras la última sección). El índice
 * resuelto se escribe en `insertIndexRef` como efecto secundario: la propia
 * detección de colisión ya conoce el punto exacto y las medidas, así que es
 * el lugar más simple para calcularlo sin repetir esa lógica en otro sitio.
 */
function computePaletteCollision(
  args: Parameters<CollisionDetection>[0],
  sections: BuilderSection[],
  insertIndexRef: MutableRefObject<number | null>,
): ReturnType<CollisionDetection> {
  const containers = args.droppableContainers.filter((c) => {
    const k = (c.data.current as DragData | undefined)?.kind
    return k === 'section' || c.id === CANVAS_ID
  })
  const scoped = { ...args, droppableContainers: containers }
  const within = pointerWithin(scoped)
  const matches = within.length > 0 ? within : rectIntersection(scoped)

  if (matches.length === 0) {
    insertIndexRef.current = null
    return []
  }

  const topId = matches[0].id
  if (topId === CANVAS_ID) {
    insertIndexRef.current = sections.length
    return matches
  }

  // El orden de registro de los droppables en dnd-kit (`args.droppableContainers`)
  // es el orden de MONTAJE, no el orden visual actual — tras reordenar o
  // insertar una sección fuera del final, dejan de coincidir. `sections` (el
  // array real, siempre en orden visual) es la única fuente fiable del índice.
  const sectionIndex = sections.findIndex((s) => s.sectionId === topId)
  const rect = args.droppableRects.get(topId)
  const pointerY = args.pointerCoordinates?.y ?? 0
  const isTopHalf = !rect || pointerY < rect.top + rect.height / 2
  if (sectionIndex < 0) {
    insertIndexRef.current = sections.length
  } else {
    insertIndexRef.current = isTopHalf ? sectionIndex : sectionIndex + 1
  }
  return matches
}

// Cada tipo de arrastre colisiona solo contra sus destinos válidos:
// - paleta: secciones existentes + lienzo, estricto (sin cascada de "lo más
//   cercano de todos modos"): al alejar el cursor, `over` se vuelve null y
//   soltar ahí cancela limpio, en vez de añadir siempre pase lo que pase.
// - secciones: entre sí (reordenar).
// - elementos: contra otros elementos y columnas (de cualquier sección).
function collideByKind(
  args: Parameters<CollisionDetection>[0],
  sections: BuilderSection[],
  insertIndexRef: MutableRefObject<number | null>,
): ReturnType<CollisionDetection> {
  const kind = (args.active.data.current as DragData | undefined)?.kind

  if (kind === 'palette') return computePaletteCollision(args, sections, insertIndexRef)

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

interface PaletteCardProps {
  label: string
  hint: string
  onClick: () => void
  /** true justo después de un drag real: evita que el click sintético que
   * algunos navegadores disparan tras soltar duplique la acción. */
  suppressClickRef: { current: boolean }
}

const PaletteCard = ({ label, hint, onClick, suppressClickRef }: PaletteCardProps) => {
  // Sin `transform`: la tarjeta original se queda quieta en su sitio durante
  // el arrastre (solo se atenúa); lo único que "viaja" es el chip flotante
  // del DragOverlay.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
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
      className={clsx(
        'flex cursor-grab flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-left transition-opacity active:cursor-grabbing',
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

/** Marca dónde quedaría la sección si se soltara ahora: arriba, entre dos
 * existentes, o al final. */
const InsertionLine = () => <div className="h-1 shrink-0 rounded-full bg-primary-600" />

interface BuilderCanvasBodyProps extends BuilderCanvasProps {
  paletteDragging: boolean
  elementDragging: boolean
  elementType?: string
  /** Posición donde se insertaría la sección de la paleta si se soltara
   * ahora; null mientras no hay una colisión válida. */
  insertIndex: number | null
  suppressClickRef: { current: boolean }
}

// Separado de `BuilderCanvas` a propósito: `useDroppable` (como cualquier hook
// que consume contexto) solo ve el `DndContext` si su componente es
// DESCENDIENTE del Provider en el árbol de React. Antes vivía en el mismo
// componente que crea el `<DndContext>` como parte de su propio JSX de
// retorno, así que leía un contexto vacío/por defecto: el lienzo nunca se
// registraba como droppable (`droppableContainers` quedaba siempre en 0),
// por eso nunca se iluminaba ni recibía nada, sin importar el algoritmo de
// colisión usado.
const BuilderCanvasBody = (props: BuilderCanvasBodyProps) => {
  const { t } = usePagesTranslation()
  const { setNodeRef: setCanvasRef } = useDroppable({ id: CANVAS_ID })
  // El resaltado del lienzo refleja el estado REAL de la colisión (solo
  // activo mientras hay una posición de inserción resuelta), no solo "hay un
  // arrastre en curso" — así, alejar el cursor visualmente "arma" la
  // cancelación antes de soltar.
  const canvasArmed = props.paletteDragging && props.insertIndex !== null
  const showInsertionLines = props.paletteDragging && props.sections.length > 0 && props.insertIndex !== null

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Paleta */}
        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-52">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.builder.palette}</span>
            <PaletteCard
              label={t.builder.paletteColumns}
              hint={t.builder.paletteHint}
              onClick={props.onAddSection}
              suppressClickRef={props.suppressClickRef}
            />
          </div>
        </aside>

        {/* Lienzo */}
        <div
          ref={setCanvasRef}
          className={clsx(
            'flex min-h-64 flex-1 flex-col gap-3 rounded-xl border-2 border-dashed p-3 transition-colors',
            canvasArmed ? 'border-primary-600 bg-primary-700/10' : 'border-border bg-surface-subtle',
          )}
        >
          {props.sections.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
              <IconComponent
                icon="RiDragDropLine"
                className={clsx('h-8 w-8', canvasArmed ? 'text-primary-600' : 'text-muted')}
              />
              <p className={clsx('text-sm', canvasArmed ? 'font-medium text-primary-600' : 'text-muted')}>
                {t.builder.empty}
              </p>
            </div>
          )}

          <SortableContext items={props.sections.map((s) => s.sectionId)} strategy={verticalListSortingStrategy}>
            {showInsertionLines && props.insertIndex === 0 && <InsertionLine />}
            {props.sections.map((section, index) => (
              <Fragment key={section.sectionId}>
                <SectionCard
                  section={section}
                  language={props.language}
                  elementDragActive={props.elementDragging}
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
                {showInsertionLines && props.insertIndex === index + 1 && <InsertionLine />}
              </Fragment>
            ))}
          </SortableContext>
        </div>
      </div>

      {/* Portal a <body>: el contenido de la página vive en contenedores con
          transform (animaciones), que romperían el posicionamiento fijo del
          overlay — el chip se dibujaría lejos del cursor. */}
      {createPortal(
        <DragOverlay>
          {props.paletteDragging && <OverlayChip icon="RiLayoutColumnLine" label={t.builder.paletteColumns} />}
          {props.elementDragging && (
            <OverlayChip
              icon={props.elementType === 'image' ? 'RiImageLine' : 'RiText'}
              label={props.elementType === 'image' ? t.builder.imageElement : t.builder.textElement}
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </>
  )
}

export const BuilderCanvas = (props: BuilderCanvasProps) => {
  const { sections, onAddSection, onSectionMove, onElementMove } = props
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const insertIndexRef = useRef<number | null>(null)
  // El ref solo se lee/escribe dentro del callback (nunca durante el
  // render): dnd-kit lo invoca de forma asíncrona en cada paso del arrastre,
  // no al construir `collisionDetection`. Depende de `sections` para
  // resolver el índice por orden visual real (ver nota en
  // `computePaletteCollision`).
  const collisionDetection = useCallback<CollisionDetection>(
    (args) => collideByKind(args, sections, insertIndexRef),
    [sections],
  )
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

  // Reordena en vivo (no solo al soltar): así `useSortable` anima las demás
  // secciones o elementos corriéndose de lugar mientras arrastras, en vez de
  // solo dar un salto seco al final.
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const aData = active.data.current as DragData | undefined
    const oData = over.data.current as DragData | undefined
    if (aData?.kind === 'section' && oData?.kind === 'section') {
      onSectionMove(String(active.id), String(over.id))
      return
    }
    if (aData?.kind === 'element') handleElementDrop(active, over, aData, onElementMove)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDrag(null)
    const { active, over } = event
    const aData = active.data.current as DragData | undefined

    if (aData?.kind === 'palette') {
      // Estricto: solo añade si `over` resolvió realmente una posición
      // (soltar fuera cancela limpio, sin excepciones).
      if (over) onAddSection(insertIndexRef.current ?? undefined)
      insertIndexRef.current = null
      setInsertIndex(null)
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragMove={() => setInsertIndex(insertIndexRef.current)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveDrag(null)
        insertIndexRef.current = null
        setInsertIndex(null)
        suppressPaletteClickRef.current = false
      }}
    >
      <BuilderCanvasBody
        {...props}
        paletteDragging={activeDrag?.kind === 'palette'}
        elementDragging={activeDrag?.kind === 'element'}
        elementType={activeDrag?.elementType}
        insertIndex={insertIndex}
        suppressClickRef={suppressPaletteClickRef}
      />
    </DndContext>
  )
}
