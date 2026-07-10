import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { IconButton, IconComponent, Tooltip } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import { isColumnsSection, MAX_BUILDER_COLUMNS } from '../../model/page.builder'
import type {
  BuilderColumnsCount,
  BuilderImageElement,
  BuilderSection,
  BuilderTextElement,
} from '../../model/page.types'
import { ColumnZone } from './ColumnZone'

export interface SectionCardProps {
  section: BuilderSection
  language: Language
  /** Recién soltada desde la paleta: muestra el selector de columnas antes de editar. */
  pendingChoice: boolean
  /** true mientras se arrastra un elemento en cualquier parte del lienzo. */
  elementDragActive: boolean
  onChooseColumns: (count: BuilderColumnsCount) => void
  onColumnsChange: (count: BuilderColumnsCount) => void
  onDeleteRequest: () => void
  onAddText: (columnId: string) => void
  onAddImage: (columnId: string) => void
  onElementChange: (
    columnId: string,
    elementId: string,
    patch: Partial<BuilderTextElement> | Partial<BuilderImageElement>,
  ) => void
  onElementDelete: (columnId: string, elementId: string) => void
  onPickFile: (elementId: string, file: File) => void
}

const COLUMN_OPTIONS = Array.from({ length: MAX_BUILDER_COLUMNS }, (_, i) => (i + 1) as BuilderColumnsCount)

export const SectionCard = ({
  section,
  language,
  pendingChoice,
  elementDragActive,
  onChooseColumns,
  onColumnsChange,
  onDeleteRequest,
  onAddText,
  onAddImage,
  onElementChange,
  onElementDelete,
  onPickFile,
}: SectionCardProps) => {
  const { t } = usePagesTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.sectionId,
    data: { kind: 'section' },
  })

  const editable = isColumnsSection(section)
  const columnsCount = (section.settings.columns as BuilderColumnsCount) ?? 1
  const columns = section.content.columns ?? []

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'flex flex-col gap-3 rounded-xl border border-border bg-surface p-3',
        isDragging && 'opacity-60 ring-1 ring-primary-700/30',
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={t.builder.dragSection}
          className="cursor-grab rounded p-1 text-muted hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <IconComponent icon="RiDraggable" className="h-4 w-4" />
        </button>
        <IconComponent icon="RiLayoutColumnLine" className="h-4 w-4 text-secondary" />
        <span className="flex-1 truncate text-xs font-semibold uppercase tracking-wide text-muted">
          {editable ? t.builder.paletteColumns : t.builder.unknownSection(section.type)}
        </span>

        {editable && !pendingChoice && (
          <div className="flex items-center gap-1">
            {COLUMN_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${t.builder.columnsLabel}: ${n}`}
                aria-pressed={columnsCount === n}
                onClick={() => onColumnsChange(n)}
                className={clsx(
                  'h-6 w-6 rounded-md text-xs font-semibold transition-colors',
                  columnsCount === n
                    ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
                    : 'bg-surface-subtle text-muted hover:text-foreground',
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        <Tooltip heading={t.builder.deleteSection} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.builder.deleteSection}
            onClick={onDeleteRequest}
          />
        </Tooltip>
      </div>

      {editable && pendingChoice && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-primary-600/40 bg-primary-700/10 px-4 py-6">
          <span className="text-sm font-medium text-foreground">{t.builder.chooseColumns}</span>
          <div className="flex items-center gap-2">
            {COLUMN_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onChooseColumns(n)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-sm font-bold text-foreground transition-colors hover:border-primary-600 hover:text-primary-600"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {editable && !pendingChoice && (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))` }}>
          {columns.map((column) => (
            <ColumnZone
              key={column.id}
              sectionId={section.sectionId}
              column={column}
              language={language}
              elementDragActive={elementDragActive}
              onAddText={() => onAddText(column.id)}
              onAddImage={() => onAddImage(column.id)}
              onElementChange={(elementId, patch) => onElementChange(column.id, elementId, patch)}
              onElementDelete={(elementId) => onElementDelete(column.id, elementId)}
              onPickFile={onPickFile}
            />
          ))}
        </div>
      )}

      {!editable && (
        <p className="rounded-lg border border-dashed border-border bg-surface-subtle px-3 py-4 text-center text-xs text-muted">
          {t.builder.unknownSection(section.type)}
        </p>
      )}
    </div>
  )
}
