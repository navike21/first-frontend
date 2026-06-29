import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRef } from 'react'

import { SelectDropdownPortal } from './SelectDropdownPortal'
import type { SelectDropdownPortalProps } from './SelectDropdownPortal.types'
import { SelectTextsProvider, DEFAULT_SELECT_TEXTS } from '../../Select.texts'
import type { SelectOptionItem } from '../../Select.types'

vi.mock('@Components/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({ icon }: { icon: string }) => (
    <svg data-testid={`icon-${icon}`} />
  ),
}))

// Render portals inline so they are queryable in the test DOM
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>()
  return { ...actual, createPortal: (node: React.ReactNode) => node }
})

const options: SelectOptionItem[] = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
]

const dropdownStyle: SelectDropdownPortalProps['dropdownStyle'] = {
  top: 100,
  bottom: 200,
  left: 50,
  width: 300,
  openAbove: false,
}

const setup = (overrides?: Partial<SelectDropdownPortalProps>) => {
  const dropdownRef = createRef<HTMLDivElement>()
  const searchInputRef = createRef<HTMLInputElement>()

  const props: SelectDropdownPortalProps = {
    dropdownRef,
    idField: 'test-field',
    multiple: false,
    dropdownStyle,
    search: false,
    searchInputRef,
    searchQuery: '',
    filteredOptions: options,
    selectedValues: [],
    handleOptionSelect: vi.fn(),
    setSearchQuery: vi.fn(),
    setFocusedOptionIndex: vi.fn(),
    ...overrides,
  }

  render(
    <SelectTextsProvider value={DEFAULT_SELECT_TEXTS}>
      <SelectDropdownPortal {...props} />
    </SelectTextsProvider>
  )

  return props
}

describe('SelectDropdownPortal', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('listbox rendering', () => {
    it('should render a listbox with the correct id', () => {
      // Arrange & Act
      setup()

      // Assert
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'id',
        'test-field-listbox'
      )
    })

    it('should set data-position="bottom" when openAbove is false', () => {
      // Arrange & Act
      setup({ dropdownStyle: { ...dropdownStyle, openAbove: false } })

      // Assert
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'data-position',
        'bottom'
      )
    })

    it('should set data-position="top" when openAbove is true', () => {
      // Arrange & Act
      setup({ dropdownStyle: { ...dropdownStyle, openAbove: true } })

      // Assert
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'data-position',
        'top'
      )
    })

    it('should set aria-multiselectable when multiple is true', () => {
      // Arrange & Act
      setup({ multiple: true })

      // Assert
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'aria-multiselectable',
        'true'
      )
    })

    it('should render the filtered options inside the listbox', () => {
      // Arrange & Act
      setup()

      // Assert
      expect(screen.getAllByRole('option')).toHaveLength(options.length)
    })
  })

  describe('search input', () => {
    it('should not render search input when search is false', () => {
      // Arrange & Act
      setup({ search: false })

      // Assert
      expect(screen.queryByLabelText('Search options')).not.toBeInTheDocument()
    })

    it('should render search input when search is true', () => {
      // Arrange & Act
      setup({ search: true })

      // Assert
      expect(screen.getByLabelText('Search options')).toBeInTheDocument()
    })

    it('should render search input with correct placeholder', () => {
      // Arrange & Act
      setup({ search: true })

      // Assert
      expect(screen.getByLabelText('Search options')).toHaveAttribute(
        'placeholder',
        'Search...'
      )
    })

    it('should call setSearchQuery when search input changes', async () => {
      // Arrange
      const user = userEvent.setup()
      const setSearchQuery = vi.fn()
      setup({ search: true, setSearchQuery })

      // Act
      await user.type(screen.getByLabelText('Search options'), 'Al')

      // Assert
      expect(setSearchQuery).toHaveBeenCalled()
    })

    it('should display the current searchQuery value in the input', () => {
      // Arrange & Act
      setup({ search: true, searchQuery: 'Bet' })

      // Assert
      expect(screen.getByLabelText('Search options')).toHaveValue('Bet')
    })
  })
})
