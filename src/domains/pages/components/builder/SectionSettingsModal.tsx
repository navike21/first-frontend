import clsx from 'clsx'
import { Button, IconComponent, Modal, Switch } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'
import { usePagesTranslation } from '../../i18n'
import type { ResponsiveSectionSettings } from '../../model/page.builder'
import type { BuilderColumnsCount } from '../../model/page.types'

export interface SectionSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  /** Columnas de escritorio de la sección: tope de los selectores responsive. */
  columns: BuilderColumnsCount
  settings: ResponsiveSectionSettings
  onChange: (patch: ResponsiveSectionSettings) => void
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

/** Configuración responsive de una sección: cuántas columnas por fila se ven
 * en tablet/móvil (acotado al número de columnas de escritorio de la propia
 * sección) y si se oculta por completo en ese breakpoint. */
export const SectionSettingsModal = ({ isOpen, onClose, columns, settings, onChange }: SectionSettingsModalProps) => {
  const { t } = usePagesTranslation()
  const tabletColumns = settings.tabletColumns ?? columns
  const mobileColumns = settings.mobileColumns ?? columns

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={t.builder.sectionSettings}
      footer={
        <Button variant="primary" onClick={onClose}>
          {t.builder.done}
        </Button>
      }
    >
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
    </Modal>
  )
}
