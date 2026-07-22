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
import { Button, InputField, Modal, RichTextArea, SortableItemActions } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import { isEmptyHtml } from '../../model/pageTranslationProgress'
import type { BuilderAccordionElement, BuilderAccordionItem, PageLocalizedString } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface AccordionElementCardProps {
  element: BuilderAccordionElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderAccordionElement>) => void
  onDelete: () => void
}

const emptyLocalized = (): PageLocalizedString =>
  Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as PageLocalizedString

const isLangComplete = (items: BuilderAccordionItem[], lang: Language): boolean =>
  items.length > 0 && items.every((i) => !!i.question[lang]?.trim() && !isEmptyHtml(i.answer[lang]))

interface AccordionItemRowProps {
  item: BuilderAccordionItem
  editing: Language
  dragLabel: string
  removeLabel: string
  questionLabel: string
  answerLabel: string
  onChange: (patch: Partial<BuilderAccordionItem>) => void
  onRemove: () => void
}

const AccordionItemRow = ({
  item,
  editing,
  dragLabel,
  removeLabel,
  questionLabel,
  answerLabel,
  onChange,
  onRemove,
}: AccordionItemRowProps) => {
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
      <SortableItemActions
        dragLabel={dragLabel}
        removeLabel={removeLabel}
        attributes={attributes}
        listeners={listeners}
        onRemove={onRemove}
      />
      <InputField
        label={questionLabel}
        value={item.question[editing] ?? ''}
        onChange={(e) => onChange({ question: { ...item.question, [editing]: e.target.value } })}
      />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-secondary">{answerLabel}</span>
        <RichTextArea
          key={`${item.id}-${editing}`}
          value={item.answer[editing] ?? ''}
          minRows={3}
          onChange={(html) => onChange({ answer: { ...item.answer, [editing]: html } })}
        />
      </div>
    </div>
  )
}

export const AccordionElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onDelete,
}: AccordionElementCardProps) => {
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
    const item: BuilderAccordionItem = { id: crypto.randomUUID(), question: emptyLocalized(), answer: emptyLocalized() }
    onChange({ items: [...element.items, item] })
  }
  const removeItem = (id: string) => onChange({ items: element.items.filter((i) => i.id !== id) })
  const updateItem = (id: string, patch: Partial<BuilderAccordionItem>) =>
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
      icon="RiQuestionAnswerLine"
      label={t.builder.accordionElement}
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
          className="flex w-full cursor-pointer flex-col gap-1 rounded-md p-1 text-left transition-colors hover:bg-surface-subtle"
        >
          {element.items.map((item, index) => (
            <p key={item.id} className="truncate text-xs text-foreground">
              {index + 1}. {item.question[language] || item.question.en || t.builder.accordionEmpty}
            </p>
          ))}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-20 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.accordionEmpty}
        </button>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.accordionElement}
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
                    <AccordionItemRow
                      key={item.id}
                      item={item}
                      editing={editing}
                      dragLabel={t.builder.accordionItemDragLabel}
                      removeLabel={t.builder.accordionRemoveLabel}
                      questionLabel={t.builder.accordionQuestionLabel}
                      answerLabel={t.builder.accordionAnswerLabel}
                      onChange={(patch) => updateItem(item.id, patch)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <Button variant="secondary" onClick={addItem}>
            {t.builder.accordionAddLabel}
          </Button>
        </div>
      </Modal>
    </ElementShell>
  )
}
