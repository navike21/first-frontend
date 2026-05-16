import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  isOpenMobile: boolean
  closeMobileSidebar: () => void
  setCollapsed: (isCollapsed: boolean) => void
  toggleMobileSidebar: () => void
  toggleSidebar: () => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    (set) => ({
      isCollapsed: false,
      isOpenMobile: false,

      closeMobileSidebar: () =>
        set({ isOpenMobile: false }, false, 'sidebar/closeMobileSidebar'),

      setCollapsed: (isCollapsed) =>
        set({ isCollapsed }, false, 'sidebar/setCollapsed'),

      toggleMobileSidebar: () =>
        set(
          (state) => ({ isOpenMobile: !state.isOpenMobile }),
          false,
          'sidebar/toggleMobileSidebar'
        ),

      toggleSidebar: () =>
        set(
          (state) => ({ isCollapsed: !state.isCollapsed }),
          false,
          'sidebar/toggleSidebar'
        ),
    }),
    { name: 'SidebarStore' }
  )
)
