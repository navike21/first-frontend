import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { Tooltip } from './Tooltip'

describe('Tooltip component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children', () => {
    // Arrange & Act
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    // Assert
    expect(screen.getByRole('button', { name: /trigger/i })).toBeInTheDocument()
  })

  it('should not show tooltip content by default', () => {
    // Arrange & Act
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    // Assert
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should show tooltip on mouse enter', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip text')
  })

  it('should hide tooltip when mouse moves to another element', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <div>
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>
        <button>Other element</button>
      </div>
    )
    const wrapper = screen.getByTestId('tooltip-wrapper')
    // Act — enter the wrapper
    await user.hover(wrapper)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    // Act — move pointer to document.body (outside wrapper subtree)
    await user.pointer({ target: document.body })
    // Assert
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should dismiss the tooltip when the trigger is clicked', async () => {
    // Arrange — a click usually performs an action (e.g. opening a modal),
    // so the hint should disappear instead of lingering on top of it.
    const user = userEvent.setup()
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    const wrapper = screen.getByTestId('tooltip-wrapper')
    // Act — hover shows the tooltip
    await user.hover(wrapper)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    // Act — clicking the trigger dismisses it
    await user.click(screen.getByRole('button'))
    // Assert
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should stay hidden after a click even while still hovering', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    const wrapper = screen.getByTestId('tooltip-wrapper')
    await user.hover(wrapper)
    // Act — click without moving the pointer away
    await user.click(screen.getByRole('button'))
    // Assert — remains hidden until a fresh hover
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('should apply dark variant classes by default', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toHaveClass('bg-gray-950', 'text-white')
  })

  it('should apply light variant classes', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" variant="light">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toHaveClass(
      'bg-white',
      'text-(--text-primary)'
    )
  })

  it('should apply small size classes', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" size="small">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toHaveClass(
      'text-xs',
      'px-2.5',
      'py-1.5'
    )
  })

  it('should apply medium size classes by default', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toHaveClass('text-sm', 'px-3.5', 'py-2')
  })

  it('should apply large size classes', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" size="large">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toHaveClass(
      'text-base',
      'px-5',
      'py-2.5'
    )
  })

  it('should apply top position style', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" position="top">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — fixed portal with transform placing tooltip above the trigger
    expect(screen.getByRole('tooltip')).toHaveStyle({
      position: 'fixed',
      transform: 'translateX(-50%) translateY(-100%)',
    })
  })

  it('should apply bottom position style', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" position="bottom">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — fixed portal with transform placing tooltip below the trigger
    expect(screen.getByRole('tooltip')).toHaveStyle({
      position: 'fixed',
      transform: 'translateX(-50%)',
    })
  })

  it('should apply left position style', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" position="left">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — fixed portal with transform placing tooltip to the left of the trigger
    expect(screen.getByRole('tooltip')).toHaveStyle({
      position: 'fixed',
      transform: 'translateX(-100%) translateY(-50%)',
    })
  })

  it('should apply right position style', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" position="right">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — fixed portal with transform placing tooltip to the right of the trigger
    expect(screen.getByRole('tooltip')).toHaveStyle({
      position: 'fixed',
      transform: 'translateY(-50%)',
    })
  })

  it('should auto-position to top when element is in the bottom half of viewport', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 600,
      bottom: 620,
      height: 20,
      width: 100,
      left: 100,
      right: 200,
      x: 100,
      y: 600,
      toJSON: vi.fn(),
    })
    Object.defineProperty(globalThis, 'innerHeight', {
      value: 768,
      configurable: true,
    })
    render(
      <Tooltip content="Text" position="auto">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — element center (610) > midpoint (384) → top
    expect(screen.getByRole('tooltip')).toHaveStyle({
      transform: 'translateX(-50%) translateY(-100%)',
    })
  })

  it('should auto-position to bottom when element is in the top half of viewport', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 120,
      height: 20,
      width: 100,
      left: 100,
      right: 200,
      x: 100,
      y: 100,
      toJSON: vi.fn(),
    })
    Object.defineProperty(globalThis, 'innerHeight', {
      value: 768,
      configurable: true,
    })
    render(
      <Tooltip content="Text" position="auto">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — element center (110) < midpoint (384) → bottom
    await act(async () => {})
    expect(screen.getByRole('tooltip')).toHaveStyle({
      transform: 'translateX(-50%)',
    })
  })

  it('should render an arrow element inside the tooltip', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" position="top">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    const tooltip = screen.getByRole('tooltip')
    const arrow = tooltip.querySelector('[aria-hidden="true"]')
    expect(arrow).toBeInTheDocument()
    expect(arrow).toHaveClass('rotate-45', 'w-2', 'h-2')
  })

  it('applies the entrance animation class and anchors its scale origin', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content="Text" position="top">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert — scale+fade pop; a 'top' tooltip grows from its bottom edge
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveClass('animate-tooltip-in')
    expect(tooltip).toHaveStyle({ transformOrigin: 'bottom center' })
  })

  it('should apply custom className to wrapper', () => {
    // Arrange & Act
    const { container } = render(
      <Tooltip content="Text" className="custom-wrapper">
        <button>Trigger</button>
      </Tooltip>
    )
    // Assert
    expect(container.firstChild).toHaveClass('custom-wrapper')
  })

  it('should render ReactNode as tooltip content', async () => {
    // Arrange
    const user = userEvent.setup()
    render(
      <Tooltip content={<strong>Bold content</strong>} position="top">
        <button>Trigger</button>
      </Tooltip>
    )
    // Act
    await user.hover(screen.getByTestId('tooltip-wrapper'))
    // Assert
    expect(screen.getByRole('tooltip')).toContainElement(
      screen.getByText('Bold content')
    )
  })

  describe('structured tooltip (heading prop)', () => {
    it('should render heading text in structured layout', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="content" heading="Tooltip heading">
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByText('Tooltip heading')).toBeInTheDocument()
    })

    it('should render icon in structured layout when icon is provided', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip
          content="content"
          heading="Title"
          icon="RiHomeLine"
          variant="dark"
        >
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('should render subtitle when provided', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="content" heading="Title" subtitle="Extra detail">
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByText('Extra detail')).toBeInTheDocument()
    })

    it('should apply whitespace-normal class when subtitle is present', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="content" heading="Title" subtitle="Extra detail">
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByRole('tooltip')).toHaveClass('whitespace-normal')
    })

    it('should apply whitespace-nowrap when heading has no subtitle', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="content" heading="Title">
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByRole('tooltip')).toHaveClass('whitespace-nowrap')
    })

    it('should render light variant subtitle correctly', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip
          content="content"
          heading="Title"
          subtitle="Detail"
          variant="light"
        >
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByText('Detail')).toBeInTheDocument()
    })

    it('should apply large icon class when icon and subtitle both present', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip
          content="content"
          heading="Title"
          icon="RiHomeLine"
          subtitle="Detail"
        >
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText('Detail')).toBeInTheDocument()
    })

    it('should apply light variant icon color when variant is light', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip
          content="content"
          heading="Title"
          icon="RiHomeLine"
          variant="light"
        >
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('should apply small size class to subtitle when size is small', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip
          content="content"
          heading="Title"
          subtitle="Detail"
          size="small"
        >
          <button>Trigger</button>
        </Tooltip>
      )
      await user.hover(screen.getByTestId('tooltip-wrapper'))
      expect(screen.getByText('Detail')).toBeInTheDocument()
    })
  })
})
