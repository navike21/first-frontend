import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { Switch } from './Switch'

vi.mock('../../layouts/ToggleLayout/ToggleLayout', () => ({
  ToggleLayout: ({
    label,
    children,
    disabled,
    helperText,
    error,
    errorMessage,
    id,
  }: {
    label?: string
    children: React.ReactNode
    disabled?: boolean
    helperText?: string
    error?: boolean
    errorMessage?: string
    id?: string
  }) => (
    <div data-testid="toggle-layout" data-id={id} data-disabled={disabled}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {helperText && <span>{helperText}</span>}
      {error && errorMessage && <span role="alert">{errorMessage}</span>}
    </div>
  ),
}))

describe('Switch', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders a checkbox input', () => {
    render(<Switch />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders as enabled by default', () => {
    render(<Switch />)
    expect(screen.getByRole('checkbox')).not.toBeDisabled()
  })

  it('renders as disabled when disabled prop is passed', () => {
    render(<Switch disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('renders label via ToggleLayout', () => {
    render(<Switch label="Enable feature" />)
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
  })

  it('renders helperText via ToggleLayout', () => {
    render(<Switch helperText="This enables the feature" />)
    expect(screen.getByText('This enables the feature')).toBeInTheDocument()
  })

  it('renders errorMessage via ToggleLayout when error=true', () => {
    render(<Switch error errorMessage="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('uses provided name as id', () => {
    render(<Switch name="my-switch" label="My Switch" />)
    const layout = screen.getByTestId('toggle-layout')
    expect(layout).toHaveAttribute('data-id', 'my-switch')
  })

  it('generates id when name is not provided', () => {
    render(<Switch label="Auto ID" />)
    const layout = screen.getByTestId('toggle-layout')
    expect(layout.getAttribute('data-id')).toBeTruthy()
  })

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Switch ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('checkbox'))
  })

  it('applies medium size track by default', () => {
    const { container } = render(<Switch />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-6', 'w-11')
  })

  it('applies small size track', () => {
    const { container } = render(<Switch size="small" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-5', 'w-9')
  })

  it('applies large size track', () => {
    const { container } = render(<Switch size="large" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('h-8', 'w-14')
  })
})
