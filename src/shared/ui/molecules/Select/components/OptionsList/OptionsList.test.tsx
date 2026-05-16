import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OptionsList } from './OptionsList'

import type { SelectOptionItem } from '../../Select.types'
import { SelectTextsProvider, DEFAULT_SELECT_TEXTS } from '../../Select.texts'

vi.mock('@Components/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <svg data-testid={`icon-${icon}`} className={className} />
  ),
}))

const wrap = (ui: React.ReactNode) => (
  <SelectTextsProvider value={DEFAULT_SELECT_TEXTS}>{ui}</SelectTextsProvider>
)

const options: SelectOptionItem[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Disabled', value: 'dis', disabled: true },
  { label: 'With Icon', value: 'icon', icon: 'RiHomeLine' },
  {
    label: 'With Content',
    value: 'content',
    content: <span data-testid="opt-content">★</span>,
  },
]

describe('OptionsList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('empty state', () => {
    it('should render noOptionsFound text when options array is empty', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={[]}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getByText('No options found')).toBeInTheDocument()
    })
  })

  describe('rendering options', () => {
    it('should render a button with role=option for each item', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getAllByRole('option')).toHaveLength(options.length)
    })

    it('should render the label text for each option', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Disabled')).toBeInTheDocument()
    })

    it('should render the icon for an option with icon prop', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getByTestId('icon-RiHomeLine')).toBeInTheDocument()
    })

    it('should render custom content for an option with content prop', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getByTestId('opt-content')).toBeInTheDocument()
    })
  })

  describe('disabled option', () => {
    it('should mark disabled option with disabled attribute', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      const disabledOption = screen.getByRole('option', { name: 'Disabled' })
      expect(disabledOption).toBeDisabled()
    })

    it('should not call onSelect when a disabled option is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={onSelect}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Act
      await user.click(screen.getByRole('option', { name: 'Disabled' }))

      // Assert
      expect(onSelect).not.toHaveBeenCalled()
    })
  })

  describe('selection behavior', () => {
    it('should call onSelect with the value when an enabled option is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={onSelect}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Act
      await user.click(screen.getByRole('option', { name: 'Option 1' }))

      // Assert
      expect(onSelect).toHaveBeenCalledOnce()
      expect(onSelect).toHaveBeenCalledWith('1')
    })

    it('should mark selected option with aria-selected=true', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={['1']}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute(
        'aria-selected',
        'false',
      )
    })

    it('should call onFocusIndex with enabled index when an option receives focus', () => {
      // Arrange
      const onFocusIndex = vi.fn()
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={onFocusIndex}
          />,
        ),
      )

      // Act — focus Option 2 (index 1 among enabled options)
      act(() => {
        screen.getByRole('option', { name: 'Option 2' }).focus()
      })

      // Assert
      expect(onFocusIndex).toHaveBeenCalledWith(1)
    })

    it('should not call onFocusIndex when a disabled option receives focus', () => {
      // Arrange
      const onFocusIndex = vi.fn()
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple={false}
            onSelect={vi.fn()}
            onFocusIndex={onFocusIndex}
          />,
        ),
      )

      // Act
      act(() => {
        screen.getByRole('option', { name: 'Disabled' }).focus()
      })

      // Assert
      expect(onFocusIndex).not.toHaveBeenCalled()
    })
  })

  describe('multiple mode', () => {
    it('should render check icon for selected options in multiple mode', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={['1']}
            multiple
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.getByTestId('icon-RiCheckLine')).toBeInTheDocument()
    })

    it('should not render check icon when no option is selected in multiple mode', () => {
      // Arrange & Act
      render(
        wrap(
          <OptionsList
            options={options}
            selectedValues={[]}
            multiple
            onSelect={vi.fn()}
            onFocusIndex={vi.fn()}
          />,
        ),
      )

      // Assert
      expect(screen.queryByTestId('icon-RiCheckLine')).not.toBeInTheDocument()
    })
  })
})
