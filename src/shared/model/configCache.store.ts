import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { ConfigData } from '@/shared/api/config'

const CACHE_KEY = '_first_config_cache'
const TTL_MS = 24 * 60 * 60 * 1000

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* unavailable */
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* unavailable */
    }
  },
}

interface CacheEntry {
  data: ConfigData
  fetchedAt: number
}

interface ConfigCacheState {
  cache: Record<string, CacheEntry>
  set: (lang: string, data: ConfigData) => void
  isValid: (lang: string) => boolean
  /** Clears one language entry (or the whole cache if no lang given). */
  invalidate: (lang?: string) => void
}

export const useConfigCacheStore = create<ConfigCacheState>()(
  devtools(
    persist(
      (set, get) => ({
        cache: {},

        set: (lang, data) =>
          set(
            (s) => ({
              cache: { ...s.cache, [lang]: { data, fetchedAt: Date.now() } },
            }),
            false,
            'configCache/set'
          ),

        isValid: (lang) => {
          const entry = get().cache[lang]
          return !!entry && Date.now() - entry.fetchedAt < TTL_MS
        },

        invalidate: (lang) =>
          set(
            (s) => {
              if (!lang) return { cache: {} }
              const { [lang]: _, ...rest } = s.cache
              return { cache: rest }
            },
            false,
            'configCache/invalidate'
          ),
      }),
      {
        name: CACHE_KEY,
        storage: createJSONStorage(() => safeLocalStorage),
      }
    ),
    { name: 'ConfigCacheStore' }
  )
)
