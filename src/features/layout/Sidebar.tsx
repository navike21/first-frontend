import { Link } from '@tanstack/react-router'
import {
  RiDashboardLine,
  RiTeamLine,
  RiGroupLine,
  RiBriefcaseLine,
  RiToolsLine,
  RiFolderImageLine,
  RiMailLine,
  RiHardDriveLine,
  RiFileListLine,
  RiSettings3Line,
  RiMessage3Line,
} from '@remixicon/react'
import { usePermission } from '@shared/hooks/use-permission'
import type { RemixiconComponentType } from '@remixicon/react'

interface NavItem {
  label: string
  to: string
  icon: RemixiconComponentType
  permission?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: RiDashboardLine },
  { label: 'Usuarios', to: '/users', icon: RiTeamLine, permission: 'users:read' },
  { label: 'Grupos', to: '/user-groups', icon: RiGroupLine, permission: 'user-groups:read' },
  { label: 'Clientes', to: '/clients', icon: RiBriefcaseLine, permission: 'clients:read' },
  { label: 'Servicios', to: '/services', icon: RiToolsLine, permission: 'services:read' },
  { label: 'Portfolio', to: '/portfolio', icon: RiFolderImageLine, permission: 'portfolio:read' },
  { label: 'Suscriptores', to: '/subscribers', icon: RiMailLine, permission: 'subscribers:read' },
  { label: 'Almacenamiento', to: '/storage', icon: RiHardDriveLine, permission: 'storage:read' },
  { label: 'Audit Logs', to: '/audit-logs', icon: RiFileListLine, permission: 'audit-logs:read' },
  { label: 'Chat', to: '/chat', icon: RiMessage3Line },
  {
    label: 'Configuración',
    to: '/app-settings',
    icon: RiSettings3Line,
    permission: 'app-settings:read',
  },
]

export function Sidebar() {
  return (
    <aside className="w-60 h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-950 text-white font-bold text-sm">
            F
          </div>
          <span className="text-base font-semibold text-slate-900">First</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} />
        ))}
      </nav>
    </aside>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const hasPermission = usePermission(item.permission ?? '')
  if (item.permission && !hasPermission) return null

  return (
    <Link
      to={item.to}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-slate-100 [&.active]:text-primary-950 [&.active]:font-semibold"
      activeProps={{ className: 'active' }}
    >
      <item.icon size={18} className="flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  )
}
