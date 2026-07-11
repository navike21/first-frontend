import { useState } from 'react'
import clsx from 'clsx'
import { Button, IconComponent, Modal, Switch, Tabs } from '@/shared/ui'
import type { TabItem } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import type { ResponsiveSectionSettings } from '../../model/page.builder'
import type {
  BackgroundBreakpoint,
  BackgroundConfig,
  BackgroundFileSlot,
  BuilderColumnsCount,
  SectionBackground,
} from '../../model/page.types'
import { SectionBackgroundTab } from './SectionBackgroundTab'

export interface SectionSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  /** Columnas de escritorio de la sección: tope de los selectores responsive. */
  columns: BuilderColumnsCount
  settings: ResponsiveSectionSettings
  onChange: (patch: ResponsiveSectionSettings) => void
  background: SectionBackground
  onBackgroundChange: (breakpoint: BackgroundBreakpoint, config: BackgroundConfig) => void
  onPickBackgroundFile: (breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot, file: File) => void
  onPickLibraryFile: (breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot, file: StorageFile) => void
}

interface ColumnPickerProps {
  max: BuilderColumnsCount
  value: BuilderColumnsCount
  onChange: (count: BuilderColumnsCount) => void
}

const ColumnPicker = ({ max, value, onChange }: ColumnPickerProps) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: max }, (_, i) => (i + 1) as BuilderColumnsCount).map((n) => (
      <button
        key={n}
        type="button"
        aria-pressed={value === n}
        onClick={() => onChange(n)}
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold transition-colors',
          value === n
            ? 'border-primary-600 bg-primary-700/10 text-primary-600'
            : 'border-border bg-surface text-foreground hover:border-primary-600 hover:text-primary-600',
        )}
      >
        {n}
      </button>
    ))}
  </div>
)

interface BreakpointFieldsetProps {
  icon: IconName
  title: string
  hideLabel: string
  hidden: boolean
  onHiddenChange: (hidden: boolean) => void
  max: BuilderColumnsCount
  value: BuilderColumnsCount
  onColumnsChange: (count: BuilderColumnsCount) => void
}

const BreakpointFieldset = ({
  icon,
  title,
  hideLabel,
  hidden,
  onHiddenChange,
  max,
  value,
  onColumnsChange,
}: BreakpointFieldsetProps) => (
  <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-subtle p-3">
    <div className="flex items-center gap-2">
      <IconComponent icon={icon} className="h-4 w-4 text-secondary" />
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
    {!hidden && <ColumnPicker max={max} value={value} onChange={onColumnsChange} />}
    <Switch label={hideLabel} checked={hidden} onChange={(e) => onHiddenChange(e.target.checked)} />
  </div>
)

type SettingsTab = 'columns' | 'background'

/** Configuración de una sección: columnas responsive (tablet/móvil) y fondo
 * (imagen o video, por breakpoint desktop/tablet/móvil). */
export const SectionSettingsModal = ({
  isOpen,
  onClose,
  columns,
  settings,
  onChange,
  background,
  onBackgroundChange,
  onPickBackgroundFile,
  onPickLibraryFile,
}: SectionSettingsModalProps) => {
  const { t } = usePagesTranslation()
  const [activeTab, setActiveTab] = useState<SettingsTab>('columns')
  const tabletColumns = settings.tabletColumns ?? columns
  const mobileColumns = settings.mobileColumns ?? columns

  const tabs: TabItem[] = [
    { id: 'columns', label: t.builder.tabColumns, icon: 'RiLayoutColumnLine' },
    { id: 'background', label: t.builder.tabBackground, icon: 'RiImage2Line' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
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

        {activeTab === 'columns' && (
          <div className="flex flex-col gap-3">
            <BreakpointFieldset
              icon="RiTabletLine"
              title={t.builder.tabletColumns}
              hideLabel={t.builder.hideOnTablet}
              hidden={!!settings.hiddenOnTablet}
              onHiddenChange={(hiddenOnTablet) => onChange({ hiddenOnTablet })}
              max={columns}
              value={tabletColumns}
              onColumnsChange={(tabletColumnsValue) => onChange({ tabletColumns: tabletColumnsValue })}
            />
            <BreakpointFieldset
              icon="RiSmartphoneLine"
              title={t.builder.mobileColumns}
              hideLabel={t.builder.hideOnMobile}
              hidden={!!settings.hiddenOnMobile}
              onHiddenChange={(hiddenOnMobile) => onChange({ hiddenOnMobile })}
              max={columns}
              value={mobileColumns}
              onColumnsChange={(mobileColumnsValue) => onChange({ mobileColumns: mobileColumnsValue })}
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
