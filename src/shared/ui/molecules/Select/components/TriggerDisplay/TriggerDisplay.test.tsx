import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TriggerDisplay } from './TriggerDisplay'

import type { SelectOptionItem } from '../../Select.types'

vi.mock('@Components/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({
    icon,
    className,
  }: {
    icon: string
    className?: string
  }) => <svg data-testid={`icon-${icon}`} className={className} />,
}))

describe('TriggerDisplay', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the label when singleLabel is provided', () => {
    // Arrange & Act
    render(<TriggerDisplay singleLabel="Option 1" placeholder="Pick one" />)

    // Assert
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.queryByText('Pick one')).not.toBeInTheDocument()
  })

  it('should render the placeholder when singleLabel is empty', () => {
    // Arrange & Act
    render(<TriggerDisplay singleLabel="" placeholder="Pick one" />)

    // Assert
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('should render empty string when both singleLabel and placeholder are absent', () => {
    // Arrange & Act
    render(<TriggerDisplay singleLabel="" />)

    // Assert — the span renders but has no visible text
    const span = document.querySelector('span > span')
    expect(span?.textContent).toBe('')
  })

  it('should render the icon from singleOption.icon when no content', () => {
    // Arrange
    const option: SelectOptionItem = {
      label: 'Home',
      value: 'home',
      icon: 'RiHomeLine',
    }

    // Act
    render(<TriggerDisplay singleLabel="Home" singleOption={option} />)

    // Assert
    expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
  })

  it('should render content from singleOption.content, taking priority over icon', () => {
    // Arrange
    const option: SelectOptionItem = {
      label: 'Custom',
      value: 'c',
      icon: 'RiHomeLine',
      content: <span data-testid="custom-content">★</span>,
    }

    // Act
    render(<TriggerDisplay singleLabel="Custom" singleOption={option} />)

    // Assert — content takes precedence; icon should not be rendered
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.queryByTestId('icon-RiHomeLine')).not.toBeInTheDocument()
  })

  it('should not render icon or content when singleOption is undefined', () => {
    // Arrange & Act
    render(<TriggerDisplay singleLabel="Something" />)

    // Assert
    expect(
      document.querySelector('[data-testid^="icon-"]')
    ).not.toBeInTheDocument()
  })
})
