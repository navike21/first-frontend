import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Chip } from './Chip'

describe('Chip', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render children', () => {
    // Arrange & Act
    render(<Chip>Test chip</Chip>)
    // Assert
    expect(screen.getByText('Test chip')).toBeInTheDocument()
  })

  it('should render as a span element', () => {
    // Arrange & Act
    const { container } = render(<Chip>Chip</Chip>)
    // Assert
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('should apply base classes', () => {
    // Arrange & Act
    const { container } = render(<Chip>Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'ring-1', 'font-medium')
  })

  it('should apply default variant classes when no variant given', () => {
    // Arrange & Act
    const { container } = render(<Chip>Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('bg-slate-100', 'text-slate-700', 'ring-slate-300')
  })

  it('should apply success variant classes', () => {
    // Arrange & Act
    const { container } = render(<Chip variant="success">Success</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('bg-emerald-100', 'text-emerald-700', 'ring-emerald-300')
  })

  it('should apply warning variant classes', () => {
    // Arrange & Act
    const { container } = render(<Chip variant="warning">Warning</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('bg-yellow-100', 'text-yellow-700', 'ring-yellow-300')
  })

  it('should apply informative variant classes', () => {
    // Arrange & Act
    const { container } = render(<Chip variant="informative">Info</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('bg-blue-100', 'text-blue-700', 'ring-blue-300')
  })

  it('should apply error variant classes', () => {
    // Arrange & Act
    const { container } = render(<Chip variant="error">Error</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('bg-red-100', 'text-red-700', 'ring-red-300')
  })

  it('should apply x-small size classes', () => {
    // Arrange & Act
    const { container } = render(<Chip size="x-small">Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('h-5', 'text-xs', 'px-2', 'gap-1')
  })

  it('should apply small size classes', () => {
    // Arrange & Act
    const { container } = render(<Chip size="small">Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('h-6', 'text-xs', 'px-2.5', 'gap-1')
  })

  it('should apply medium size classes by default', () => {
    // Arrange & Act
    const { container } = render(<Chip>Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('h-7', 'text-sm', 'px-3', 'gap-1.5')
  })

  it('should apply large size classes', () => {
    // Arrange & Act
    const { container } = render(<Chip size="large">Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('h-8', 'text-sm', 'px-3.5', 'gap-1.5')
  })

  it('should render icon when icon prop is provided', () => {
    // Arrange & Act
    const { container } = render(<Chip icon="RiHomeLine">Chip</Chip>)
    // Assert
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('should not render any button when deleteable is false', () => {
    // Arrange & Act
    render(<Chip>Chip</Chip>)
    // Assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render delete button when deleteable is true', () => {
    // Arrange & Act
    render(<Chip deleteable>Chip</Chip>)
    // Assert
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should give delete button type="button"', () => {
    // Arrange & Act
    render(<Chip deleteable>Chip</Chip>)
    // Assert
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('should call deleteButtonProps.onClick when delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Chip deleteable deleteButtonProps={{ onClick }}>
        Chip
      </Chip>,
    )
    // Act
    await user.click(screen.getByRole('button'))
    // Assert
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should disable delete button when deleteButtonProps.disabled is true', () => {
    // Arrange & Act
    render(
      <Chip deleteable deleteButtonProps={{ disabled: true }}>
        Chip
      </Chip>,
    )
    // Assert
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should apply cursor-not-allowed when delete button is disabled', () => {
    // Arrange & Act
    render(
      <Chip deleteable deleteButtonProps={{ disabled: true }}>
        Chip
      </Chip>,
    )
    // Assert
    expect(screen.getByRole('button')).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('should apply custom className to root element', () => {
    // Arrange & Act
    const { container } = render(<Chip className="my-custom-class">Chip</Chip>)
    const chip = container.firstChild as HTMLElement
    // Assert
    expect(chip).toHaveClass('my-custom-class')
  })

  it('should render delete icon inside delete button', () => {
    // Arrange & Act
    render(<Chip deleteable>Chip</Chip>)
    const deleteButton = screen.getByRole('button')
    // Assert
    expect(deleteButton.querySelector('svg')).toBeInTheDocument()
  })

  it('should render both icon and children', () => {
    // Arrange & Act
    render(<Chip icon="RiStarLine">Star chip</Chip>)
    // Assert
    expect(screen.getByText('Star chip')).toBeInTheDocument()
  })

  it('should pass additional deleteButtonProps attributes', () => {
    // Arrange & Act
    render(
      <Chip deleteable deleteButtonProps={{ 'aria-label': 'Remove item' }}>
        Chip
      </Chip>,
    )
    // Assert
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove item')
  })

  it('should render iconContent when provided and no icon prop', () => {
    // Arrange & Act
    render(<Chip iconContent={<span data-testid="custom-icon">★</span>}>Chip</Chip>)
    // Assert
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should not render iconContent when icon prop is also provided', () => {
    // Arrange & Act
    const { container } = render(
      <Chip icon="RiHomeLine" iconContent={<span data-testid="custom-icon">★</span>}>
        Chip
      </Chip>,
    )
    // Assert — icon renders SVG; iconContent is suppressed
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeNull()
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('should apply correct size class to iconContent wrapper for x-small', () => {
    // Arrange & Act
    const { container } = render(
      <Chip size="x-small" iconContent={<span data-testid="ic">★</span>}>
        Chip
      </Chip>,
    )
    const wrapper = container.querySelector('[data-testid="ic"]')?.parentElement as HTMLElement
    // Assert
    expect(wrapper).toHaveClass('w-3', 'h-3')
  })
})
