import { IconComponent, IconButton, BrandMark, UserMenu } from '@/shared/ui'
import clsx from 'clsx'
import { useHeader } from '../model/useHeader'
import { useHeaderTranslation } from '../i18n'
import { SettingsDrawer } from './SettingsDrawer'
import { useUserAvatarStatus } from '@/shared/model/presence.store'
import { navPaths } from '@/shared/router'

export const Header = () => {
  const {
    user,
    isCollapsed,
    isSettingsOpen,
    toggleSettings,
    closeSettings,
    logout,
    toggleSidebar,
    toggleMobileSidebar,
    isLoading,
  } = useHeader()

  const { t } = useHeaderTranslation()
  const avatarStatus = useUserAvatarStatus(user?.id ?? '')

  return (
    <header
      className={clsx(
        'z-40 flex w-full items-center justify-between gap-2',
        'px-4 py-3 md:px-6 md:py-4',
        'border-border bg-surface border-b shadow-sm'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileSidebar}
          className={clsx(
            'cursor-pointer p-2',
            'text-secondary rounded-md',
            'duration-fast ease-out-expo transition-colors',
            'hover:bg-surface-subtle hover:text-foreground',
            'focus:outline-none',
            'md:hidden'
          )}
        >
          <IconComponent icon="RiMenuLine" className="h-5 w-5" />
        </button>

        {/* Desktop Toggle */}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'cursor-pointer p-2',
            'text-secondary rounded-md',
            'duration-fast ease-out-expo transition-colors',
            'hover:bg-surface-subtle hover:text-foreground',
            'focus:outline-none',
            'hidden md:block'
          )}
          aria-label={isCollapsed ? t.expandMenu : t.collapseMenu}
        >
          <IconComponent
            icon={isCollapsed ? 'RiMenuUnfoldLine' : 'RiMenuFoldLine'}
            className="h-5 w-5"
          />
        </button>

        <div className="flex items-center gap-3">
          <h1>
            <BrandMark size="x-small" pulse={isLoading} />
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <IconButton icon="RiNotification3Line" shape="circle" variant="text" />

        {/* User menu */}
        <div className="border-border ml-2 border-l pl-3">
          <UserMenu
            name={
              user ? `${user.firstName} ${user.lastName}`.trim() : t.guestName
            }
            email={user?.email ?? t.guestEmail}
            avatarSrc={user?.profilePictureUrl}
            avatarStatus={avatarStatus}
            profileHref={navPaths.profile()}
            labels={t.userMenu}
            onPreferencesClick={toggleSettings}
            onLogoutClick={logout}
          />
        </div>
      </div>

      <SettingsDrawer isOpen={isSettingsOpen} onClose={closeSettings} />
    </header>
  )
}
