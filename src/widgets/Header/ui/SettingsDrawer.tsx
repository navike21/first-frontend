import { Drawer, LanguageSwitcher } from '@/shared/ui'
import clsx from 'clsx'
import { useHeaderTranslation } from '../i18n'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SectionLabel = ({ children }: { children: string }) => (
  <p className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
    {children}
  </p>
)

// El toggle de tema vive en UserMenu (Design System: "Menú de usuario"
// incluye Tema oscuro/claro adentro) — este drawer solo cubre idioma.
export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { t } = useHeaderTranslation()

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      title={
        <span className="text-sm font-semibold text-foreground">
          {t.settingsDrawer.title}
        </span>
      }
      className="w-80"
    >
      <div className="flex flex-col gap-6 px-5 py-6">
        {/* Language */}
        <div>
          <SectionLabel>{t.language.label}</SectionLabel>
          <LanguageSwitcher
            className={clsx(
              'w-full',
              '[&_[data-select-trigger-label]]:inline',
              'sm:[&_[data-select-trigger-label]]:inline'
            )}
          />
        </div>
      </div>
    </Drawer>
  )
}
