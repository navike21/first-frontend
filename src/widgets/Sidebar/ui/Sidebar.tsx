import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  IconComponent,
  Accordion,
  AppLogo,
  Drawer,
  NavItem,
} from '@/shared/ui'
import clsx from 'clsx'
import { useSidebarStore } from '../model/store'
import { menuConfig } from '../model/menu.config'

export const Sidebar = () => {
  const { isCollapsed, isOpenMobile, closeMobileSidebar } = useSidebarStore()
  const { location } = useRouterState()
  const pathname = location.pathname

  const activeGroupId = useMemo(
    () =>
      menuConfig.find(
        item => item.href && item.href !== '/' && pathname.startsWith(item.href)
      )?.id ?? null,
    [pathname]
  )

  const [openMenuId, setOpenMenuId] = useState<string | null>(activeGroupId)

  useEffect(() => {
    setOpenMenuId(activeGroupId)
  }, [activeGroupId])

  const handleToggle = useCallback(
    (id: string) => () => {
      setOpenMenuId(prev => (prev === id ? null : id))
    },
    []
  )

  const TitleNode = (
    <div className="flex items-center gap-2">
      <AppLogo size="x-small" color="default" />
      <span className="font-bold text-slate-800">Menú</span>
    </div>
  )

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
        {menuConfig.map(item => {
          const isItemActive =
            item.href && item.href !== '/'
              ? pathname.startsWith(item.href)
              : pathname === item.href

          if (isCollapsed && !isOpenMobile) {
            return (
              <div key={item.id} className="w-full">
                <div
                  title={item.label}
                  className={clsx(
                    'mb-2 hidden cursor-pointer items-center justify-center rounded-lg p-3 transition-colors duration-fast ease-out-expo md:flex',
                    isItemActive
                      ? 'bg-slate-100 text-slate-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <IconComponent icon={item.icon} className="h-6 w-6" />
                </div>
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
                        isItemActive ? 'text-slate-700' : 'text-slate-500'
                      )}
                    />
                  }
                  isOpen={openMenuId === item.id}
                  onToggle={handleToggle(item.id)}
                >
                  <div className="ml-5 space-y-1 border-l border-gray-200 pl-4">
                    {item.children.map(child => {
                      const isChildActive = pathname.startsWith(child.href)
                      return (
                        <Link
                          key={child.id}
                          to={child.href}
                          onClick={closeMobileSidebar}
                          className={clsx(
                            'block rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                            isChildActive
                              ? 'bg-slate-100 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
