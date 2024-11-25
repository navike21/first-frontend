// vitest.setup.ts
import { vi } from 'vitest'

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: query === '(prefers-color-scheme: dark)', // Retorna true para la preferencia del tema oscuro
  media: query,
  addListener: vi.fn(),
  removeListener: vi.fn(),
}))
