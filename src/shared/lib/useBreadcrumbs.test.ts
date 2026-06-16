import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLanguageStore } from '@/shared/model'
import { useBreadcrumbs } from './useBreadcrumbs'

const { useRouterStateMock } = vi.hoisted(() => ({
  useRouterStateMock: vi.fn(() => ({ location: { pathname: '/es' } })),
}))

vi.mock('@tanstack/react-router', () => ({
  useRouterState: useRouterStateMock,
}))

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'es' })
    useRouterStateMock.mockReturnValue({ location: { pathname: '/es' } })
  })

  it('returns only home item when at root path', () => {
    const { result } = renderHook(() => useBreadcrumbs())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].label).toBe('Inicio')
    expect(result.current[0].icon).toBe('RiHomeLine')
  })

  it('returns home + users when at /es/usuarios', () => {
    useRouterStateMock.mockReturnValue({
      location: { pathname: '/es/usuarios' },
    })
    const { result } = renderHook(() => useBreadcrumbs())
    expect(result.current).toHaveLength(2)
    expect(result.current[0].label).toBe('Inicio')
    expect(result.current[1].label).toBe('Usuarios')
  })

  it('returns home + users (as link) + new (as current) for create path', () => {
    useRouterStateMock.mockReturnValue({
      location: { pathname: '/es/usuarios/nuevo' },
    })
    const { result } = renderHook(() => useBreadcrumbs())
    expect(result.current).toHaveLength(3)
    expect(result.current[1].href).toBe('/es/usuarios')
    expect(result.current[2].href).toBeUndefined()
  })

  it('skips ID segments (24-char hex)', () => {
    useRouterStateMock.mockReturnValue({
      location: { pathname: '/es/usuarios/507f1f77bcf86cd799439011/editar' },
    })
    const { result } = renderHook(() => useBreadcrumbs())
    expect(
      result.current.some((i) => i.label === '507f1f77bcf86cd799439011')
    ).toBe(false)
  })

  it('skips UUID segments', () => {
    useRouterStateMock.mockReturnValue({
      location: {
        pathname: '/es/usuarios/123e4567-e89b-12d3-a456-426614174000/editar',
      },
    })
    const { result } = renderHook(() => useBreadcrumbs())
    expect(result.current.some((i) => i.label.includes('123e4567'))).toBe(false)
  })

  it('uses English labels when language is en', () => {
    useLanguageStore.setState({ language: 'en' })
    useRouterStateMock.mockReturnValue({ location: { pathname: '/en' } })
    const { result } = renderHook(() => useBreadcrumbs())
    expect(result.current[0].label).toBe('Home')
  })
})
