import { RiLogoutBoxLine, RiBellLine, RiUserLine } from '@remixicon/react'
import { useSessionStore } from '@shared/model'
import { useLogout } from '@features/auth/api'

export function Header() {
  const user = useSessionStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notificaciones"
        >
          <RiBellLine size={20} />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-primary-950/10 flex items-center justify-center">
            <RiUserLine size={16} className="text-primary-950" />
          </div>
          <span className="text-sm font-medium text-slate-700 hidden md:block">
            {user?.name ?? '—'}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            className="p-2 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
            aria-label="Cerrar sesión"
          >
            <RiLogoutBoxLine size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
