import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useSidebarStore } from '../model/store'
import { getMenuConfig } from '../model/menu.config'
import { useLanguageStore } from '@/shared/model'

export function useSidebar() {
  const { isCollapsed, isOpenMobile, closeMobileSidebar } = useSidebarStore()
  const { location } = useRouterState()
  const pathname = location.pathname
  const language = useLanguageStore((s) => s.language)
  const menuConfig = useMemo(() => getMenuConfig(language), [language])

  const activeGroupId = useMemo(
    () =>
      menuConfig.find((item) => {
        if (!item.href) return false
        if (item.exact) return pathname === item.href
        return pathname === item.href || pathname.startsWith(item.href + '/')
      })?.id ?? null,
    [pathname, menuConfig]
  )

  const [openMenuId, setOpenMenuId] = useState<string | null>(activeGroupId)

  useEffect(() => {
    setOpenMenuId(activeGroupId)
  }, [activeGroupId])

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
