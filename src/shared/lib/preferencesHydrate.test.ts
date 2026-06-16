import { describe, it, expect, vi, beforeEach } from 'vitest'

const hydrateTheme = vi.fn()
const hydrateColor = vi.fn()
const hydrateLanguage = vi.fn()

vi.mock('@/shared/model/theme.store', () => ({
  useThemeStore: { getState: () => ({ hydrateTheme, hydrateColor }) },
}))
vi.mock('@/shared/model/language.store', () => ({
  useLanguageStore: { getState: () => ({ hydrateLanguage }) },
}))

import { hydratePreferences } from './preferencesHydrate'

describe('hydratePreferences', () => {
  beforeEach(() => {
    hydrateTheme.mockClear()
    hydrateColor.mockClear()
    hydrateLanguage.mockClear()
  })

  it('no-ops when preferences are undefined', () => {
    hydratePreferences(undefined)
    expect(hydrateTheme).not.toHaveBeenCalled()
    expect(hydrateColor).not.toHaveBeenCalled()
    expect(hydrateLanguage).not.toHaveBeenCalled()
  })

  it('applies a concrete theme directly', () => {
    hydratePreferences({ theme: 'light' })
    expect(hydrateTheme).toHaveBeenCalledWith('light')
  })

  it('resolves `system` theme to the OS preference', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    hydratePreferences({ theme: 'system' })
    expect(hydrateTheme).toHaveBeenCalledWith('dark')
    vi.unstubAllGlobals()
  })

  it('maps a known hex color and ignores an unknown one', () => {
    hydratePreferences({ primaryColor: '#0081a2' })
    expect(hydrateColor).toHaveBeenCalledWith('teal')

    hydrateColor.mockClear()
    hydratePreferences({ primaryColor: '#ffffff' })
    expect(hydrateColor).not.toHaveBeenCalled()
  })

  it('applies a supported language and ignores an unsupported one', () => {
    hydratePreferences({ language: 'en' })
    expect(hydrateLanguage).toHaveBeenCalledWith('en')

    hydrateLanguage.mockClear()
    hydratePreferences({ language: 'xx' })
    expect(hydrateLanguage).not.toHaveBeenCalled()
  })
})
