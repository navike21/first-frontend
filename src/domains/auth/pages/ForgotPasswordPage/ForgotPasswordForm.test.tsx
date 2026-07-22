import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ForgotPasswordForm } from './ForgotPasswordForm'

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

const { requestResetMock } = vi.hoisted(() => ({ requestResetMock: vi.fn() }))
const stateRef = {
  isPending: false,
  isSuccess: false,
  successMessage: null as string | null,
  errorMessage: null as string | null,
}

vi.mock('../../model/useForgotPassword', () => ({
  useForgotPassword: () => ({
    requestReset: requestResetMock,
    isPending: stateRef.isPending,
    isSuccess: stateRef.isSuccess,
    successMessage: stateRef.successMessage,
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

describe('ForgotPasswordForm component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    stateRef.isPending = false
    stateRef.isSuccess = false
    stateRef.successMessage = null
    stateRef.errorMessage = null
  })

  it('should render the email field', () => {
    render(<ForgotPasswordForm />, { wrapper })
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
  })

  it('should render the submit button', () => {
    render(<ForgotPasswordForm />, { wrapper })
    expect(
      screen.getByRole('button', { name: /enviar enlace/i })
    ).toBeInTheDocument()
  })

  it('should render a link back to login', () => {
    render(<ForgotPasswordForm />, { wrapper })
    const link = screen.getByText(/volver a inicio de sesión/i)
    expect(link.closest('a')).toHaveAttribute('href', '/es/login')
  })

  it('should show a validation error when submitted with an invalid email', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm />, { wrapper })
    await user.type(screen.getByLabelText(/correo electrónico/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /enviar enlace/i }))
    await waitFor(() => {
      expect(
        screen.getByText('Introduce un correo electrónico válido')
      ).toBeInTheDocument()
    })
  })

  it('should call requestReset when submitted with a valid email', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordForm />, { wrapper })
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'ana@navike21.com'
    )
    await user.click(screen.getByRole('button', { name: /enviar enlace/i }))
    await waitFor(() => {
      expect(requestResetMock).toHaveBeenCalledWith(
        { email: 'ana@navike21.com' },
        expect.anything()
      )
    })
  })

  it('should display errorMessage when the request fails', () => {
    stateRef.errorMessage = 'Error de red'
    render(<ForgotPasswordForm />, { wrapper })
    expect(screen.getByText('Error de red')).toBeInTheDocument()
  })

  it('should show the success confirmation instead of the form when isSuccess is true', () => {
    stateRef.isSuccess = true
    stateRef.successMessage = 'Si el correo existe, te enviamos un enlace.'
    render(<ForgotPasswordForm />, { wrapper })
    expect(screen.getByText('Revisa tu correo')).toBeInTheDocument()
    expect(
      screen.getByText('Si el correo existe, te enviamos un enlace.')
    ).toBeInTheDocument()
    expect(screen.queryByLabelText(/correo electrónico/i)).not.toBeInTheDocument()
  })
})
