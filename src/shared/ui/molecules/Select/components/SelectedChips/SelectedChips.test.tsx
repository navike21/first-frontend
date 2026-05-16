import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SelectedChips } from './SelectedChips'

import type { SelectOptionItem } from '../../Select.types'

vi.mock('@Components/atoms/Chip/Chip', () => ({
  Chip: ({
    children,
    icon,
    iconContent,
    deleteButtonProps,
  }: {
    children: React.ReactNode
    icon?: string
    iconContent?: React.ReactNode
    deleteButtonProps?: {
      onClick?: React.MouseEventHandler
      'aria-label'?: string
    }
  }) => (
    <span data-testid="chip">
      {icon && <svg data-testid={`chip-icon-${icon}`} />}
      {!icon && iconContent}
      {children}
      {deleteButtonProps && (
        <button
          type="button"
          onClick={deleteButtonProps.onClick}
          aria-label={deleteButtonProps['aria-label']}
        >
          ×
        </button>
      )}
    </span>
  ),
}))

const options: SelectOptionItem[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'With Icon', value: 'icon', icon: 'RiHomeLine' },
  {
    label: 'With Content',
    value: 'content',
    content: <span data-testid="custom-content">★</span>,
  },
]

describe('SelectedChips', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render a chip for each selected value', () => {
    // Arrange & Act
    render(
      <SelectedChips values={['1', '2']} options={options} disabled={false} onDeselect={vi.fn()} />,
    )

    // Assert
    expect(screen.getAllByTestId('chip')).toHaveLength(2)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('should render nothing for values without a matching option', () => {
    // Arrange & Act
    render(
      <SelectedChips
        values={['nonexistent']}
        options={options}
        disabled={false}
        onDeselect={vi.fn()}
      />,
    )

    // Assert
    expect(screen.queryByTestId('chip')).not.toBeInTheDocument()
  })

  it('should call onDeselect with the correct value when delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onDeselect = vi.fn()
    render(
      <SelectedChips values={['1']} options={options} disabled={false} onDeselect={onDeselect} />,
    )

    // Act
    await user.click(screen.getByRole('button', { name: 'Remove Option 1' }))

    // Assert
    expect(onDeselect).toHaveBeenCalledOnce()
    expect(onDeselect).toHaveBeenCalledWith('1')
  })

  it('should render the icon prop from option in the chip', () => {
    // Arrange & Act
    render(
      <SelectedChips values={['icon']} options={options} disabled={false} onDeselect={vi.fn()} />,
    )

    // Assert
    expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
  })

  it('should pass content as iconContent to chip when option has content', () => {
    // Arrange & Act
    render(
      <SelectedChips
        values={['content']}
        options={options}
        disabled={false}
        onDeselect={vi.fn()}
      />,
    )

    // Assert
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('should render an empty list when values array is empty', () => {
    // Arrange & Act
    render(<SelectedChips values={[]} options={options} disabled={false} onDeselect={vi.fn()} />)

    // Assert
    expect(screen.queryByTestId('chip')).not.toBeInTheDocument()
  })
})
