import { Avatar, Button, Drawer, NavItem } from '@/shared/ui'
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
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      title={
        <span className="text-sm font-semibold text-slate-700">Mi cuenta</span>
      }
      className="w-80"
    >
      {/* User info */}
      <div className="flex flex-col items-center justify-center border-b border-gray-100 p-6 pt-10 text-center">
        <Avatar
          alt={user?.name || 'Invitado'}
          size="lg"
          className="mb-4 h-20 w-20 bg-blue-600 text-2xl font-semibold text-white"
        />
        <span className="text-lg font-bold text-slate-800">
          {user?.name || 'Usuario Invitado'}
        </span>
        <span className="text-sm text-slate-500">
          {user?.email || 'test@navike21.com'}
        </span>
      </div>

      {/* Account menu */}
      <div className="flex-1 px-4 py-6">
        <NavItem icon="RiSettings3Line" label="Configuración de la cuenta" />
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <Button
          fullWidth
          variant="primary"
          icon="RiLogoutBoxRLine"
          onClick={onLogout}
        >
          Cerrar sesión
        </Button>
      </div>
    </Drawer>
  )
}
