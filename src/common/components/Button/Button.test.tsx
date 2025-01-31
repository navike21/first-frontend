import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

const renderButton = (props = {}) =>
  render(<Button {...props}>Click me</Button>)

describe('Button', () => {
  describe('Basic rendering', () => {
    it('renders button with children', () => {
      renderButton()
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies additional props correctly', () => {
      renderButton({ color: 'primary', 'data-testid': 'custom-button' })
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('data-testid', 'custom-button')
      expect(button).toHaveClass('MuiButton-root')
    })

    it('renders with the correct size and variant', () => {
      renderButton({ size: 'small', variant: 'outlined' })
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('data-variant', 'outlined')
    })
  })

  describe('Loading state', () => {
    it('shows loading state when loading prop is true', () => {
      renderButton({ loading: true })
      expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('shows custom loading text when provided', () => {
      renderButton({ loading: true, loadingText: 'Please wait...' })
      expect(screen.getByLabelText('Please wait...')).toBeInTheDocument()
      expect(screen.getByText('Please wait...')).toBeInTheDocument()
    })

    it('disables button when loading', () => {
      renderButton({ loading: true })
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('sets aria-busy attribute when loading', () => {
      renderButton({ loading: true })
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('hides children when loading', () => {
      renderButton({ loading: true })
      expect(screen.queryByText('Click me')).not.toBeInTheDocument()
    })
  })

  describe('Children visibility', () => {
    it('does not hide children when not loading', () => {
      renderButton({ loading: false })
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })
  })

  describe('OnClick behavior', () => {
    it('calls onClick handler when clicked and not loading', () => {
      const handleClick = vi.fn()
      renderButton({ onClick: handleClick })
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick handler when clicked while loading', () => {
      const handleClick = vi.fn()
      renderButton({ loading: true, onClick: handleClick })
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Disabled state', () => {
    it('respects the disabled prop when not loading', () => {
      renderButton({ disabled: true })
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Snapshot testing', () => {
    it('matches snapshot', () => {
      const { asFragment } = renderButton()
      expect(asFragment()).toMatchSnapshot()
    })

    it('matches snapshot with loading', () => {
      const { asFragment } = renderButton({ loading: true })
      expect(asFragment()).toMatchSnapshot()
    })

    it('matches snapshot with disabled', () => {
      const { asFragment } = renderButton({ disabled: true })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
