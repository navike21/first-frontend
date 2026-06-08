import { Drawer, ThemeToggle, ColorPicker } from '@/shared/ui'
import clsx from 'clsx'
import { useHeaderTranslation } from '../i18n'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SectionLabel = ({ children }: { children: string }) => (
  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-(--text-muted)">
    {children}
  </p>
)

export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { t } = useHeaderTranslation()

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      title={
        <span className="text-sm font-semibold text-(--text-primary)">
          {t.settingsDrawer.title}
        </span>
      }
      className="w-80"
    >
      <div className="flex flex-col gap-6 px-5 py-6">
        {/* Mode */}
        <div>
          <SectionLabel>{t.settingsDrawer.mode}</SectionLabel>
          <div
            className={clsx(
              'flex items-center justify-between',
              'rounded-xl border border-(--border) bg-(--surface-raised)',
              'px-4 py-3',
            )}
          >
            <span className="text-sm font-medium text-(--text-primary)">
              {t.settingsDrawer.mode}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Color */}
        <div>
          <SectionLabel>{t.settingsDrawer.color}</SectionLabel>
          <div
            className={clsx(
              'rounded-xl border border-(--border) bg-(--surface-raised)',
              'px-4 py-4',
            )}
          >
            <ColorPicker />
          </div>
        </div>
      </div>
    </Drawer>
  )
}
