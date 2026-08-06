import { useState } from 'react'
import type { Language } from '@/shared/i18n'

export interface ScopedEditingLanguage {
  editingLanguage: Language
  setEditingLanguage: (lang: Language) => void
  /** The language to treat as "required"/primary for validation — the
   * editor's own UI language if this business's content scope actually
   * includes it, otherwise the first language in scope. Never a language
   * that isn't even a visible tab. */
  defaultLanguage: Language
}

/**
 * Owns the "currently editing" language tab for a content form, scoped to
 * the business's configured content-language set (see
 * `useContentLanguages()` in the `site-config` domain) rather than always
 * every language First's own UI supports.
 *
 * `languages` loads asynchronously and can narrow after mount (it starts as
 * every supported language while the real site-config is still loading) —
 * if the tab currently being edited drops out of it once the real scope
 * arrives, this falls back to the first one still in scope. Adjusted during
 * render (not an effect) per React's own guidance for "reset state when a
 * prop changes", so it never leaves a hidden tab "selected" and never causes
 * an extra cascading render.
 *
 * `languages` must be referentially stable across renders unless the scope
 * actually changed (true of `useContentLanguages()`'s return value) — a
 * caller re-creating the array on every render would make this loop forever.
 */
export function useScopedEditingLanguage(
  languages: readonly Language[],
  userLanguage: Language
): ScopedEditingLanguage {
  const defaultLanguage = languages.includes(userLanguage)
    ? userLanguage
    : languages[0]
  const [editingLanguageState, setEditingLanguage] =
    useState<Language>(defaultLanguage)

  const [prevLanguages, setPrevLanguages] = useState(languages)
  let editingLanguage = editingLanguageState
  if (languages !== prevLanguages) {
    setPrevLanguages(languages)
    if (!languages.includes(editingLanguageState)) {
      editingLanguage = languages[0]
      setEditingLanguage(languages[0])
    }
  }

  return { editingLanguage, setEditingLanguage, defaultLanguage }
}
