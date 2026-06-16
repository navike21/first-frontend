import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLanguageStore } from '@/shared/model'

const navigateMock = vi.fn().mockResolvedValue(undefined)

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useRouter: () => ({
      navigate: navigateMock,
      state: { location: { pathname: '/es' } },
    }),
  }
})

vi.mock('@/shared/ui/molecules/Select', () => ({
  Select: ({
    value,
    onChange,
    label,
  }: {
    value: string
    onChange: (e: { target: { value: string } }) => void
    label?: string
  }) => (
    <div>
      {label && <span>{label}</span>}
      <select
        data-testid="language-select"
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  ),
}))

import { LanguageSwitcher } from './LanguageSwitcher'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    navigateMock.mockResolvedValue(undefined)
    useLanguageStore.setState({ language: 'es' })
  })

  it('renders the select element', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByTestId('language-select')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<LanguageSwitcher label="Language" />)
    expect(screen.getByText('Language:')).toBeInTheDocument()
  })

  it('shows current language as selected value', () => {
    useLanguageStore.setState({ language: 'en' })
    render(<LanguageSwitcher />)
    expect(screen.getByTestId('language-select')).toHaveValue('en')
  })

  it('calls setLanguage and navigates when language changes', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)
    await user.selectOptions(screen.getByTestId('language-select'), 'en')
    expect(useLanguageStore.getState().language).toBe('en')
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ replace: true })
    )
  })

  it('translates the path when changing language', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)
    await user.selectOptions(screen.getByTestId('language-select'), 'en')
    const callArg = navigateMock.mock.calls[0][0] as { to: string }
    expect(callArg.to).toBe('/en')
  })
})
