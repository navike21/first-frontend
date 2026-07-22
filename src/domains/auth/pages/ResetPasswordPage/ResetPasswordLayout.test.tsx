import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResetPasswordLayout } from './ResetPasswordLayout'

const { useSearchMock } = vi.hoisted(() => ({
  useSearchMock: vi.fn(() => ({}) as { token?: string }),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useSearch: useSearchMock,
  }
})

vi.mock('./ResetPasswordForm', () => ({
  ResetPasswordForm: ({ token }: { token?: string }) => (
    <form data-testid="reset-password-form" data-token={token ?? ''} />
  ),
}))

describe('ResetPasswordLayout component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSearchMock.mockReturnValue({})
  })

  it('renders the app brand heading', () => {
    render(<ResetPasswordLayout />)
    expect(
      screen.getByRole('heading', { name: /restablecer contraseña/i })
    ).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<ResetPasswordLayout />)
    expect(
      screen.getByText(/crea una nueva contraseña para tu cuenta/i)
    ).toBeInTheDocument()
  })

  it('forwards the token from the search params to the form', () => {
    useSearchMock.mockReturnValue({ token: 'abc-123' })
    render(<ResetPasswordLayout />)
    expect(screen.getByTestId('reset-password-form')).toHaveAttribute(
      'data-token',
      'abc-123'
    )
  })

  it('forwards an empty token when the search params have none', () => {
    useSearchMock.mockReturnValue({})
    render(<ResetPasswordLayout />)
    expect(screen.getByTestId('reset-password-form')).toHaveAttribute(
      'data-token',
      ''
    )
  })
})
