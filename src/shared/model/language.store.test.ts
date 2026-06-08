import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLanguageStore, useLanguage } from './language.store'

const mockStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => { store[key] = value },
    removeItem: (key: string): void => { delete store[key] },
    clear: (): void => { store = {} },
  }
})()

vi.stubGlobal('localStorage', mockStorage)

describe('useLanguageStore', () => {
  beforeEach(() => {
    mockStorage.clear()
    useLanguageStore.setState({ language: 'es' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('defaults to es', () => {
      expect(useLanguageStore.getState().language).toBe('es')
    })
  })

  describe('setLanguage', () => {
    it('changes language to en', () => {
      useLanguageStore.getState().setLanguage('en')
      expect(useLanguageStore.getState().language).toBe('en')
    })

    it('changes language to fr', () => {
      useLanguageStore.getState().setLanguage('fr')
      expect(useLanguageStore.getState().language).toBe('fr')
    })

    it('changes language to de', () => {
      useLanguageStore.getState().setLanguage('de')
      expect(useLanguageStore.getState().language).toBe('de')
    })
  })

  describe('safeLocalStorage error handling', () => {
    it('does not throw when localStorage.setItem fails', () => {
      vi.spyOn(mockStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('storage unavailable')
      })
      expect(() => useLanguageStore.getState().setLanguage('en')).not.toThrow()
    })

    it('does not throw when localStorage.removeItem fails', () => {
      vi.spyOn(mockStorage, 'removeItem').mockImplementationOnce(() => {
        throw new Error('storage unavailable')
      })
      expect(() => useLanguageStore.persist.clearStorage()).not.toThrow()
    })

    it('does not throw when localStorage.getItem fails during rehydrate', () => {
      vi.spyOn(mockStorage, 'getItem').mockImplementationOnce(() => {
        throw new Error('storage unavailable')
      })
      expect(() => useLanguageStore.persist.rehydrate()).not.toThrow()
    })
  })

  describe('useLanguage hook', () => {
    it('returns the current language', () => {
      useLanguageStore.setState({ language: 'ja' })
      const { result } = renderHook(() => useLanguage())
      expect(result.current).toBe('ja')
    })

    it('reflects language changes', () => {
      const { result, rerender } = renderHook(() => useLanguage())
      useLanguageStore.setState({ language: 'ko' })
      rerender()
      expect(result.current).toBe('ko')
    })
  })
})
