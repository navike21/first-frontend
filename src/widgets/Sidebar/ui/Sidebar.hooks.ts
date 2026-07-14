import { useCallback, useMemo, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useSidebarStore } from '../model/store'
import { getMenuConfig } from '../model/menu.config'
import { useLanguageStore, useSessionStore } from '@/shared/model'
import { hasPermission } from '@/shared/lib/permissions'

const EMPTY_PERMISSIONS: string[] = []

export function useSidebar() {
  const { isCollapsed, isOpenMobile, closeMobileSidebar } = useSidebarStore()
  const { location } = useRouterState()
  const pathname = location.pathname
  const language = useLanguageStore((s) => s.language)
  const permissions = useSessionStore(
    (s) => s.user?.permissions ?? EMPTY_PERMISSIONS
  )

  // Permission-aware menu: hide items the user can't access and drop parent
  // groups left with no visible children. Mirrors the route guards so the menu
  // never offers a destination that would just redirect to /403.
  const menuConfig = useMemo(() => {
    const allowed = (perms?: readonly string[]) =>
      !perms || perms.length === 0 || hasPermission(permissions, ...perms)
    return getMenuConfig(language)
      .map((item) =>
        item.children
          ? {
              ...item,
              children: item.children.filter((c) => allowed(c.permissions)),
            }
          : item
      )
      .filter((item) =>
        item.children ? item.children.length > 0 : allowed(item.permissions)
      )
  }, [language, permissions])

  const activeGroupId = useMemo(() => {
    const matches = (href?: string, exact?: boolean) => {
      if (!href) return false
      if (exact) return pathname === href
      return pathname === href || pathname.startsWith(href + '/')
    }
    return (
      menuConfig.find(
        (item) =>
          matches(item.href, item.exact) ||
          (item.children?.some((child) => matches(child.href)) ?? false)
      )?.id ?? null
    )
  }, [pathname, menuConfig])

  const [openMenuId, setOpenMenuId] = useState<string | null>(activeGroupId)

  // Adjust state during render (React's recommended alternative to an effect
  // for "reset internal state when a derived value changes") — avoids the
  // extra effect-triggered render pass.
  const [prevActiveGroupId, setPrevActiveGroupId] = useState(activeGroupId)
  if (activeGroupId !== prevActiveGroupId) {
    setPrevActiveGroupId(activeGroupId)
    setOpenMenuId(activeGroupId)
  }

  const handleToggle = useCallback(
    (id: string) => () => {
      setOpenMenuId((prev) => (prev === id ? null : id))
    },
    []
  )

  return {
    isCollapsed,
    isOpenMobile,
    closeMobileSidebar,
    pathname,
    menuConfig,
    openMenuId,
    handleToggle,
  }
}
