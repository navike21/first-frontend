import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from './LoginForm'

const { loginMock } = vi.hoisted(() => ({ loginMock: vi.fn() }))

vi.mock('../model/useLogin', () => ({
  useLogin: () => ({
    login: loginMock,
    isPending: false,
    errorMessage: null,
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

describe('LoginForm component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render username and password fields', () => {
    // Arrange & Act
    render(<LoginForm />, { wrapper })
    // Assert
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('should render the submit button', () => {
    // Arrange & Act
    render(<LoginForm />, { wrapper })
    // Assert
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('should show username validation error when submitted with empty fields', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />, { wrapper })
    // Act
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    // Assert
    await waitFor(() => {
      expect(
        screen.getByText('Introduce tu nombre de usuario')
      ).toBeInTheDocument()
    })
  })

  it('should show password validation error for short password', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />, { wrapper })
    // Act
    await user.type(screen.getByLabelText(/usuario/i), 'admin')
    await user.type(screen.getByLabelText(/contraseña/i), 'short')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    // Assert
    await waitFor(() => {
      expect(
        screen.getByText('La contraseña debe tener al menos 8 caracteres')
      ).toBeInTheDocument()
    })
  })

  it('should call login when form is submitted with valid data', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<LoginForm />, { wrapper })
    // Act
    await user.type(screen.getByLabelText(/usuario/i), 'jichaponan')
    await user.type(screen.getByLabelText(/contraseña/i), 'admin123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    // Assert
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        { username: 'jichaponan', password: 'admin123' },
        expect.anything()
      )
    })
  })

  it('should render form element with noValidate attribute', () => {
    // Arrange & Act
    const { container } = render(<LoginForm />, { wrapper })
    const form = container.querySelector('form')
    // Assert
    expect(form).toHaveAttribute('novalidate')
  })

  it('should have correct flex-col CSS layout on the form', () => {
    // Arrange & Act
    const { container } = render(<LoginForm />, { wrapper })
    const form = container.querySelector('form')
    // Assert
    expect(form).toHaveClass('flex', 'flex-col')
  })
})
