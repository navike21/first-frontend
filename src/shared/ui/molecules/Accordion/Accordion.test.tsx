import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Accordion } from './Accordion'

vi.mock('../../atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({
    icon,
    className,
  }: {
    icon: string
    className?: string
  }) => <span data-testid={`icon-${icon}`} className={className} />,
}))

describe('Accordion component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the title', () => {
    // Arrange & Act
    render(
      <Accordion title="My Title" isOpen={false} onToggle={vi.fn()}>
        Content
      </Accordion>
    )
    // Assert
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('should render children when isOpen is true', () => {
    // Arrange & Act
    render(
      <Accordion title="Title" isOpen={true} onToggle={vi.fn()}>
        Visible Content
      </Accordion>
    )
    // Assert
    expect(screen.getByText('Visible Content')).toBeInTheDocument()
  })

  it('should render children in DOM even when isOpen is false (CSS-only hide)', () => {
    // Arrange & Act
    render(
      <Accordion title="Title" isOpen={false} onToggle={vi.fn()}>
        Hidden Content
      </Accordion>
    )
    // Assert — accordion uses CSS grid-rows to hide, not DOM removal
    expect(screen.getByText('Hidden Content')).toBeInTheDocument()
  })

  it('should call onToggle when button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <Accordion title="Title" isOpen={false} onToggle={onToggle}>
        Content
      </Accordion>
    )
    // Act
    await user.click(screen.getByRole('button'))
    // Assert
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('should render icon when provided', () => {
    // Arrange & Act
    render(
      <Accordion
        title="Title"
        isOpen={false}
        onToggle={vi.fn()}
        icon={<span data-testid="custom-icon" />}
      >
        Content
      </Accordion>
    )
    // Assert
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('should apply isOpen active styles on button when open', () => {
    // Arrange & Act
    render(
      <Accordion title="Title" isOpen={true} onToggle={vi.fn()}>
        Content
      </Accordion>
    )
    // Assert
    expect(screen.getByRole('button')).toHaveClass('text-primary-700')
  })

  it('should apply closed styles on button when not open', () => {
    // Arrange & Act
    render(
      <Accordion title="Title" isOpen={false} onToggle={vi.fn()}>
        Content
      </Accordion>
    )
    // Assert
    expect(screen.getByRole('button')).toHaveClass('text-(--text-secondary)')
  })

  it('should apply the arrow icon with rotate class when open', () => {
    // Arrange & Act
    render(
      <Accordion title="Title" isOpen={true} onToggle={vi.fn()}>
        Content
      </Accordion>
    )
    // Assert
    const arrowIcon = screen.getByTestId('icon-RiArrowDownSLine')
    expect(arrowIcon).toHaveClass('rotate-180')
  })

  it('should apply custom className to wrapper', () => {
    // Arrange & Act
    const { container } = render(
      <Accordion
        title="Title"
        isOpen={false}
        onToggle={vi.fn()}
        className="extra-class"
      >
        Content
      </Accordion>
    )
    // Assert
    expect(container.firstChild).toHaveClass('extra-class')
  })
})
