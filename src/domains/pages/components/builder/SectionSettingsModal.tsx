import { useState } from 'react'
import clsx from 'clsx'
import { Button, Modal, Select, Switch, Tabs } from '@/shared/ui'
import type { TabItem } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import { BUILDER_LAYOUT_PRESETS } from '../../model/page.builder'
import type { ResponsiveSectionSettings } from '../../model/page.builder'
import type {
  BackgroundBreakpoint,
  BackgroundConfig,
  BackgroundFileSlot,
  BuilderColumnSpan,
  BuilderColumnsCount,
  SectionBackground,
} from '../../model/page.types'
import { SectionBackgroundTab } from './SectionBackgroundTab'

export interface SectionSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  /** Columnas de escritorio de la sección: tope de los selectores responsive. */
  columns: BuilderColumnsCount
  /** Spans efectivos actuales (escritorio): resalta el preset activo. */
  spans: BuilderColumnSpan[]
  onLayoutChange: (spans: BuilderColumnSpan[]) => void
  settings: ResponsiveSectionSettings
  onChange: (patch: ResponsiveSectionSettings) => void
  background: SectionBackground
  onBackgroundChange: (
    breakpoint: BackgroundBreakpoint,
    config: BackgroundConfig
  ) => void
  onPickBackgroundFile: (
    breakpoint: BackgroundBreakpoint,
    slot: BackgroundFileSlot,
    file: File
  ) => void
  onPickLibraryFile: (
    breakpoint: BackgroundBreakpoint,
    slot: BackgroundFileSlot,
    file: StorageFile
  ) => void
}

const spansEqual = (a: BuilderColumnSpan[], b: BuilderColumnSpan[]) =>
  a.length === b.length && a.every((n, i) => n === b[i])

interface LayoutPresetPickerProps {
  columns: BuilderColumnsCount
  value: BuilderColumnSpan[]
  onChange: (spans: BuilderColumnSpan[]) => void
}

/** Distribuciones de ancho (escritorio) como mini-diagramas proporcionales al
 * grid de 12. Solo aparece con 2-3 columnas: con 1 y 4 solo existe el
 * simétrico, así que un único preset no aporta elección. */
const LayoutPresetPicker = ({
  columns,
  value,
  onChange,
}: LayoutPresetPickerProps) => {
  const presets = BUILDER_LAYOUT_PRESETS[columns]
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const active = spansEqual(preset, value)
        return (
          <button
            key={preset.join('-')}
            type="button"
            aria-pressed={active}
            aria-label={preset.join(' / ')}
            onClick={() => onChange(preset)}
            className={clsx(
              'flex h-10 min-w-24 flex-1 cursor-pointer items-stretch gap-0.5 rounded-lg border p-1 transition-colors',
              active
                ? 'border-primary-600 bg-primary-700/10'
                : 'border-border bg-surface hover:border-primary-600'
            )}
          >
            {preset.map((span, i) => (
              <span
                key={i}
                style={{ flexGrow: span }}
                className={clsx(
                  'flex items-center justify-center rounded text-[10px] font-bold',
                  active
                    ? 'bg-primary-700/20 text-primary-600'
                    : 'bg-surface-subtle text-muted'
                )}
              >
                {span}
              </span>
            ))}
          </button>
        )
      })}
    </div>
  )
}

interface ColumnPickerProps {
  max: BuilderColumnsCount
  value: BuilderColumnsCount
  onChange: (count: BuilderColumnsCount) => void
}

const ColumnPicker = ({ max, value, onChange }: ColumnPickerProps) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: max }, (_, i) => (i + 1) as BuilderColumnsCount).map(
      (n) => (
        <button
          key={n}
          type="button"
          aria-pressed={value === n}
          onClick={() => onChange(n)}
          className={clsx(
            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-bold transition-colors',
            value === n
              ? 'border-primary-600 bg-primary-700/10 text-primary-600'
              : 'border-border bg-surface text-foreground hover:border-primary-600 hover:text-primary-600'
          )}
        >
          {n}
        </button>
      )
    )}
  </div>
)

type ColumnsBreakpoint = 'tablet' | 'mobile'
type SettingsTab = 'columns' | 'background'

/** Configuración de una sección: columnas responsive (tablet/móvil) y fondo
 * (imagen o video, por breakpoint desktop/tablet/móvil). */
export const SectionSettingsModal = ({
  isOpen,
  onClose,
  columns,
  spans,
  onLayoutChange,
  settings,
  onChange,
  background,
  onBackgroundChange,
  onPickBackgroundFile,
  onPickLibraryFile,
}: SectionSettingsModalProps) => {
  const { t } = usePagesTranslation()
  const [activeTab, setActiveTab] = useState<SettingsTab>('columns')
  const [columnsBreakpoint, setColumnsBreakpoint] =
    useState<ColumnsBreakpoint>('tablet')
  const tabletColumns = settings.tabletColumns ?? columns
  const mobileColumns = settings.mobileColumns ?? columns

  const tabs: TabItem[] = [
    { id: 'columns', label: t.builder.tabColumns, icon: 'RiLayoutColumnLine' },
    { id: 'background', label: t.builder.tabBackground, icon: 'RiImage2Line' },
  ]

  const columnsBreakpointOptions = [
    {
      value: 'tablet',
      label: t.builder.tabletColumns,
      icon: 'RiTabletLine' as const,
    },
    {
      value: 'mobile',
      label: t.builder.mobileColumns,
      icon: 'RiSmartphoneLine' as const,
    },
  ]
  const columnsHidden =
    columnsBreakpoint === 'tablet'
      ? !!settings.hiddenOnTablet
      : !!settings.hiddenOnMobile
  const columnsValue =
    columnsBreakpoint === 'tablet' ? tabletColumns : mobileColumns
  const columnsHideLabel =
    columnsBreakpoint === 'tablet'
      ? t.builder.hideOnTablet
      : t.builder.hideOnMobile

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={t.builder.sectionSettings}
      footer={
        <Button variant="primary" onClick={onClose}>
          {t.builder.done}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as SettingsTab)}
          instanceId="section-settings"
          ariaLabel={t.builder.sectionSettings}
        />

        {activeTab === 'columns' &&
          BUILDER_LAYOUT_PRESETS[columns].length > 1 && (
            <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-xl border p-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-xs font-medium">
                  {t.builder.layout.label}
                </span>
                <span className="text-muted text-[11px]">
                  {t.builder.layout.hint}
                </span>
              </div>
              <LayoutPresetPicker
                columns={columns}
                value={spans}
                onChange={onLayoutChange}
              />
            </div>
          )}

        {activeTab === 'columns' && (
          <div className="border-border bg-surface-subtle flex flex-col gap-4 rounded-xl border p-4">
            <Select
              label={t.builder.breakpoint.label}
              options={columnsBreakpointOptions}
              value={columnsBreakpoint}
              onChange={(e) =>
                setColumnsBreakpoint(e.target.value as ColumnsBreakpoint)
              }
            />
            {!columnsHidden && (
              <ColumnPicker
                max={columns}
                value={columnsValue}
                onChange={(count) =>
                  onChange(
                    columnsBreakpoint === 'tablet'
                      ? { tabletColumns: count }
                      : { mobileColumns: count }
                  )
                }
              />
            )}
            <Switch
              label={columnsHideLabel}
              checked={columnsHidden}
              onChange={(e) =>
                onChange(
                  columnsBreakpoint === 'tablet'
                    ? { hiddenOnTablet: e.target.checked }
                    : { hiddenOnMobile: e.target.checked }
                )
              }
            />
          </div>
        )}

        {activeTab === 'background' && (
          <SectionBackgroundTab
            background={background}
            onChange={onBackgroundChange}
            onPickFile={onPickBackgroundFile}
            onPickLibraryFile={onPickLibraryFile}
          />
        )}
      </div>
    </Modal>
  )
}
