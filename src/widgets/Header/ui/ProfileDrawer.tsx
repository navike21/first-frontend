import { Avatar, Button, Drawer, NavItem } from '@/shared/ui'
import { useTranslation } from '@/shared/i18n'
import type { AuthUser } from '@/shared/types'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  user: AuthUser | null
}

export const ProfileDrawer = ({
  isOpen,
  onClose,
  onLogout,
  user,
}: ProfileDrawerProps) => {
  const { t } = useTranslation()

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      title={
        <span className="text-sm font-semibold text-slate-700">
          {t.profileDrawer.title}
        </span>
      }
      className="w-80"
    >
      {/* User info */}
      <div className="flex flex-col items-center justify-center border-b border-gray-100 p-6 pt-10 text-center">
        <Avatar
          alt={user?.name || t.header.guestName}
          size="lg"
          className="mb-4 h-20 w-20 bg-blue-600 text-2xl font-semibold text-white"
        />
        <span className="text-lg font-bold text-slate-800">
          {user?.name || t.header.guestName}
        </span>
        <span className="text-sm text-slate-500">
          {user?.email || 'test@navike21.com'}
        </span>
      </div>

      {/* Account menu */}
      <div className="flex-1 px-4 py-6">
        <NavItem icon="RiSettings3Line" label={t.profileDrawer.accountSettings} />
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <Button
          fullWidth
          variant="primary"
          icon="RiLogoutBoxRLine"
          onClick={onLogout}
        >
          {t.profileDrawer.logout}
        </Button>
      </div>
    </Drawer>
  )
}
