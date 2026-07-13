import clsx from 'clsx'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconComponent } from '../../atoms/IconComponent'
import { MediaLibraryModal } from '../MediaLibraryModal'
import { useGalleryPicker } from './GalleryPicker.hooks'
import type { GalleryItem, GalleryPickerProps } from './GalleryPicker.types'

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'

interface TileProps {
  item: GalleryItem
  removeLabel: string
  disabled?: boolean
  onRemove: (key: string) => void
}

const Tile = ({ item, removeLabel, disabled, onRemove }: TileProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.key,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={clsx(
        // Layout
        'relative aspect-square touch-none overflow-hidden rounded-lg',
        // Visual
        'border border-border bg-surface-subtle',
        // Transitions
        'transition-opacity',
        // States
        isDragging && 'opacity-50',
        !disabled && 'cursor-grab active:cursor-grabbing',
      )}
    >
      <img src={item.url} alt="" className="h-full w-full object-cover" />
      {!disabled && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onRemove(item.key)
          }}
          aria-label={removeLabel}
          className={clsx(
            // Layout
            'absolute top-1 right-1 flex h-6 w-6 items-center justify-center',
            // Visual
            'rounded-full bg-red-600 text-white ring-2 ring-surface',
            // Transitions
            'transition-colors',
            // States
            'hover:bg-red-700',
          )}
        >
          <IconComponent icon="RiDeleteBinLine" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

interface AddTileProps {
  label: string
  isDragging: boolean
  dragLabel?: string
  disabled?: boolean
  onClick: () => void
}

const AddTile = ({ label, isDragging, dragLabel, disabled, onClick }: AddTileProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={clsx(
      // Layout
      'flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg',
      // Visual
      'border-2 border-dashed border-border bg-surface-subtle text-muted',
      // Transitions
      'transition-colors',
      // States
      isDragging && 'border-primary-600 bg-primary-700/5 text-primary-600',
      !disabled && !isDragging && 'hover:border-primary-600/60 hover:bg-primary-700/5',
      disabled && 'cursor-not-allowed opacity-50',
    )}
  >
    <IconComponent icon="RiImageAddLine" className="h-6 w-6" />
    <span className="px-1 text-center text-xs font-medium leading-tight">
      {isDragging ? dragLabel : label}
    </span>
  </button>
)

export const GalleryPicker = ({
  items,
  onItemsChange,
  uploadLabel = 'Add photos',
  dragLabel = 'Drop to upload',
  removeLabel = 'Remove photo',
  formatsHint,
  maxItemsHint,
  errorMessage,
  disabled,
  maxItems = 10,
  maxBytes,
  accept = ACCEPTED,
  onSelectLibrary,
  libraryTexts,
}: GalleryPickerProps) => {
  const {
    inputRef,
    error,
    isDragging,
    atMax,
    handleChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openPicker,
    addFiles,
    addLibraryFiles,
    removeItem,
    handleDragEnd,
  } = useGalleryPicker({ items, onItemsChange, maxItems, maxBytes })
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const libraryFirst = Boolean(onSelectLibrary && libraryTexts)
  const openMain = libraryFirst ? () => setIsLibraryOpen(true) : openPicker

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const displayError = error || errorMessage
  const dragHandlers = disabled
    ? {}
    : { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop }

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event: DragEndEvent) => handleDragEnd(event)}
      >
        <SortableContext items={items.map((item) => item.key)} strategy={rectSortingStrategy}>
          <div
            {...dragHandlers}
            className={clsx(
              'grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5',
              displayError && 'rounded-lg ring-1 ring-red-500',
            )}
          >
            {items.map((item) => (
              <Tile key={item.key} item={item} removeLabel={removeLabel} disabled={disabled} onRemove={removeItem} />
            ))}
            {!atMax && (
              <AddTile
                label={uploadLabel}
                dragLabel={dragLabel}
                isDragging={isDragging}
                disabled={disabled}
                onClick={openMain}
              />
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {displayError && <p className="text-xs font-medium text-red-500">{displayError}</p>}
      {!displayError && (atMax ? maxItemsHint : formatsHint) && (
        <p className="text-xs text-muted">{atMax ? maxItemsHint : formatsHint}</p>
      )}

      {onSelectLibrary && libraryTexts && (
        <MediaLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          kind="image"
          multiple
          onSelectMultiple={addLibraryFiles}
          onUploadNew={(file) => addFiles([file])}
          uploadAccept={accept}
          texts={libraryTexts}
        />
      )}
    </div>
  )
}
