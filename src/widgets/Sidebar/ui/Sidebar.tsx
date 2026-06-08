import { Link } from '@tanstack/react-router'
import { IconComponent, Accordion, AppLogo, Drawer, NavItem } from '@/shared/ui'
import clsx from 'clsx'
import { useSidebar } from './Sidebar.hooks'

const TitleNode = (
  <div className="flex items-center gap-2">
    <AppLogo size="x-small" color="default" />
    <span className="font-bold text-(--text-primary)">Menú</span>
  </div>
)

export const Sidebar = () => {
  const {
    isCollapsed,
    isOpenMobile,
    closeMobileSidebar,
    pathname,
    menuConfig,
    openMenuId,
    handleToggle,
  } = useSidebar()

  return (
    <Drawer
      isOpen={isOpenMobile}
      onClose={closeMobileSidebar}
      placement="left"
      title={TitleNode}
      isMobileOnly
      className={clsx(
        {
          'md:w-20': isCollapsed,
          'md:w-64': !isCollapsed,
        },
        'w-64'
      )}
    >
      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuConfig.map((item) => {
          const isItemActive = item.href
            ? item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/')
            : false

          if (isCollapsed && !isOpenMobile) {
            return (
              <div key={item.id} className="w-full">
                <Link
                  to={item.href ?? '/'}
                  title={item.label}
                  className={clsx(
                    'mb-2 hidden items-center justify-center p-3 md:flex',
                    'rounded-lg',
                    'duration-fast ease-out-expo transition-colors',
                    !isItemActive &&
                      'hover:bg-(--color-primary-950)/20 hover:text-white',
                    isItemActive
                      ? 'bg-(--color-primary-950)/40 text-white'
                      : 'text-(--text-secondary)'
                  )}
                >
                  <IconComponent icon={item.icon} className="h-6 w-6" />
                </Link>
              </div>
            )
          }

          if (item.children) {
            return (
              <div key={item.id} className="w-full">
                <Accordion
                  title={item.label}
                  icon={
                    <IconComponent
                      icon={item.icon}
                      className={clsx(
                        'h-5 w-5',
                        isItemActive
                          ? 'text-(--color-primary-300)'
                          : 'text-(--text-secondary)'
                      )}
                    />
                  }
                  isOpen={openMenuId === item.id}
                  onToggle={handleToggle(item.id)}
                >
                  <div className="ml-5 space-y-1 border-l border-(--border) pl-4">
                    {item.children.map((child) => {
                      const isChildActive =
                        pathname === child.href ||
                        pathname.startsWith(child.href + '/')
                      return (
                        <Link
                          key={child.id}
                          to={child.href}
                          onClick={closeMobileSidebar}
                          className={clsx(
                            'block px-2 py-1.5',
                            'rounded-md text-sm font-medium',
                            'transition-colors',
                            !isChildActive &&
                              'hover:bg-(--color-primary-950)/20 hover:text-white',
                            isChildActive
                              ? 'bg-(--color-primary-950)/30 font-semibold text-white'
                              : 'text-(--text-secondary)'
                          )}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                </Accordion>
              </div>
            )
          }

          return (
            <div key={item.id} className="w-full">
              <NavItem
                icon={item.icon}
                label={item.label}
                to={item.href ?? '/'}
                isActive={!!isItemActive}
                onClick={closeMobileSidebar}
                className="mb-2"
              />
            </div>
          )
        })}
      </nav>
    </Drawer>
  )
}
