import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useThemeStore, useTheme, useToggleTheme } from './theme.store'

const mockStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value
    },
    removeItem: (key: string): void => {
      delete store[key]
    },
    clear: (): void => {
      store = {}
    },
  }
})()

vi.stubGlobal('localStorage', mockStorage)

describe('useThemeStore', () => {
  beforeEach(() => {
    mockStorage.clear()
    useThemeStore.setState({ theme: 'light' })
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('detectSystemTheme', () => {
    it('returns dark theme when window.matchMedia says dark', async () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: true,
          media: '(prefers-color-scheme: dark)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
          onchange: null,
        }),
      })
      // Clear storage so persist does not override detectSystemTheme with stored 'light'
      mockStorage.clear()
      vi.resetModules()
      const { useThemeStore: freshStore } = await import('./theme.store')
      expect(freshStore.getState().theme).toBe('dark')
    })
  })

  describe('onRehydrateStorage', () => {
    it('applies theme when stored state is restored', () => {
      useThemeStore.getState().setTheme('dark')
      document.documentElement.classList.remove('dark')
      useThemeStore.persist.rehydrate()
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('does nothing when stored state is null (invalid JSON in storage)', () => {
      vi.spyOn(mockStorage, 'getItem').mockReturnValueOnce('not-valid-json')
      expect(() => useThemeStore.persist.rehydrate()).not.toThrow()
    })
  })

  describe('setTheme', () => {
    it('sets theme to dark and adds dark class to documentElement', () => {
      useThemeStore.getState().setTheme('dark')
      expect(useThemeStore.getState().theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('sets theme to light and removes dark class', () => {
      document.documentElement.classList.add('dark')
      useThemeStore.getState().setTheme('light')
      expect(useThemeStore.getState().theme).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      useThemeStore.setState({ theme: 'light' })
      useThemeStore.getState().toggleTheme()
      expect(useThemeStore.getState().theme).toBe('dark')
    })

    it('toggles from dark to light', () => {
      useThemeStore.setState({ theme: 'dark' })
      useThemeStore.getState().toggleTheme()
      expect(useThemeStore.getState().theme).toBe('light')
    })
  })

  describe('safeLocalStorage error handling', () => {
    it('does not throw when localStorage.setItem fails', () => {
      vi.spyOn(mockStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('storage full')
      })
      expect(() => useThemeStore.getState().setTheme('dark')).not.toThrow()
    })

    it('does not throw when localStorage.removeItem fails', () => {
      vi.spyOn(mockStorage, 'removeItem').mockImplementationOnce(() => {
        throw new Error('storage unavailable')
      })
      expect(() => useThemeStore.persist.clearStorage()).not.toThrow()
    })

    it('does not throw when localStorage.getItem fails during rehydrate', () => {
      vi.spyOn(mockStorage, 'getItem').mockImplementationOnce(() => {
        throw new Error('storage unavailable')
      })
      expect(() => useThemeStore.persist.rehydrate()).not.toThrow()
    })
  })

  describe('selector hooks', () => {
    it('useTheme returns current theme', () => {
      useThemeStore.setState({ theme: 'dark' })
      const { result } = renderHook(() => useTheme())
      expect(result.current).toBe('dark')
    })

    it('useToggleTheme returns the toggleTheme function', () => {
      useThemeStore.setState({ theme: 'light' })
      const { result } = renderHook(() => useToggleTheme())
      result.current()
      expect(useThemeStore.getState().theme).toBe('dark')
    })
  })
})
