import { LogOut, Bell, User } from 'lucide-react'
import { useAuthStore } from '@features/auth/store'
import { useLogout } from '@features/auth/api'

export function Header() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const { mutate: logout, isPending } = useLogout()

  return (
    <header className="h-16 border-b border-[--color-border] bg-[--color-card] flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-[--radius-md] text-[--color-muted] hover:bg-[--color-border] transition-colors"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-[--color-border]">
          <div className="w-8 h-8 rounded-full bg-[--color-primary]/20 flex items-center justify-center">
            <User size={16} className="text-[--color-primary]" />
          </div>
          <span className="text-sm font-medium hidden md:block">
            {currentUser?.firstName} {currentUser?.lastName}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            className="p-2 rounded-[--radius-md] text-[--color-muted] hover:bg-[--color-danger]/10 hover:text-[--color-danger] transition-colors disabled:opacity-50"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
