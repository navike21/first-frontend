// vitest.setup.ts
import { vi } from 'vitest'

global.matchMedia = vi.fn().mockImplementation((query) => {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []

  return {
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    addEventListener: vi.fn((_, listener) => listeners.push(listener)),
    removeEventListener: vi.fn((_, listener) => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }),
    dispatchEvent: (event: MediaQueryListEvent) => {
      listeners.forEach((listener) => listener(event))
    },
  }
})
