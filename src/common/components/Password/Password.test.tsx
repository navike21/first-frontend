import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Password } from './Password'

describe('Password Component', () => {
  it('should render the password input', () => {
    render(<Password label="Password" name="password" />)
    const inputElement = screen.getByLabelText('Password')
    expect(inputElement).toBeInTheDocument()
  })

  it('should display error message when error prop is passed', () => {
    const error = {
      password: { type: 'manual', message: 'Password is required' },
    }
    render(<Password label="Password" name="password" error={error} />)
    const errorMessage = screen.getByText(/password is required/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('should call the ref function', () => {
    const ref = vi.fn()
    render(<Password label="Password" name="password" ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})
