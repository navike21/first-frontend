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
import {
  Button,
  IconButton,
  IconComponent,
  InputField,
  MediaLibraryModal,
  MediaThumbnail,
  Modal,
  Select,
  TextArea,
  Tooltip,
} from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderTestimonialItem, BuilderTestimonialRating, BuilderTestimonialsElement, PageLocalizedString } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

const ACCEPTED = 'image/jpeg,image/png,image/webp'

export interface TestimonialsElementCardProps {
  element: BuilderTestimonialsElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderTestimonialsElement>) => void
  /** `url` es la misma blob preview ya insertada en items[i].avatarUrl —
   * mismo contrato que onPickGalleryFile. */
  onPickAvatarFile: (url: string, file: File) => void
  onRemoveAvatarFile: (url: string) => void
  onDelete: () => void
}

const emptyLocalized = (): PageLocalizedString =>
  Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as PageLocalizedString

const isLangComplete = (items: BuilderTestimonialItem[], lang: Language): boolean =>
  items.length > 0 && items.every((i) => !!i.quote[lang]?.trim())

interface TestimonialItemRowProps {
  item: BuilderTestimonialItem
  editing: Language
  dragLabel: string
  removeLabel: string
  nameLabel: string
  roleLabel: string
  quoteLabel: string
  avatarLabel: string
  ratingOptions: { value: string; label: string }[]
  onChange: (patch: Partial<BuilderTestimonialItem>) => void
  onRemove: () => void
  onPickAvatar: () => void
}

const TestimonialItemRow = ({
  item,
  editing,
  dragLabel,
  removeLabel,
  nameLabel,
  roleLabel,
  quoteLabel,
  avatarLabel,
  ratingOptions,
  onChange,
  onRemove,
  onPickAvatar,
}: TestimonialItemRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'flex flex-col gap-3 rounded-lg border border-border bg-surface-subtle p-3',
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

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPickAvatar}
          aria-label={avatarLabel}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface ring-1 ring-border transition-colors hover:ring-primary-600/50"
        >
          {item.avatarUrl ? (
            <MediaThumbnail src={item.avatarUrl} kind="image" className="h-full w-full object-cover" />
          ) : (
            <IconComponent icon="RiUserLine" className="h-6 w-6 text-muted" />
          )}
        </button>
        <div className="flex flex-1 flex-col gap-2">
          <InputField label={nameLabel} value={item.name} onChange={(e) => onChange({ name: e.target.value })} />
          <InputField
            label={roleLabel}
            value={item.role[editing] ?? ''}
            onChange={(e) => onChange({ role: { ...item.role, [editing]: e.target.value } })}
          />
        </div>
      </div>

      <TextArea
        label={quoteLabel}
        value={item.quote[editing] ?? ''}
        onChange={(e) => onChange({ quote: { ...item.quote, [editing]: e.target.value } })}
      />

      <Select
        options={ratingOptions}
        value={item.rating !== undefined ? String(item.rating) : ''}
        onChange={(e) =>
          onChange({ rating: e.target.value ? (Number(e.target.value) as BuilderTestimonialRating) : undefined })
        }
      />
    </div>
  )
}

export const TestimonialsElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onPickAvatarFile,
  onRemoveAvatarFile,
  onDelete,
}: TestimonialsElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [libraryOpen, setLibraryOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const langChipValues = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((l) => [l, isLangComplete(element.items, l) ? '1' : '']),
  ) as PageLocalizedString

  const ratingOptions = [
    { value: '', label: t.builder.testimonialsRatingNone },
    ...([1, 2, 3, 4, 5] as const).map((n) => ({ value: String(n), label: '★'.repeat(n) })),
  ]

  const addItem = () => {
    const item: BuilderTestimonialItem = { id: crypto.randomUUID(), name: '', role: emptyLocalized(), quote: emptyLocalized() }
    onChange({ items: [...element.items, item] })
  }
  const removeItem = (id: string) => onChange({ items: element.items.filter((i) => i.id !== id) })
  const updateItem = (id: string, patch: Partial<BuilderTestimonialItem>) =>
    onChange({ items: element.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = element.items.findIndex((i) => i.id === active.id)
    const to = element.items.findIndex((i) => i.id === over.id)
    if (from < 0 || to < 0) return
    onChange({ items: arrayMove(element.items, from, to) })
  }

  const handleFileChosen = (file: File) => {
    if (!activeItemId) return
    const url = URL.createObjectURL(file)
    updateItem(activeItemId, { avatarUrl: url })
    onPickAvatarFile(url, file)
  }

  const handleLibrarySelect = (file: StorageFile) => {
    if (!activeItemId) return
    const previous = element.items.find((i) => i.id === activeItemId)?.avatarUrl
    updateItem(activeItemId, { avatarUrl: file.original.url })
    if (previous) onRemoveAvatarFile(previous)
    setLibraryOpen(false)
  }

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiDoubleQuotesL"
      label={t.builder.testimonialsElement}
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
          className="flex w-full flex-col gap-1 rounded-md p-1 text-left transition-colors hover:bg-surface-subtle"
        >
          {element.items.map((item) => (
            <p key={item.id} className="truncate text-xs text-foreground">
              {item.name || '—'} — {item.quote[language] || item.quote.en || t.builder.testimonialsEmpty}
            </p>
          ))}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.testimonialsEmpty}
        </button>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.testimonialsElement}
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
                    <TestimonialItemRow
                      key={item.id}
                      item={item}
                      editing={editing}
                      dragLabel={t.builder.testimonialsItemDragLabel}
                      removeLabel={t.builder.testimonialsRemoveLabel}
                      nameLabel={t.builder.testimonialsNameLabel}
                      roleLabel={t.builder.testimonialsRoleLabel}
                      quoteLabel={t.builder.testimonialsQuoteLabel}
                      avatarLabel={t.builder.testimonialsAvatarLabel}
                      ratingOptions={ratingOptions}
                      onChange={(patch) => updateItem(item.id, patch)}
                      onRemove={() => removeItem(item.id)}
                      onPickAvatar={() => {
                        setActiveItemId(item.id)
                        setLibraryOpen(true)
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <Button variant="secondary" onClick={addItem}>
            {t.builder.testimonialsAddLabel}
          </Button>
        </div>
      </Modal>

      <MediaLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        kind="image"
        onSelect={handleLibrarySelect}
        onUploadNew={(file) => {
          setLibraryOpen(false)
          handleFileChosen(file)
        }}
        uploadAccept={ACCEPTED}
        texts={t.builder.mediaLibrary}
      />
    </ElementShell>
  )
}
