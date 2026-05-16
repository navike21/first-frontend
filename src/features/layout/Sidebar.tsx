import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  Mail,
  HardDrive,
  ScrollText,
  Settings,
  UsersRound,
  MessageSquare,
} from 'lucide-react'
import { usePermission } from '@shared/hooks/use-permission'

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  permission?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Usuarios', to: '/users', icon: Users, permission: 'users:read' },
  { label: 'Grupos', to: '/user-groups', icon: UsersRound, permission: 'user-groups:read' },
  { label: 'Clientes', to: '/clients', icon: Briefcase, permission: 'clients:read' },
  { label: 'Servicios', to: '/services', icon: FolderKanban, permission: 'services:read' },
  { label: 'Portfolio', to: '/portfolio', icon: FolderKanban, permission: 'portfolio:read' },
  { label: 'Suscriptores', to: '/subscribers', icon: Mail, permission: 'subscribers:read' },
  { label: 'Almacenamiento', to: '/storage', icon: HardDrive, permission: 'storage:read' },
  { label: 'Audit Logs', to: '/audit-logs', icon: ScrollText, permission: 'audit-logs:read' },
  { label: 'Chat', to: '/chat', icon: MessageSquare },
  { label: 'Configuración', to: '/app-settings', icon: Settings, permission: 'app-settings:read' },
]

export function Sidebar() {
  return (
    <aside className="w-64 h-full bg-[--color-card] border-r border-[--color-border] flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[--color-border]">
        <span className="text-xl font-bold text-[--color-primary]">First</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
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
      className="flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-sm font-medium text-[--color-muted] hover:bg-[--color-border] hover:text-[--color-foreground] transition-colors [&.active]:bg-[--color-primary]/10 [&.active]:text-[--color-primary]"
      activeProps={{ className: 'active' }}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  )
}
