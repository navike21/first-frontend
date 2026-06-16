import { useSessionStore } from '@/shared/model/session.store'
import { preferencesApi } from '@/shared/api/preferences'
import { SUPPORTED_LANGUAGES, type Language } from '@/shared/types/languages'
import type { UserPreferences } from '@/shared/types'
import type { BrandColor } from '@/shared/model/theme.store'

/**
 * The backend stores `primaryColor` as hex `#RRGGBB`, but the front uses a named
 * palette. This map round-trips between the two losslessly (exact-match both
 * ways). Type-only import of `BrandColor` keeps this module free of a runtime
 * dependency on the theme store (which imports `queuePreferenceSave` from here).
 */
const BRAND_COLOR_HEX: Record<BrandColor, string> = {
  teal: '#0081a2',
  sky: '#0ea5e9',
  cyan: '#06b6d4',
  indigo: '#4f46e5',
  violet: '#8b5cf6',
  pink: '#ec4899',
  rose: '#f43f5e',
  orange: '#f97316',
  amber: '#fbbf24',
  emerald: '#10b981',
}

export const brandColorToHex = (color: BrandColor): string =>
  BRAND_COLOR_HEX[color]

export const hexToBrandColor = (hex: string): BrandColor | undefined => {
  const lower = hex.toLowerCase()
  return (Object.keys(BRAND_COLOR_HEX) as BrandColor[]).find(
    (c) => BRAND_COLOR_HEX[c].toLowerCase() === lower
  )
}

export const isSupportedLanguage = (lang: string): lang is Language =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)

const DEBOUNCE_MS = 500
let timer: ReturnType<typeof setTimeout> | null = null
let buffer: Partial<UserPreferences> = {}

/**
 * Debounced, fire-and-forget persistence of a preference change to the backend.
 * No-ops when unauthenticated (e.g. during login-screen hydration), so applying
 * preferences locally never triggers a save back. A failed sync is silent — the
 * local change already took effect.
 */
export const queuePreferenceSave = (partial: Partial<UserPreferences>): void => {
  if (!useSessionStore.getState().token) return
  buffer = { ...buffer, ...partial }
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const payload = buffer
    buffer = {}
    timer = null
    preferencesApi.update(payload).catch(() => {})
  }, DEBOUNCE_MS)
}
