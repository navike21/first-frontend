import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginLayout } from './LoginLayout'

vi.mock('./LoginForm', () => ({
  LoginForm: () => <form data-testid="login-form" />,
}))

describe('LoginLayout component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders the app brand heading', () => {
    render(<LoginLayout />)
    expect(screen.getByRole('heading', { name: /first/i })).toBeInTheDocument()
  })

  it('renders the product subtitle', () => {
    render(<LoginLayout />)
    expect(screen.getByText(/gestor navike21/i)).toBeInTheDocument()
  })

  it('renders the login form', () => {
    render(<LoginLayout />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('renders the section heading', () => {
    render(<LoginLayout />)
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
  })
})
