import clsx from 'clsx'
import { Avatar, Button, Drawer, NavItem, ThemeToggle, ColorPicker } from '@/shared/ui'
import { useHeaderTranslation } from '../i18n'
import type { AuthUser } from '@/shared/types'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  user: AuthUser | null
}

export const ProfileDrawer = ({ isOpen, onClose, onLogout, user }: ProfileDrawerProps) => {
  const { t } = useHeaderTranslation()

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      title={<span className="text-sm font-semibold text-(--text-primary)">{t.profileDrawer.title}</span>}
      className="w-80"
    >
      <div className="flex flex-col items-center justify-center border-b border-(--border-subtle) p-6 pt-10 text-center">
        <Avatar
          src={user?.profilePictureUrl}
          alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || t.guestName}
          size="lg"
        />
        <span className="text-lg font-bold text-(--text-primary)">
          {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || t.guestName}
        </span>
        <span className="text-sm text-(--text-secondary)">{user?.email || 'test@navike21.com'}</span>
      </div>

      <div className="flex-1 px-4 py-6">
        <NavItem icon="RiSettings3Line" label={t.profileDrawer.accountSettings} />

        {/* Appearance section */}
        <div className="mt-3 space-y-0.5">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
            {t.profileDrawer.theme}
          </p>
          {/* Color picker row */}
          <div className={clsx('flex items-center justify-between rounded-lg px-3 py-2')}>
            <span className="text-sm font-medium text-(--text-secondary)">
              {t.profileDrawer.color}
            </span>
            <ColorPicker />
          </div>
          {/* Mode toggle row */}
          <div className={clsx('flex items-center justify-between rounded-lg px-3 py-2')}>
            <span className="text-sm font-medium text-(--text-secondary)">
              {t.profileDrawer.mode}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="border-t border-(--border-subtle) p-4">
        <Button fullWidth variant="primary" icon="RiLogoutBoxRLine" onClick={onLogout}>
          {t.profileDrawer.logout}
        </Button>
      </div>
    </Drawer>
  )
}
