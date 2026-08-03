import {
  HttpError,
  getCurrentLanguage,
  parseErrorBody,
} from '@/shared/api/api.services'
import { useSessionStore } from '@/shared/model'
import type { Language } from '@/shared/types/languages'

export type TranslationDomain = 'services'

export interface SuggestTranslationParams<TFields extends Record<string, string>> {
  domain: TranslationDomain
  sourceLanguage: Language
  targetLanguage: Language
  fields: TFields
}

export interface SuggestTranslationResult<TFields extends Record<string, string>> {
  targetLanguage: Language
  fields: TFields
}

/**
 * Calls the AI translation-suggestion endpoint directly with `fetch()`
 * (not the shared `request()` helper) — `request()` queues a failed non-GET
 * call for offline replay, which is wrong here: an AI suggestion isn't a
 * mutation to persist later, and silently applying a stale translation to
 * whatever the editor is doing when connectivity returns would be
 * confusing, not helpful.
 */
export async function suggestTranslation<TFields extends Record<string, string>>({
  domain,
  sourceLanguage,
  targetLanguage,
  fields,
}: SuggestTranslationParams<TFields>): Promise<SuggestTranslationResult<TFields>> {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const token = useSessionStore.getState().token
  const lang = getCurrentLanguage()

  const response = await fetch(`${baseUrl}/translation-assist/suggest`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(lang && { 'Accept-Language': lang }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ domain, sourceLanguage, targetLanguage, fields }),
  })

  if (!response.ok) {
    const apiError = await parseErrorBody(response)
    throw new HttpError(
      response.status,
      response.statusText,
      apiError.message,
      apiError.code,
      apiError.details
    )
  }

  const body = (await response.json()) as {
    data: SuggestTranslationResult<TFields>
  }
  return body.data
}
