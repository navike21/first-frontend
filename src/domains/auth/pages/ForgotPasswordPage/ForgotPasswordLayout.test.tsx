import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ForgotPasswordLayout } from './ForgotPasswordLayout'

vi.mock('./ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => <form data-testid="forgot-password-form" />,
}))

describe('ForgotPasswordLayout component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders the app brand heading', () => {
    render(<ForgotPasswordLayout />)
    expect(
      screen.getByRole('heading', { name: /olvidaste tu contraseña/i })
    ).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<ForgotPasswordLayout />)
    expect(
      screen.getByText(/te enviaremos un enlace de recuperación/i)
    ).toBeInTheDocument()
  })

  it('renders the forgot password form', () => {
    render(<ForgotPasswordLayout />)
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument()
  })
})
