import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('renders children correctly', () => {
    render(<IconButton>Click me</IconButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles onClick event', () => {
    const handleClick = vi.fn()
    render(<IconButton onClick={handleClick}>Click me</IconButton>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('passes other props to the underlying component', () => {
    render(<IconButton color="primary">Click me</IconButton>)
    expect(screen.getByText('Click me')).toHaveClass(
      'MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary'
    )
  })

  it('matches snapshot', () => {
    const { asFragment } = render(<IconButton>Click me</IconButton>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches snapshot with color', () => {
    const { asFragment } = render(
      <IconButton color="primary">Click me</IconButton>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches snapshot with disabled', () => {
    const { asFragment } = render(<IconButton disabled>Click me</IconButton>)
    expect(asFragment()).toMatchSnapshot()
  })
})
