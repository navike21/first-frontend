import { useCallback, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useSidebarStore } from '../../Sidebar/model/store'
import { useSessionStore } from '@/shared/model'

export const useHeader = () => {
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useSidebarStore()
  const user = useSessionStore((state) => state.user)
  const clearSession = useSessionStore((state) => state.clearSession)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const toggleProfile = useCallback(() => {
    setIsProfileOpen((prev) => !prev)
  }, [])

  const closeProfile = useCallback(() => {
    setIsProfileOpen(false)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setIsProfileOpen(false)
    router.navigate({ to: '/login' }).catch(() => null)
  }, [clearSession, router])

  return {
    user,
    isCollapsed,
    isProfileOpen,
    toggleProfile,
    closeProfile,
    logout,
    toggleSidebar,
    toggleMobileSidebar,
  }
}
