import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLanguageStore } from '@/shared/model/language.store'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import type {
  SuggestTranslationParams,
  SuggestTranslationResult,
} from '@/shared/api/translationAssist.api'

type Fields = { name: string; shortDescription: string; description: string }

const { suggestTranslationMock } = vi.hoisted(() => ({
  suggestTranslationMock:
    vi.fn<
      (
        params: SuggestTranslationParams<Fields>
      ) => Promise<SuggestTranslationResult<Fields>>
    >(),
}))

vi.mock('@/shared/api/translationAssist.api', () => ({
  suggestTranslation: suggestTranslationMock,
}))

const { notifyInfoMock, notifyQueryErrorMock } = vi.hoisted(() => ({
  notifyInfoMock: vi.fn(),
  notifyQueryErrorMock: vi.fn(),
}))

vi.mock('@/shared/lib/notify', () => ({
  notify: { info: notifyInfoMock, queryError: notifyQueryErrorMock },
}))

import { ServiceForm } from './ServiceForm'
import type { ServiceFormData } from '../../model/service.schema'

const emptyLocalized = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((l) => [l, ''])
) as Record<Language, string>

const localized = (overrides: Partial<Record<Language, string>>) => ({
  ...emptyLocalized,
  ...overrides,
})

const renderForm = (initialValues?: Partial<ServiceFormData>) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ServiceForm
        mode="create"
        isSubmitting={false}
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        initialValues={initialValues}
      />
    </QueryClientProvider>
  )
}

/** Both LangTabs (mobile) and LangSidebar (desktop) render simultaneously in
 * jsdom (Tailwind's `lg:hidden`/`hidden lg:block` only affects CSS, not the
 * DOM) — so the translate button, when present, always appears twice. */
const queryTranslateButtons = (label: string) =>
  screen.queryAllByRole('button', { name: label })

const switchToTab = (langCode: string) => {
  fireEvent.click(screen.getByRole('button', { name: langCode }))
}

beforeEach(() => {
  suggestTranslationMock.mockReset()
  notifyInfoMock.mockReset()
  notifyQueryErrorMock.mockReset()
})

describe('ServiceForm — AI translation suggestion', () => {
  it('does not render the button while viewing the source language’s own tab', () => {
    useLanguageStore.setState({ language: 'en' })
    renderForm({ name: localized({ en: 'Marketing Service' }) })

    expect(queryTranslateButtons('Suggest translation')).toHaveLength(0)
  })

  it('does not render the button when the source language has no content yet', () => {
    useLanguageStore.setState({ language: 'en' })
    renderForm()

    switchToTab('de')

    expect(queryTranslateButtons('Suggest translation')).toHaveLength(0)
  })

  it('renders the button once the source language has content and a different tab is active', () => {
    useLanguageStore.setState({ language: 'en' })
    renderForm({
      name: localized({ en: 'Marketing Service' }),
      shortDescription: localized({ en: 'Short desc' }),
    })

    switchToTab('de')

    expect(queryTranslateButtons('Suggest translation').length).toBeGreaterThan(0)
  })

  it('uses the editor’s own current UI language as the source, not a fixed one (Portuguese case)', () => {
    useLanguageStore.setState({ language: 'pt' })
    renderForm({
      name: localized({ pt: 'Serviço de Marketing' }),
      shortDescription: localized({ pt: 'Descrição curta' }),
    })

    switchToTab('en')

    // Label renders in the interface language (pt), proving it is not
    // hardcoded to English/Spanish.
    expect(queryTranslateButtons('Sugerir tradução').length).toBeGreaterThan(0)
  })

  it('sends sourceLanguage=userLanguage / targetLanguage=editingLanguage and the fields from the source language, never a fixed language', async () => {
    useLanguageStore.setState({ language: 'pt' })
    renderForm({
      name: localized({ pt: 'Serviço de Marketing', en: 'stale english copy' }),
      shortDescription: localized({ pt: 'Descrição curta' }),
    })
    switchToTab('en')
    suggestTranslationMock.mockResolvedValueOnce({
      targetLanguage: 'en',
      fields: {
        name: 'Marketing Service',
        shortDescription: 'Short desc',
        description: '',
      },
    })

    fireEvent.click(queryTranslateButtons('Sugerir tradução')[0])

    await waitFor(() => expect(suggestTranslationMock).toHaveBeenCalledTimes(1))
    // `description` is intentionally not asserted here — RichTextArea (TipTap)
    // canonicalizes an empty value to `<p></p>` as a side effect of mounting,
    // unrelated to the translation-suggestion wiring under test.
    expect(suggestTranslationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'services',
        sourceLanguage: 'pt',
        targetLanguage: 'en',
        fields: expect.objectContaining({
          name: 'Serviço de Marketing',
          shortDescription: 'Descrição curta',
        }),
      })
    )
  })

  it('applies a successful suggestion to the currently edited tab and shows an info toast', async () => {
    useLanguageStore.setState({ language: 'en' })
    const { container } = renderForm({
      name: localized({ en: 'Marketing Service' }),
      shortDescription: localized({ en: 'Short desc' }),
    })
    switchToTab('de')
    suggestTranslationMock.mockResolvedValueOnce({
      targetLanguage: 'de',
      fields: {
        name: 'Marketing-Dienst',
        shortDescription: 'Kurze Beschreibung',
        description: '',
      },
    })

    fireEvent.click(queryTranslateButtons('Suggest translation')[0])

    await waitFor(() => expect(notifyInfoMock).toHaveBeenCalledTimes(1))
    const nameInput = container.querySelector<HTMLInputElement>(
      'input[name="name.de"]'
    )
    const sdInput = container.querySelector<HTMLInputElement>(
      'input[name="shortDescription.de"]'
    )
    expect(nameInput?.value).toBe('Marketing-Dienst')
    expect(sdInput?.value).toBe('Kurze Beschreibung')
  })

  it('leaves the fields untouched and shows an error toast when the suggestion fails', async () => {
    useLanguageStore.setState({ language: 'en' })
    const { container } = renderForm({
      name: localized({ en: 'Marketing Service' }),
      shortDescription: localized({ en: 'Short desc' }),
    })
    switchToTab('de')
    const failure = new Error('Provider unavailable')
    suggestTranslationMock.mockRejectedValueOnce(failure)

    fireEvent.click(queryTranslateButtons('Suggest translation')[0])

    await waitFor(() => expect(notifyQueryErrorMock).toHaveBeenCalledTimes(1))
    expect(notifyQueryErrorMock).toHaveBeenCalledWith(failure)
    expect(notifyInfoMock).not.toHaveBeenCalled()
    const nameInput = container.querySelector<HTMLInputElement>(
      'input[name="name.de"]'
    )
    expect(nameInput?.value ?? '').toBe('')
  })
})
