import { useState } from 'react'
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
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, IconButton, IconComponent, InputField, Modal, Tooltip } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderStatItem, BuilderStatsElement, PageLocalizedString } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface StatsElementCardProps {
  element: BuilderStatsElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderStatsElement>) => void
  onDelete: () => void
}

const emptyLocalized = (): PageLocalizedString =>
  Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as PageLocalizedString

const isLangComplete = (items: BuilderStatItem[], lang: Language): boolean =>
  items.length > 0 && items.every((i) => !!i.label[lang]?.trim())

interface StatItemRowProps {
  item: BuilderStatItem
  editing: Language
  dragLabel: string
  removeLabel: string
  valueLabel: string
  labelLabel: string
  onChange: (patch: Partial<BuilderStatItem>) => void
  onRemove: () => void
}

const StatItemRow = ({
  item,
  editing,
  dragLabel,
  removeLabel,
  valueLabel,
  labelLabel,
  onChange,
  onRemove,
}: StatItemRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'flex flex-col gap-2 rounded-lg border border-border bg-surface-subtle p-3',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center gap-1">
        <Tooltip heading={dragLabel} position="top" size="small">
          <button
            type="button"
            aria-label={dragLabel}
            className="cursor-grab rounded p-0.5 text-muted hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <IconComponent icon="RiDraggable" className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
        <span className="flex-1" />
        <Tooltip heading={removeLabel} position="top" size="small">
          <IconButton icon="RiDeleteBinLine" variant="text" size="small" aria-label={removeLabel} onClick={onRemove} />
        </Tooltip>
      </div>
      <InputField label={valueLabel} value={item.value} onChange={(e) => onChange({ value: e.target.value })} />
      <InputField
        label={labelLabel}
        value={item.label[editing] ?? ''}
        onChange={(e) => onChange({ label: { ...item.label, [editing]: e.target.value } })}
      />
    </div>
  )
}

export const StatsElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onDelete,
}: StatsElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const langChipValues = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, isLangComplete(element.items, l) ? '1' : '']),
  ) as PageLocalizedString

  const addItem = () => {
    const item: BuilderStatItem = { id: crypto.randomUUID(), value: '', label: emptyLocalized() }
    onChange({ items: [...element.items, item] })
  }
  const removeItem = (id: string) => onChange({ items: element.items.filter((i) => i.id !== id) })
  const updateItem = (id: string, patch: Partial<BuilderStatItem>) =>
    onChange({ items: element.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = element.items.findIndex((i) => i.id === active.id)
    const to = element.items.findIndex((i) => i.id === over.id)
    if (from < 0 || to < 0) return
    onChange({ items: arrayMove(element.items, from, to) })
  }

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiBarChartBoxLine"
      label={t.builder.statsElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      {element.items.length > 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full flex-wrap gap-2 rounded-md p-1 text-left transition-colors hover:bg-surface-subtle"
        >
          {element.items.map((item) => (
            <span
              key={item.id}
              className="rounded-md bg-surface-subtle px-2 py-1 text-xs text-foreground ring-1 ring-border"
            >
              <strong>{item.value || '—'}</strong> {item.label[language] || item.label.en}
            </span>
          ))}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.statsEmpty}
        </button>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.statsElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <LangChips editing={editing} userLanguage={language} values={langChipValues} onChange={setEditing} />

          {element.items.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={element.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {element.items.map((item) => (
                    <StatItemRow
                      key={item.id}
                      item={item}
                      editing={editing}
                      dragLabel={t.builder.statsItemDragLabel}
                      removeLabel={t.builder.statsRemoveLabel}
                      valueLabel={t.builder.statsValueLabel}
                      labelLabel={t.builder.statsLabelLabel}
                      onChange={(patch) => updateItem(item.id, patch)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <Button variant="secondary" onClick={addItem}>
            {t.builder.statsAddLabel}
          </Button>
        </div>
      </Modal>
    </ElementShell>
  )
}
