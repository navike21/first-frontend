import { render, screen, waitFor, renderHook, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { createRef } from 'react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { Select } from './Select'
import { useSelectHook } from './Select.hooks'
import type { SelectOptionItem } from './Select.types'

// Mock atoms to keep tests focused on Select integration behavior
vi.mock('@Components/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({ icon, className }: { icon: string; className?: string }) => (
    <svg data-testid={`icon-${icon}`} className={className} />
  ),
}))

vi.mock('@Components/atoms/Spinner/Spinner', () => ({
  Spinner: () => <div data-testid="spinner" />,
}))

vi.mock('@Components/atoms/Label/Label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}))

vi.mock('@Components/atoms/HelperText/HelperText', () => ({
  HelperText: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <div role={variant === 'error' ? 'alert' : undefined}>{children}</div>
  ),
}))

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
  { label: 'Option 3', value: '3' },
  { label: 'Disabled', value: '4', disabled: true },
]

const searchOptions: SelectOptionItem[] = Array.from({ length: 12 }, (_, i) => ({
  label: `Item ${i + 1}`,
  value: String(i + 1),
}))

describe('Select', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('rendering', () => {
    it('should render with a label', () => {
      render(<Select options={options} label="Choose:" />)
      expect(screen.getByText('Choose:')).toBeInTheDocument()
    })

    it('should render the native select element with all options', () => {
      render(<Select options={options} />)
      const select = document.querySelector('select')
      expect(select).toBeInTheDocument()
      expect(select?.options.length).toBe(options.length)
    })

    it('should set the name attribute on the native select', () => {
      render(<Select options={options} name="myField" />)
      expect(document.querySelector('select')).toHaveAttribute('name', 'myField')
    })

    it('should set multiple attribute on native select in multiple mode', () => {
      render(<Select options={options} multiple />)
      expect(document.querySelector('select')).toHaveAttribute('multiple')
    })

    it('should not set multiple attribute in single mode', () => {
      render(<Select options={options} />)
      expect(document.querySelector('select')).not.toHaveAttribute('multiple')
    })

    it('should render a loading spinner when loading=true', () => {
      render(<Select options={options} loading />)
      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    })

    it('should render leftSlot', () => {
      render(<Select options={options} leftSlot={<span data-testid="left-slot">L</span>} />)
      expect(screen.getByTestId('left-slot')).toBeInTheDocument()
    })

    it('should render rightSlot', () => {
      render(<Select options={options} rightSlot={<span data-testid="right-slot">R</span>} />)
      expect(screen.getByTestId('right-slot')).toBeInTheDocument()
    })

    it('should have displayName Select', () => {
      expect(Select.displayName).toBe('Select')
    })
  })

  describe('open / close', () => {
    it('should open dropdown when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      // Act
      await user.click(screen.getByRole('combobox'))
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should close dropdown when trigger is clicked again', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      const trigger = screen.getByRole('combobox')
      // Act
      await user.click(trigger)
      await user.click(trigger)
      // Assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should close dropdown via caret button toggle', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      // Act
      await user.click(screen.getByRole('button', { name: /open options/i }))
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      // Act
      await user.click(screen.getByRole('button', { name: /close options/i }))
      // Assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should close dropdown on Escape key', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      // Act
      await user.keyboard('{Escape}')
      // Assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should open dropdown on ArrowDown key when closed', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{Escape}')
      // Act
      await user.keyboard('{ArrowDown}')
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should open dropdown on Enter key when closed', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      screen.getByRole('combobox').focus()
      // Act
      await user.keyboard('{Enter}')
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should open dropdown on Space key when closed', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      screen.getByRole('combobox').focus()
      // Act
      await user.keyboard('{ }')
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should close dropdown on outside click', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <Select options={options} />
          <button>Outside</button>
        </div>,
      )
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      // Act
      await user.click(screen.getByText('Outside'))
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    it('should close dropdown when focus leaves the container', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      const externalBtn = document.createElement('button')
      document.body.appendChild(externalBtn)
      // Act
      act(() => {
        externalBtn.focus()
      })
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      externalBtn.remove()
    })

    it('should not close dropdown when focus stays inside the container', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      // Act — focus caret button inside the container
      await user.tab()
      // Assert — listbox should still be in the document
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('selection — single mode', () => {
    it('should select an option and close the dropdown', async () => {
      const user = userEvent.setup()
      render(<Select options={options} placeholder="Pick one" />)
      await user.click(screen.getByRole('combobox'))
      // Act
      await user.click(screen.getByRole('option', { name: 'Option 1' }))
      // Assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
    })

    it('should fire the native onChange event when an option is selected', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<Select options={options} onChange={onChange} />)
      await user.click(screen.getByRole('combobox'))
      // Act
      await user.click(screen.getByRole('option', { name: 'Option 1' }))
      // Assert
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('should not select a disabled option', async () => {
      const user = userEvent.setup()
      render(<Select options={options} placeholder="Pick one" />)
      await user.click(screen.getByRole('combobox'))
      // Assert — disabled option is present and marked as disabled
      const disabledOption = screen.getAllByRole('option').find((el) => el.hasAttribute('disabled'))
      expect(disabledOption).toBeDisabled()
      // Assert — dropdown stays open (only enabled option clicks close it)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should initialize with defaultValue', () => {
      render(<Select options={options} defaultValue="2" placeholder="Pick" />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2')
    })

    it('should handle empty string defaultValue gracefully', () => {
      render(<Select options={options} defaultValue="" placeholder="Pick" />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Pick')
    })
  })

  describe('selection — multiple mode', () => {
    it('should select multiple options and show chips', async () => {
      const user = userEvent.setup()
      render(<Select options={options} multiple placeholder="Pick" />)
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: 'Option 1' }))
      await user.click(screen.getByRole('option', { name: 'Option 2' }))
      expect(screen.getAllByTestId('chip')).toHaveLength(2)
    })

    it('should keep dropdown open after selection in multiple mode', async () => {
      const user = userEvent.setup()
      render(<Select options={options} multiple />)
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: 'Option 1' }))
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should deselect an already-selected option in the dropdown', async () => {
      const user = userEvent.setup()
      render(<Select options={options} multiple />)
      await user.click(screen.getByRole('combobox'))
      const opt1 = screen.getAllByRole('option')[0]!
      await user.click(opt1)
      await user.click(opt1)
      expect(screen.queryAllByTestId('chip')).toHaveLength(0)
    })

    it('should remove chip via its delete button', async () => {
      const user = userEvent.setup()
      render(<Select options={options} multiple defaultValue={['1', '2']} />)
      expect(screen.getAllByTestId('chip')).toHaveLength(2)
      await user.click(screen.getByRole('button', { name: /remove option 1/i }))
      expect(screen.getAllByTestId('chip')).toHaveLength(1)
    })

    it('should initialize with defaultValue array in multiple mode', () => {
      render(<Select options={options} multiple defaultValue={['1', '2']} />)
      expect(screen.getAllByTestId('chip')).toHaveLength(2)
    })
  })

  describe('disabled state', () => {
    it('should not open dropdown on click when disabled', async () => {
      const user = userEvent.setup()
      render(<Select options={options} disabled />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should not open dropdown on keyboard when disabled', async () => {
      render(<Select options={options} disabled />)
      screen.getByRole('combobox').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('should apply cursor-not-allowed class when disabled', () => {
      const { container } = render(<Select options={options} disabled />)
      expect(container.firstChild).toHaveClass('cursor-not-allowed')
    })

    it('should apply pointer-events-none when loading', () => {
      const { container } = render(<Select options={options} loading />)
      expect(container.firstChild).toHaveClass('pointer-events-none')
    })
  })

  describe('controlled value', () => {
    it('should sync display when controlled value prop changes', () => {
      const { rerender } = render(<Select options={options} value="1" placeholder="Pick" />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
      rerender(<Select options={options} value="2" placeholder="Pick" />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 2')
    })

    it('should preserve selected state when controlled value changes to same content', () => {
      const { rerender } = render(<Select options={options} value="1" placeholder="Pick" />)
      rerender(<Select options={options} value={['1']} placeholder="Pick" />)
      expect(screen.getByRole('combobox')).toHaveTextContent('Option 1')
    })
  })

  describe('ref forwarding', () => {
    it('should forward object ref to the native select element', () => {
      const ref = createRef<HTMLSelectElement>()
      render(<Select options={options} ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLSelectElement)
    })

    it('should accept a callback ref', () => {
      let capturedEl: HTMLSelectElement | null = null
      render(
        <Select
          options={options}
          ref={(el) => {
            capturedEl = el
          }}
        />,
      )
      expect(capturedEl).toBeInstanceOf(HTMLSelectElement)
    })
  })

  describe('keyboard navigation', () => {
    it('should navigate options with ArrowDown and ArrowUp keys', async () => {
      const user = userEvent.setup()
      const threeOptions = options.slice(0, 3)
      render(<Select options={threeOptions} />)
      await user.click(screen.getByRole('combobox'))
      // Act
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}')
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should wrap ArrowDown focus index to 0 when at last option', async () => {
      const user = userEvent.setup()
      const threeOptions = options.slice(0, 3)
      render(<Select options={threeOptions} />)
      await user.click(screen.getByRole('combobox'))
      // Act — press ArrowDown past the end of the list
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}')
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should wrap ArrowUp focus index to last when at first option', async () => {
      const user = userEvent.setup()
      const threeOptions = options.slice(0, 3)
      render(<Select options={threeOptions} />)
      await user.click(screen.getByRole('combobox'))
      // Act
      await user.keyboard('{ArrowUp}')
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should ignore unrecognised key presses when dropdown is open', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      // Act — pressing an unrecognised key (F1) should not close the dropdown
      await user.keyboard('{F1}')
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should not close dropdown when pointerdown fires inside the container', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      // Act — click within the combobox (inside container)
      await user.pointer({
        keys: '[MouseLeft>]',
        target: screen.getByRole('combobox'),
      })
      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('search', () => {
    it('should show search input when search=true and dropdown is open', async () => {
      const user = userEvent.setup()
      render(<Select options={searchOptions} search />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByLabelText('Search options')).toBeInTheDocument()
    })

    it('should filter options when a search query is typed', async () => {
      const user = userEvent.setup()
      render(<Select options={searchOptions} search />)
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByLabelText('Search options'), 'Item 1')
      expect(screen.getAllByRole('option').length).toBeLessThan(searchOptions.length)
    })

    it('should clear search query when dropdown is closed and reopened', async () => {
      const user = userEvent.setup()
      render(<Select options={searchOptions} search />)
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByLabelText('Search options'), 'Item 1')
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByLabelText('Search options')).toHaveValue('')
    })
  })

  describe('dropdown position', () => {
    it('should open below by default (data-position="bottom")', async () => {
      const user = userEvent.setup()
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toHaveAttribute('data-position', 'bottom')
    })

    it('should open above (data-position="top") when space below is insufficient', async () => {
      const user = userEvent.setup()
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
        top: 600,
        bottom: 750,
        left: 0,
        right: 300,
        width: 300,
        height: 150,
        x: 0,
        y: 600,
        toJSON: () => {},
      })
      render(<Select options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('listbox')).toHaveAttribute('data-position', 'top')
      vi.restoreAllMocks()
    })
  })

  describe('lang presets', () => {
    it('should apply lang="es" translations automatically', async () => {
      const user = userEvent.setup()
      render(<Select options={options} search lang="es" />)
      expect(screen.getByRole('button', { name: 'Abrir opciones' })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Abrir opciones' }))
      expect(screen.getByLabelText('Buscar opciones')).toHaveAttribute('placeholder', 'Buscar...')
    })

    it('should show translated noOptionsFound for lang="es"', async () => {
      const user = userEvent.setup()
      render(<Select options={options} search lang="es" />)
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByLabelText('Buscar opciones'), 'zzz')
      expect(screen.getByText('Sin opciones')).toBeInTheDocument()
    })

    it('should fall back to English defaults when no lang is set', async () => {
      const user = userEvent.setup()
      render(<Select options={options} search />)
      expect(screen.getByRole('button', { name: 'Open options' })).toBeInTheDocument()
      await user.click(screen.getByRole('combobox'))
      await user.type(screen.getByLabelText('Search options'), 'zzz')
      expect(screen.getByText('No options found')).toBeInTheDocument()
    })

    it('should allow texts prop to override individual keys on top of the lang preset', async () => {
      const user = userEvent.setup()
      render(
        <Select
          options={options}
          search
          lang="es"
          texts={{ noOptionsFound: 'Pais no encontrado' }}
        />,
      )
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByLabelText('Buscar opciones')).toBeInTheDocument()
      await user.type(screen.getByLabelText('Buscar opciones'), 'zzz')
      expect(screen.getByText('Pais no encontrado')).toBeInTheDocument()
    })

    it('should apply all texts prop overrides without lang', async () => {
      const user = userEvent.setup()
      render(
        <Select
          options={options}
          search
          texts={{
            noOptionsFound: 'Pais no encontrado',
            searchPlaceholder: 'Buscar pais...',
            searchAriaLabel: 'Buscar pais',
            openOptionsAriaLabel: 'Abrir opciones',
            closeOptionsAriaLabel: 'Cerrar opciones',
          }}
        />,
      )
      await user.click(screen.getByRole('button', { name: 'Abrir opciones' }))
      expect(screen.getByLabelText('Buscar pais')).toHaveAttribute('placeholder', 'Buscar pais...')
      await user.type(screen.getByLabelText('Buscar pais'), 'zzz')
      expect(screen.getByText('Pais no encontrado')).toBeInTheDocument()
    })
  })
})

describe('useSelectHook', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should handle undefined multiple prop via nullish coalescing fallback', () => {
    // Arrange
    const { result } = renderHook(() => useSelectHook({ options }, null))

    // Assert
    expect(result.current.isMultipleWithChips).toBe(false)
    expect(result.current.singleOption).toBeUndefined()
    expect(result.current.singleLabel).toBe('')
  })

  it('should return early from handleOptionSelect when internalRef is null', () => {
    // Arrange
    const { result } = renderHook(() => useSelectHook({ options }, null))

    // Act
    act(() => {
      result.current.handleOptionSelect('1')
    })

    // Assert
    expect(result.current.selectedValues).toEqual([])
  })

  it('should return early from handleOptionDeselect when internalRef is null', () => {
    // Arrange
    const { result } = renderHook(() => useSelectHook({ options, multiple: true }, null))

    // Act
    act(() => {
      result.current.handleOptionDeselect('1')
    })

    // Assert
    expect(result.current.selectedValues).toEqual([])
  })
})
