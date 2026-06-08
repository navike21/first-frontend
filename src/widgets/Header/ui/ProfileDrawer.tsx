import clsx from 'clsx'
import { Avatar, Button, Drawer, IconComponent } from '@/shared/ui'
import { Link } from '@tanstack/react-router'
import { useHeaderTranslation } from '../i18n'
import { navPaths } from '@/shared/router'
import type { AuthUser } from '@/shared/types'
import type { IconName } from '@/shared/types/icons'

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  user: AuthUser | null
}

interface NavLinkItem {
  icon: IconName
  label: string
  to: string
}

export const ProfileDrawer = ({
  isOpen,
  onClose,
  onLogout,
  user,
}: ProfileDrawerProps) => {
  const { t } = useHeaderTranslation()

  const navLinks: NavLinkItem[] = [
    { icon: 'RiHomeLine', label: t.profileDrawer.home, to: navPaths.home() },
    { icon: 'RiUserLine', label: t.profileDrawer.users, to: navPaths.users() },
    {
      icon: 'RiGroupLine',
      label: t.profileDrawer.userGroups,
      to: navPaths.userGroups(),
    },
  ]

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      title={
        <span className="text-sm font-semibold text-(--text-primary)">
          {t.profileDrawer.title}
        </span>
      }
      className="w-80"
    >
      {/* Profile header */}
      <div
        className={clsx(
          'flex flex-col items-center gap-3',
          'border-b border-(--border-subtle) px-6 py-8'
        )}
      >
        <Avatar
          src={user?.profilePictureUrl}
          alt={
            `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
            t.guestName
          }
          size="lg"
        />
        <div className="text-center">
          <p className="text-base font-bold text-(--text-primary)">
            {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
              t.guestName}
          </p>
          <p className="mt-0.5 text-sm text-(--text-secondary)">
            {user?.email || t.guestEmail}
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {navLinks.map(({ icon, label, to }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={onClose}
                className={clsx(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5',
                  'text-sm font-medium text-(--text-secondary)',
                  'duration-fast ease-out-expo transition-colors',
                  'hover:bg-(--color-primary-950)/20 hover:text-white'
                )}
              >
                <IconComponent
                  icon={icon}
                  className="h-5 w-5 shrink-0 text-(--text-muted) transition-colors group-hover:text-white"
                />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-(--border-subtle) p-4">
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
