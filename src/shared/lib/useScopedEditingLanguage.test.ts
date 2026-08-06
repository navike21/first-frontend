import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useScopedEditingLanguage } from './useScopedEditingLanguage'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'

describe('useScopedEditingLanguage', () => {
  it('defaults to the user language when it is in scope', () => {
    const { result } = renderHook(() =>
      useScopedEditingLanguage(SUPPORTED_LANGUAGES, 'pt')
    )
    expect(result.current.editingLanguage).toBe('pt')
    expect(result.current.defaultLanguage).toBe('pt')
  })

  it('falls back to the first scoped language when the user language is out of scope', () => {
    const { result } = renderHook(() =>
      useScopedEditingLanguage(['es', 'en'], 'pt')
    )
    expect(result.current.editingLanguage).toBe('es')
    expect(result.current.defaultLanguage).toBe('es')
  })

  it('lets the caller change the editing tab freely within scope', () => {
    // Stable array reference across re-renders, matching how a real caller
    // (useContentLanguages()) behaves — a fresh array literal every render
    // would (correctly) be treated as a new scope on every pass.
    const languages: readonly Language[] = ['es', 'en', 'de']
    const { result } = renderHook(() =>
      useScopedEditingLanguage(languages, 'es')
    )
    act(() => result.current.setEditingLanguage('de'))
    expect(result.current.editingLanguage).toBe('de')
  })

  it('corrects the editing tab if the scope narrows to exclude it, on the next render', () => {
    const { result, rerender } = renderHook<
      ScopedResult,
      { languages: readonly Language[] }
    >(({ languages }) => useScopedEditingLanguage(languages, 'pt'), {
      initialProps: { languages: SUPPORTED_LANGUAGES },
    })
    act(() => result.current.setEditingLanguage('pt'))
    expect(result.current.editingLanguage).toBe('pt')

    rerender({ languages: ['es', 'en'] })
    expect(result.current.editingLanguage).toBe('es')
  })

  it('leaves the editing tab untouched when the scope narrows but still includes it', () => {
    const { result, rerender } = renderHook<
      ScopedResult,
      { languages: readonly Language[] }
    >(({ languages }) => useScopedEditingLanguage(languages, 'es'), {
      initialProps: { languages: SUPPORTED_LANGUAGES },
    })
    act(() => result.current.setEditingLanguage('en'))

    rerender({ languages: ['es', 'en'] })
    expect(result.current.editingLanguage).toBe('en')
  })
})

type ScopedResult = ReturnType<typeof useScopedEditingLanguage>
