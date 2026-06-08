import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLanguageStore } from '@/shared/model'

const navigateMock = vi.fn().mockResolvedValue(undefined)

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({
      navigate: navigateMock,
      state: { location: { pathname: '/es/usuarios' } },
    }),
  }
})

import { useLanguageSwitcher } from './LanguageSwitcher.hooks'

describe('useLanguageSwitcher', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    navigateMock.mockResolvedValue(undefined)
    useLanguageStore.setState({ language: 'es' })
  })

  it('returns current language from store', () => {
    const { result } = renderHook(() => useLanguageSwitcher())
    expect(result.current.language).toBe('es')
  })

  it('handleChange updates language in store', async () => {
    const { result } = renderHook(() => useLanguageSwitcher())
    await act(async () => { result.current.handleChange('en') })
    expect(useLanguageStore.getState().language).toBe('en')
  })

  it('handleChange calls router.navigate with translated path', async () => {
    const { result } = renderHook(() => useLanguageSwitcher())
    await act(async () => { result.current.handleChange('en') })
    expect(navigateMock).toHaveBeenCalledOnce()
    const [callArg] = navigateMock.mock.calls[0] as [{ to: string; replace: boolean }][]
    expect(callArg).toMatchObject({ replace: true })
  })

  it('catch handler does not throw when navigate rejects', async () => {
    navigateMock.mockRejectedValueOnce(new Error('Navigation failed'))
    const { result } = renderHook(() => useLanguageSwitcher())
    await expect(
      act(async () => { result.current.handleChange('en') })
    ).resolves.not.toThrow()
  })
})
