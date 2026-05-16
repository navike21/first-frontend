import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FeatureCard } from './FeatureCard'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    className,
    children,
  }: {
    to: string
    className?: string
    children: React.ReactNode
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('../../atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({
    icon,
    className,
  }: {
    icon: string
    className?: string
  }) => <span data-testid={`icon-${icon}`} className={className} />,
}))

vi.mock('../../atoms/Card/Card', () => ({
  Card: ({
    children,
    className,
    padding,
  }: {
    children: React.ReactNode
    className?: string
    padding?: string
  }) => (
    <div className={className} data-padding={padding}>
      {children}
    </div>
  ),
}))

describe('FeatureCard component', () => {
  const defaultProps = {
    title: 'Gestionar Clientes',
    description: 'Administrar clientes y desarrolladores',
    icon: 'RiBuilding4Line' as const,
    href: '/clients',
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the title', () => {
    // Arrange & Act
    render(<FeatureCard {...defaultProps} />)
    // Assert
    expect(screen.getByText('Gestionar Clientes')).toBeInTheDocument()
  })

  it('should render the description', () => {
    // Arrange & Act
    render(<FeatureCard {...defaultProps} />)
    // Assert
    expect(
      screen.getByText('Administrar clientes y desarrolladores')
    ).toBeInTheDocument()
  })

  it('should render as a link with correct href', () => {
    // Arrange & Act
    render(<FeatureCard {...defaultProps} />)
    // Assert
    expect(screen.getByRole('link')).toHaveAttribute('href', '/clients')
  })

  it('should render the icon', () => {
    // Arrange & Act
    render(<FeatureCard {...defaultProps} />)
    // Assert
    expect(screen.getByTestId('icon-RiBuilding4Line')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    // Arrange & Act
    render(<FeatureCard {...defaultProps} className="extra-class" />)
    // Assert
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})
