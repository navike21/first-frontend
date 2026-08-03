import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
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

import { useTranslationSuggestion } from './useTranslationSuggestion'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

beforeEach(() => {
  suggestTranslationMock.mockReset()
})

describe('useTranslationSuggestion', () => {
  it('should return initial state', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslationSuggestion<Fields>('services'), {
      wrapper,
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('should forward the fixed domain along with the call-supplied params', async () => {
    const response: SuggestTranslationResult<Fields> = {
      targetLanguage: 'de',
      fields: { name: 'Name', shortDescription: 'Kurz', description: '<p>Text</p>' },
    }
    suggestTranslationMock.mockResolvedValueOnce(response)
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslationSuggestion<Fields>('services'), {
      wrapper,
    })

    act(() => {
      result.current.mutate({
        sourceLanguage: 'en',
        targetLanguage: 'de',
        fields: { name: 'Name', shortDescription: 'Short', description: '<p>Text</p>' },
      })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(suggestTranslationMock).toHaveBeenCalledWith({
      domain: 'services',
      sourceLanguage: 'en',
      targetLanguage: 'de',
      fields: { name: 'Name', shortDescription: 'Short', description: '<p>Text</p>' },
    })
    expect(result.current.data).toEqual(response)
  })

  it('should not touch the domain when the caller changes source/target languages', async () => {
    suggestTranslationMock.mockResolvedValueOnce({
      targetLanguage: 'fr',
      fields: { name: 'Nom', shortDescription: 'Court', description: '<p>Texte</p>' },
    })
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslationSuggestion<Fields>('services'), {
      wrapper,
    })

    act(() => {
      result.current.mutate({
        sourceLanguage: 'pt',
        targetLanguage: 'fr',
        fields: { name: 'Nome', shortDescription: 'Curta', description: '<p>Texto</p>' },
      })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(suggestTranslationMock).toHaveBeenCalledWith(
      expect.objectContaining({ domain: 'services', sourceLanguage: 'pt', targetLanguage: 'fr' })
    )
  })

  it('should surface a rejection via isError without throwing', async () => {
    suggestTranslationMock.mockRejectedValueOnce(new Error('Provider unavailable'))
    const wrapper = createWrapper()
    const { result } = renderHook(() => useTranslationSuggestion<Fields>('services'), {
      wrapper,
    })

    act(() => {
      result.current.mutate({
        sourceLanguage: 'en',
        targetLanguage: 'de',
        fields: { name: 'Name', shortDescription: 'Short', description: '<p>Text</p>' },
      })
    })
    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
  })
})
