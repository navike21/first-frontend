import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSidebar } from './Sidebar.hooks'
import { useSidebarStore } from '../model/store'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouterState: () => ({ location: { pathname: '/es' } }),
  }
})

vi.mock('../model/menu.config', () => ({
  getMenuConfig: () => [
    { id: 'dashboard', label: 'Dashboard', icon: 'RiDashboard2Line', href: '/es', exact: true },
    { id: 'users', label: 'Usuarios', icon: 'RiGroupLine', href: '/es/usuarios' },
  ],
}))

describe('useSidebar', () => {
  beforeEach(() => {
    useSidebarStore.setState({ isCollapsed: false, isOpenMobile: false })
  })

  it('returns isCollapsed from store', () => {
    useSidebarStore.setState({ isCollapsed: true })
    const { result } = renderHook(() => useSidebar())
    expect(result.current.isCollapsed).toBe(true)
  })

  it('returns isOpenMobile from store', () => {
    useSidebarStore.setState({ isOpenMobile: true })
    const { result } = renderHook(() => useSidebar())
    expect(result.current.isOpenMobile).toBe(true)
  })

  it('returns pathname', () => {
    const { result } = renderHook(() => useSidebar())
    expect(result.current.pathname).toBe('/es')
  })

  it('returns menuConfig', () => {
    const { result } = renderHook(() => useSidebar())
    expect(result.current.menuConfig).toHaveLength(2)
  })

  it('initializes openMenuId based on active route', () => {
    const { result } = renderHook(() => useSidebar())
    // '/' matches dashboard (exact: true, href: '/es')
    expect(result.current.openMenuId).toBe('dashboard')
  })

  it('handleToggle opens a closed menu', () => {
    const { result } = renderHook(() => useSidebar())
    act(() => {
      result.current.handleToggle('users')()
    })
    expect(result.current.openMenuId).toBe('users')
  })

  it('handleToggle closes an already-open menu', () => {
    const { result } = renderHook(() => useSidebar())
    act(() => {
      result.current.handleToggle('dashboard')()
    })
    expect(result.current.openMenuId).toBeNull()
  })

  it('handleToggle toggles between menus', () => {
    const { result } = renderHook(() => useSidebar())
    act(() => {
      result.current.handleToggle('users')()
    })
    expect(result.current.openMenuId).toBe('users')
    act(() => {
      result.current.handleToggle('dashboard')()
    })
    expect(result.current.openMenuId).toBe('dashboard')
  })
})
