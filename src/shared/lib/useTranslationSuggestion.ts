import { useMutation } from '@tanstack/react-query'
import {
  suggestTranslation,
  type SuggestTranslationParams,
  type TranslationDomain,
} from '@/shared/api/translationAssist.api'

/**
 * Thin `useMutation` wrapper — no domain-specific knowledge beyond the fixed
 * `domain`. Callers pass `sourceLanguage`/`targetLanguage`/`fields` per call
 * and use the returned mutation's own `onSuccess`/`onError` to apply the
 * result (e.g. via RHF `setValue`) — this hook never touches form state
 * itself, so it stays reusable across every domain that adds this feature.
 */
export function useTranslationSuggestion<TFields extends Record<string, string>>(
  domain: TranslationDomain
) {
  return useMutation({
    mutationFn: (params: Omit<SuggestTranslationParams<TFields>, 'domain'>) =>
      suggestTranslation<TFields>({ domain, ...params }),
  })
}
