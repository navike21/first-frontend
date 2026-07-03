import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import type { ConfigData } from '@/shared/api/config'

const CACHE_KEY = '_first_config_cache'
export const CONFIG_CACHE_TTL_MS = 24 * 60 * 60 * 1000

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

export interface CacheEntry {
  data: Partial<ConfigData>
  fetchedAt: number
}

interface ConfigCacheState {
  cache: Record<string, CacheEntry>
  /** Merges partial config data into the entry for lang, resetting its TTL. */
  merge: (lang: string, data: Partial<ConfigData>) => void
  /** Clears one language entry (or the whole cache if no lang given). */
  invalidate: (lang?: string) => void
}

export const useConfigCacheStore = create<ConfigCacheState>()(
  devtools(
    persist(
      (set) => ({
        cache: {},

        merge: (lang, data) =>
          set(
            (s) => {
              const existing = s.cache[lang]
              return {
                cache: {
                  ...s.cache,
                  [lang]: {
                    data: { ...(existing?.data ?? {}), ...data },
                    fetchedAt: Date.now(),
                  },
                },
              }
            },
            false,
            'configCache/merge'
          ),

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
