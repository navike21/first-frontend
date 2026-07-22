import { useCallback, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useSidebarStore } from '../../Sidebar/model/store'
import { useSessionStore } from '@/shared/model'
import { navPaths } from '@/shared/router'
import { useGlobalLoading } from '@/shared/lib/useGlobalLoading'

export const useHeader = () => {
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useSidebarStore()
  const user = useSessionStore((state) => state.user)
  const clearSession = useSessionStore((state) => state.clearSession)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const router = useRouter()
  const isLoading = useGlobalLoading()

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    router.navigate({ to: navPaths.login() as never }).catch(() => null)
  }, [clearSession, router])

  return {
    user,
    isCollapsed,
    isSettingsOpen,
    toggleSettings,
    closeSettings,
    logout,
    toggleSidebar,
    toggleMobileSidebar,
    isLoading,
  }
}
