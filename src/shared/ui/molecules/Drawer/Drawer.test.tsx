import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

vi.mock('@/shared/ui', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
}))

describe('Drawer component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render children', () => {
    // Arrange & Act
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <p>Drawer content</p>
      </Drawer>,
    )
    // Assert
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  it('should render the title when provided', () => {
    // Arrange & Act
    render(
      <Drawer isOpen={true} onClose={vi.fn()} title="My Drawer">
        Content
      </Drawer>,
    )
    // Assert
    expect(screen.getByText('My Drawer')).toBeInTheDocument()
  })

  it('should render close button when title is provided', () => {
    // Arrange & Act
    render(
      <Drawer isOpen={true} onClose={vi.fn()} title="Title">
        Content
      </Drawer>,
    )
    // Assert
    expect(screen.getByLabelText('Cerrar menú')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Drawer isOpen={true} onClose={onClose} title="Title">
        Content
      </Drawer>,
    )
    // Act
    await user.click(screen.getByLabelText('Cerrar menú'))
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when backdrop is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(
      <Drawer isOpen={true} onClose={onClose}>
        Content
      </Drawer>,
    )
    // Act
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should apply translate-x-0 when open and placement=right', () => {
    // Arrange & Act
    const { container } = render(
      <Drawer isOpen={true} onClose={vi.fn()} placement="right">
        Content
      </Drawer>,
    )
    // Assert
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('translate-x-0')
  })

  it('should apply translate-x-full when closed and placement=right', () => {
    // Arrange & Act
    const { container } = render(
      <Drawer isOpen={false} onClose={vi.fn()} placement="right">
        Content
      </Drawer>,
    )
    // Assert
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('translate-x-full')
  })

  it('should apply -translate-x-full when closed and placement=left', () => {
    // Arrange & Act
    const { container } = render(
      <Drawer isOpen={false} onClose={vi.fn()} placement="left">
        Content
      </Drawer>,
    )
    // Assert
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('-translate-x-full')
  })

  it('should apply right-0 border-l classes for placement=right (default)', () => {
    // Arrange & Act
    const { container } = render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        Content
      </Drawer>,
    )
    // Assert
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('right-0', 'border-l')
  })

  it('should apply left-0 border-r classes for placement=left', () => {
    // Arrange & Act
    const { container } = render(
      <Drawer isOpen={true} onClose={vi.fn()} placement="left">
        Content
      </Drawer>,
    )
    // Assert
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('left-0', 'border-r')
  })

  it('should call onClose when Escape key is pressed while open', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Drawer isOpen={true} onClose={onClose}>
        Content
      </Drawer>,
    )
    // Act
    await user.keyboard('{Escape}')
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onClose when Escape key is pressed while closed', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Drawer isOpen={false} onClose={onClose}>
        Content
      </Drawer>,
    )
    // Act
    await user.keyboard('{Escape}')
    // Assert
    expect(onClose).not.toHaveBeenCalled()
  })
})
