import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { IconButton, IconComponent, Tooltip } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import { isColumnsSection, isPendingColumnsChoice, MAX_BUILDER_COLUMNS } from '../../model/page.builder'
import type { ResponsiveSectionSettings } from '../../model/page.builder'
import type {
  BackgroundBreakpoint,
  BackgroundConfig,
  BackgroundFileSlot,
  BuilderColumnsCount,
  BuilderElementPatch,
  BuilderSection,
} from '../../model/page.types'
import { ColumnZone } from './ColumnZone'
import { SectionSettingsModal } from './SectionSettingsModal'

export interface SectionCardProps {
  section: BuilderSection
  language: Language
  /** true mientras se arrastra un elemento en cualquier parte del lienzo. */
  elementDragActive: boolean
  onChooseColumns: (count: BuilderColumnsCount) => void
  onColumnsChange: (count: BuilderColumnsCount) => void
  onResponsiveChange: (patch: ResponsiveSectionSettings) => void
  onBackgroundChange: (breakpoint: BackgroundBreakpoint, config: BackgroundConfig) => void
  onPickBackgroundFile: (breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot, file: File) => void
  onPickLibraryFile: (breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot, file: StorageFile) => void
  onDeleteRequest: () => void
  onAddText: (columnId: string) => void
  onAddImage: (columnId: string) => void
  onAddSlider: (columnId: string) => void
  onAddButton: (columnId: string) => void
  onAddGallery: (columnId: string) => void
  onAddAccordion: (columnId: string) => void
  onAddTestimonials: (columnId: string) => void
  onAddStats: (columnId: string) => void
  onAddVideo: (columnId: string) => void
  onAddMap: (columnId: string) => void
  onElementChange: (columnId: string, elementId: string, patch: BuilderElementPatch) => void
  onElementDelete: (columnId: string, elementId: string) => void
  onPickFile: (elementId: string, file: File) => void
  onSelectImageLibrary: (elementId: string, file: StorageFile) => void
  onPickSliderFile: (elementId: string, url: string, file: File, kind: 'image' | 'video') => void
  onRemoveSliderFile: (url: string) => void
  onPickGalleryFile: (elementId: string, url: string, file: File) => void
  onRemoveGalleryFile: (url: string) => void
  onPickTestimonialAvatarFile: (elementId: string, url: string, file: File) => void
  onRemoveTestimonialAvatarFile: (url: string) => void
}

const COLUMN_OPTIONS = Array.from({ length: MAX_BUILDER_COLUMNS }, (_, i) => (i + 1) as BuilderColumnsCount)

export const SectionCard = ({
  section,
  language,
  elementDragActive,
  onChooseColumns,
  onColumnsChange,
  onResponsiveChange,
  onBackgroundChange,
  onPickBackgroundFile,
  onPickLibraryFile,
  onDeleteRequest,
  onAddText,
  onAddImage,
  onAddSlider,
  onAddButton,
  onAddGallery,
  onAddAccordion,
  onAddTestimonials,
  onAddStats,
  onAddVideo,
  onAddMap,
  onElementChange,
  onElementDelete,
  onPickFile,
  onSelectImageLibrary,
  onPickSliderFile,
  onRemoveSliderFile,
  onPickGalleryFile,
  onRemoveGalleryFile,
  onPickTestimonialAvatarFile,
  onRemoveTestimonialAvatarFile,
}: SectionCardProps) => {
  const { t } = usePagesTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.sectionId,
    data: { kind: 'section' },
  })
  const [settingsOpen, setSettingsOpen] = useState(false)

  const editable = isColumnsSection(section)
  // Cada sección lleva su propio estado "pendiente de elegir columnas"
  // (settings.columns === undefined), en vez de depender de un id externo
  // que solo puede rastrear una sección a la vez.
  const pendingChoice = isPendingColumnsChoice(section)
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

        {editable && !pendingChoice && (
          <Tooltip heading={t.builder.sectionSettings} position="top" size="small">
            <IconButton
              icon="RiSettings3Line"
              variant="text"
              size="small"
              aria-label={t.builder.sectionSettings}
              onClick={() => setSettingsOpen(true)}
            />
          </Tooltip>
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
        // `minmax(12rem, 1fr)` (not `minmax(0, 1fr)`) so columns never shrink
        // past a usable width on a narrow admin viewport — 3-4 columns used
        // to squeeze into whatever space was available, cramming the T/
        // imagen/slider mini-icons together (confirmed live, mobile-first
        // check). `overflow-x-auto` lets the row scroll horizontally once
        // the columns' combined minimum no longer fits, instead of shrinking
        // them further or clipping.
        <div
          className="grid gap-3 overflow-x-auto pb-1"
          style={{ gridTemplateColumns: `repeat(${columnsCount}, minmax(12rem, 1fr))` }}
        >
          {columns.map((column) => (
            <ColumnZone
              key={column.id}
              sectionId={section.sectionId}
              column={column}
              language={language}
              elementDragActive={elementDragActive}
              onAddText={() => onAddText(column.id)}
              onAddImage={() => onAddImage(column.id)}
              onAddSlider={() => onAddSlider(column.id)}
              onAddButton={() => onAddButton(column.id)}
              onAddGallery={() => onAddGallery(column.id)}
              onAddAccordion={() => onAddAccordion(column.id)}
              onAddTestimonials={() => onAddTestimonials(column.id)}
              onAddStats={() => onAddStats(column.id)}
              onAddVideo={() => onAddVideo(column.id)}
              onAddMap={() => onAddMap(column.id)}
              onElementChange={(elementId, patch) => onElementChange(column.id, elementId, patch)}
              onElementDelete={(elementId) => onElementDelete(column.id, elementId)}
              onPickFile={onPickFile}
              onSelectImageLibrary={onSelectImageLibrary}
              onPickSliderFile={onPickSliderFile}
              onRemoveSliderFile={onRemoveSliderFile}
              onPickGalleryFile={onPickGalleryFile}
              onRemoveGalleryFile={onRemoveGalleryFile}
              onPickTestimonialAvatarFile={onPickTestimonialAvatarFile}
              onRemoveTestimonialAvatarFile={onRemoveTestimonialAvatarFile}
            />
          ))}
        </div>
      )}

      {!editable && (
        <p className="rounded-lg border border-dashed border-border bg-surface-subtle px-3 py-4 text-center text-xs text-muted">
          {t.builder.unknownSection(section.type)}
        </p>
      )}

      {editable && !pendingChoice && (
        <SectionSettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          columns={columnsCount}
          settings={{
            tabletColumns: section.settings.tabletColumns as BuilderColumnsCount | undefined,
            mobileColumns: section.settings.mobileColumns as BuilderColumnsCount | undefined,
            hiddenOnTablet: section.settings.hiddenOnTablet,
            hiddenOnMobile: section.settings.hiddenOnMobile,
          }}
          onChange={onResponsiveChange}
          background={section.settings.background ?? {}}
          onBackgroundChange={onBackgroundChange}
          onPickBackgroundFile={onPickBackgroundFile}
          onPickLibraryFile={onPickLibraryFile}
        />
      )}
    </div>
  )
}
