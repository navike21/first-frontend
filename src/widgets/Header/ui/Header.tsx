import { AppLogo, IconComponent, Avatar, IconButton, LanguageSwitcher } from '@/shared/ui'
import { useTranslation } from '@/shared/i18n'
import clsx from 'clsx'
import { useHeader } from '../model/useHeader'
import { ProfileDrawer } from './ProfileDrawer'

export const Header = () => {
  const {
    user,
    isCollapsed,
    isProfileOpen,
    toggleProfile,
    closeProfile,
    logout,
    toggleSidebar,
    toggleMobileSidebar,
  } = useHeader()

  const { t } = useTranslation()

  return (
    <header
      className={clsx(
        'z-10 flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button
          onClick={toggleMobileSidebar}
          className={clsx(
            'cursor-pointer rounded-md p-2 text-slate-500 transition-colors duration-fast ease-out-expo',
            'hover:bg-slate-100 hover:text-slate-800 focus:outline-none',
            'md:hidden'
          )}
        >
          <IconComponent icon="RiMenuLine" className="h-5 w-5" />
        </button>

        {/* Desktop Toggle */}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'hidden cursor-pointer rounded-md p-2 text-slate-500 transition-colors duration-fast ease-out-expo',
            'hover:bg-slate-100 hover:text-slate-800 focus:outline-none',
            'md:block'
          )}
          aria-label={isCollapsed ? t.header.expandMenu : t.header.collapseMenu}
        >
          <IconComponent
            icon={isCollapsed ? 'RiMenuUnfoldLine' : 'RiMenuFoldLine'}
            className="h-5 w-5"
          />
        </button>

        <div className="flex items-center gap-3">
          <AppLogo size="x-small" color="default" />
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            First
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {/* Notifications */}
        <IconButton icon="RiNotification3Line" shape="circle" variant="text" />

        {/* Profile trigger */}
        <button
          onClick={toggleProfile}
          className="flex cursor-pointer appearance-none items-center gap-3 border-l border-gray-200 pl-4 transition-opacity outline-none hover:opacity-80"
          aria-label={t.header.userMenu}
        >
          <div className="hidden flex-col items-end md:flex">
            <span className="mb-1 text-sm leading-none font-medium text-slate-800">
              {user?.name || t.header.guestName}
            </span>
            <span className="text-xs leading-none text-slate-500">
              {user?.email || t.header.guestEmail}
            </span>
          </div>
          <Avatar
            alt={user?.name || t.header.guestName}
            size="md"
            className="bg-blue-600 font-semibold text-white"
          />
        </button>
      </div>

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={closeProfile}
        onLogout={logout}
        user={user}
      />
    </header>
  )
}
