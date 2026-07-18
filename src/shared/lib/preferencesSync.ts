import { useSessionStore } from '@/shared/model/session.store'
import { preferencesApi } from '@/shared/api/preferences'
import { SUPPORTED_LANGUAGES, type Language } from '@/shared/types/languages'
import type { UserPreferences } from '@/shared/types'

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
export const queuePreferenceSave = (
  partial: Partial<UserPreferences>
): void => {
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
