import { Link } from '@tanstack/react-router'
import { IconComponent, Accordion, Drawer, NavItem } from '@/shared/ui'
import clsx from 'clsx'
import { useSidebar } from './Sidebar.hooks'

const TitleNode = (
  <div className="flex items-center gap-2">
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
          const isHrefActive = (href?: string, exact?: boolean) =>
            href
              ? exact
                ? pathname === href
                : pathname === href || pathname.startsWith(href + '/')
              : false

          const isItemActive =
            isHrefActive(item.href, item.exact) ||
            (item.children?.some((child) => isHrefActive(child.href)) ?? false)

          if (isCollapsed && !isOpenMobile) {
            // Collapsed rail: flatten groups into one icon per leaf destination.
            const leaves = item.children
              ? item.children.map((child) => ({
                  id: child.id,
                  href: child.href,
                  label: child.label,
                  icon: child.icon ?? item.icon,
                }))
              : [
                  {
                    id: item.id,
                    href: item.href ?? '/',
                    label: item.label,
                    icon: item.icon,
                  },
                ]

            return (
              <div key={item.id} className="w-full">
                {leaves.map((leaf) => {
                  const isLeafActive = isHrefActive(leaf.href)
                  return (
                    <Link
                      key={leaf.id}
                      to={leaf.href}
                      title={leaf.label}
                      className={clsx(
                        'mb-2 hidden items-center justify-center p-3 md:flex',
                        'rounded-lg',
                        'duration-fast ease-out-expo transition-colors',
                        !isLeafActive &&
                          'hover:bg-(--color-primary-700)/5 hover:text-(--color-primary-700) dark:hover:bg-(--color-primary-950)/20 dark:hover:text-white',
                        isLeafActive
                          ? 'bg-(--color-primary-700)/10 text-(--color-primary-700) dark:bg-(--color-primary-950)/40 dark:text-white'
                          : 'text-(--text-secondary)'
                      )}
                    >
                      <IconComponent icon={leaf.icon} className="h-6 w-6" />
                    </Link>
                  )
                })}
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
                            // Inactive hover — light: subtle brand tint + brand
                            // text; dark: keep the existing dark highlight.
                            !isChildActive &&
                              'hover:bg-(--color-primary-700)/5 hover:text-(--color-primary-700) dark:hover:bg-(--color-primary-950)/20 dark:hover:text-white',
                            // Active — light: light brand tint bg + brand text
                            // (follows the active color theme); dark: unchanged.
                            isChildActive
                              ? 'bg-(--color-primary-700)/10 font-semibold text-(--color-primary-700) dark:bg-(--color-primary-950)/30 dark:text-white'
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
