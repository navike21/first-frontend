import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useThemeStore } from '@/shared/model'
import { ThemeToggle } from './ThemeToggle'

vi.mock('../IconButton/IconButton', () => ({
  IconButton: ({
    icon,
    onClick,
    'aria-label': ariaLabel,
  }: {
    icon: string
    onClick?: () => void
    'aria-label'?: string
  }) => (
    <button onClick={onClick} aria-label={ariaLabel} data-testid={`icon-btn-${icon}`}>
      {icon}
    </button>
  ),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' })
  })

  it('renders moon icon when theme is light', () => {
    render(<ThemeToggle />)
    expect(screen.getByTestId('icon-btn-RiMoonLine')).toBeInTheDocument()
  })

  it('renders sun icon when theme is dark', () => {
    useThemeStore.setState({ theme: 'dark' })
    render(<ThemeToggle />)
    expect(screen.getByTestId('icon-btn-RiSunLine')).toBeInTheDocument()
  })

  it('has correct aria-label for light mode', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('has correct aria-label for dark mode', () => {
    useThemeStore.setState({ theme: 'dark' })
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })

  it('calls toggleTheme when clicked', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(screen.getByRole('button'))
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})
