import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { NavItem } from './NavItem'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    onClick,
    className,
    children,
  }: {
    to: string
    onClick?: () => void
    className?: string
    children: React.ReactNode
  }) => (
    <a href={to} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('../IconComponent/IconComponent', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
}))

describe('NavItem component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('renders as a link when "to" is provided', () => {
    it('renders as an anchor tag', () => {
      render(<NavItem icon="RiHomeLine" label="Home" to="/home" />)
      expect(screen.getByRole('link')).toBeInTheDocument()
    })

    it('sets the href attribute correctly', () => {
      render(<NavItem icon="RiHomeLine" label="Home" to="/home" />)
      expect(screen.getByRole('link')).toHaveAttribute('href', '/home')
    })

    it('renders the label text', () => {
      render(<NavItem icon="RiHomeLine" label="Dashboard" to="/dashboard" />)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<NavItem icon="RiHomeLine" label="Home" to="/home" onClick={handleClick} />)
      await user.click(screen.getByRole('link'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('renders as a button when "to" is not provided', () => {
    it('renders as a button', () => {
      render(<NavItem icon="RiSettings3Line" label="Settings" />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders the label text', () => {
      render(<NavItem icon="RiSettings3Line" label="Settings" />)
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<NavItem icon="RiSettings3Line" label="Settings" onClick={handleClick} />)
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  it('should render the icon component', () => {
    // Arrange & Act
    render(<NavItem icon="RiHomeLine" label="Home" />)
    // Assert
    expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    // Arrange & Act
    render(<NavItem icon="RiHomeLine" label="Home" className="custom-class" />)
    // Assert
    const el = screen.getByRole('button')
    expect(el).toHaveClass('custom-class')
  })
})
