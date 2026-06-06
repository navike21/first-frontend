import clsx from 'clsx'
import { Avatar, Button, Drawer, NavItem, ThemeToggle } from '@/shared/ui'
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
      title={<span className="text-sm font-semibold text-slate-700">{t.profileDrawer.title}</span>}
      className="w-80"
    >
      <div className="flex flex-col items-center justify-center border-b border-gray-100 p-6 pt-10 text-center">
        <Avatar
          src={user?.profilePictureUrl}
          alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || t.guestName}
          size="lg"
        />
        <span className="text-lg font-bold text-slate-800">
          {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || t.guestName}
        </span>
        <span className="text-sm text-slate-500">{user?.email || 'test@navike21.com'}</span>
      </div>

      <div className="flex-1 px-4 py-6">
        <NavItem icon="RiSettings3Line" label={t.profileDrawer.accountSettings} />

        {/* Theme toggle row */}
        <div className={clsx(
          'mt-1 flex items-center justify-between px-3 py-2.5',
          'rounded-lg',
        )}>
          <span className="text-sm font-medium text-slate-600">
            {t.profileDrawer.theme}
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t border-gray-100 p-4">
        <Button fullWidth variant="primary" icon="RiLogoutBoxRLine" onClick={onLogout}>
          {t.profileDrawer.logout}
        </Button>
      </div>
    </Drawer>
  )
}
