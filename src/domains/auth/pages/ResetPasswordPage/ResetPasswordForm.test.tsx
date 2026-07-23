import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ResetPasswordForm } from './ResetPasswordForm'

vi.mock('@/shared/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui')>()
  return {
    ...actual,
    LinkButton: ({
      children,
      href,
    }: {
      children: React.ReactNode
      href?: string
    }) => <a href={href}>{children}</a>,
  }
})

const { resetPasswordMock } = vi.hoisted(() => ({ resetPasswordMock: vi.fn() }))
const stateRef = {
  isPending: false,
  isSuccess: false,
  successMessage: null as string | null,
  isInvalidToken: false,
  errorMessage: null as string | null,
}

vi.mock('../../model/useResetPassword', () => ({
  useResetPassword: () => ({
    resetPassword: resetPasswordMock,
    isPending: stateRef.isPending,
    isSuccess: stateRef.isSuccess,
    successMessage: stateRef.successMessage,
    isInvalidToken: stateRef.isInvalidToken,
    errorMessage: stateRef.errorMessage,
  }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('ResetPasswordForm component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    stateRef.isPending = false
    stateRef.isSuccess = false
    stateRef.successMessage = null
    stateRef.isInvalidToken = false
    stateRef.errorMessage = null
  })

  it('should show the invalid-link state when no token is provided, without ever rendering the form', () => {
    render(<ResetPasswordForm />, { wrapper })
    expect(screen.getByText(/enlace inválido/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/nueva contraseña/i)).not.toBeInTheDocument()
    expect(resetPasswordMock).not.toHaveBeenCalled()
  })

  it('should show the invalid-link state when isInvalidToken is true', () => {
    stateRef.isInvalidToken = true
    render(<ResetPasswordForm token="bad-token" />, { wrapper })
    expect(screen.getByText(/enlace inválido/i)).toBeInTheDocument()
    expect(
      screen.getByText(/solicitar un nuevo enlace/i).closest('a')
    ).toHaveAttribute('href', '/es/recuperar-contrasena')
  })

  it('should render the password fields when a token is present', () => {
    render(<ResetPasswordForm token="good-token" />, { wrapper })
    expect(screen.getByLabelText(/nueva contraseña/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
  })

  it('should show a validation error for a weak password', async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm token="good-token" />, { wrapper })
    await user.type(screen.getByLabelText(/nueva contraseña/i), 'weak')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'weak')
    await user.click(
      screen.getByRole('button', { name: /guardar contraseña/i })
    )
    await waitFor(() => {
      expect(
        screen.getByText('La contraseña debe tener al menos 8 caracteres')
      ).toBeInTheDocument()
    })
  })

  it('should show a mismatch error when passwords differ', async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm token="good-token" />, { wrapper })
    await user.type(screen.getByLabelText(/nueva contraseña/i), 'Password1')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Password2')
    await user.click(
      screen.getByRole('button', { name: /guardar contraseña/i })
    )
    await waitFor(() => {
      expect(
        screen.getByText('Las contraseñas no coinciden')
      ).toBeInTheDocument()
    })
  })

  it('should call resetPassword when submitted with a valid matching password', async () => {
    const user = userEvent.setup()
    render(<ResetPasswordForm token="good-token" />, { wrapper })
    await user.type(screen.getByLabelText(/nueva contraseña/i), 'Password1')
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'Password1')
    await user.click(
      screen.getByRole('button', { name: /guardar contraseña/i })
    )
    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith(
        { password: 'Password1', confirmPassword: 'Password1' },
        expect.anything()
      )
    })
  })

  it('should display errorMessage when the request fails for a reason other than an invalid token', () => {
    stateRef.errorMessage = 'Error de red'
    render(<ResetPasswordForm token="good-token" />, { wrapper })
    expect(screen.getByText('Error de red')).toBeInTheDocument()
  })

  it('should show the success confirmation instead of the form when isSuccess is true', () => {
    stateRef.isSuccess = true
    stateRef.successMessage = 'Contraseña actualizada correctamente.'
    render(<ResetPasswordForm token="good-token" />, { wrapper })
    expect(screen.getByText('Contraseña actualizada')).toBeInTheDocument()
    expect(
      screen.getByText('Contraseña actualizada correctamente.')
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/nueva contraseña/i)).not.toBeInTheDocument()
  })
})
