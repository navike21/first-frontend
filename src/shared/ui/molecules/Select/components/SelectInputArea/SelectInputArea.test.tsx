import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRef } from 'react'

import { SelectInputArea } from './SelectInputArea'
import type { SelectDropdownPortalProps } from '../SelectDropdownPortal/SelectDropdownPortal'
import type { SelectOptionItem } from '../../Select.types'
import type { IconName } from '@/shared/types/icons'

vi.mock('../../Select.texts', () => ({
  useSelectTexts: () => ({
    noOptionsFound: 'No options found',
    searchPlaceholder: 'Search...',
    searchAriaLabel: 'Search options',
    openOptionsAriaLabel: 'Open options',
    closeOptionsAriaLabel: 'Close options',
  }),
}))

vi.mock('../../helper/getInputAreaClass', () => ({
  getInputAreaClass: () => 'mocked-input-area-class',
}))

vi.mock('@/shared/ui/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({ icon }: { icon: string }) => (
    <svg data-testid={`icon-${icon}`} />
  ),
}))

vi.mock('@/shared/ui/atoms/Spinner/Spinner', () => ({
  Spinner: ({ size }: { size?: string }) => (
    <div data-testid={`spinner-${size ?? 'medium'}`} />
  ),
}))

vi.mock('../SelectedChips/SelectedChips', () => ({
  SelectedChips: ({ values }: { values: string[] }) => (
    <div data-testid="selected-chips">{values.join(',')}</div>
  ),
}))

vi.mock('../TriggerDisplay/TriggerDisplay', () => ({
  TriggerDisplay: ({ singleLabel }: { singleLabel: string }) => (
    <div data-testid="trigger-display">{singleLabel}</div>
  ),
}))

vi.mock('../SelectDropdownPortal/SelectDropdownPortal', () => ({
  SelectDropdownPortal: () => <div data-testid="dropdown-portal" />,
}))

const options: SelectOptionItem[] = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
]

const dropdownStyle: SelectDropdownPortalProps['dropdownStyle'] = {
  top: 100,
  bottom: 0,
  left: 0,
  width: 200,
  openAbove: false,
}

interface SetupOptions {
  isOpen?: boolean
  multiple?: boolean
  loading?: boolean
  mounted?: boolean
  selectedValues?: string[]
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  variantIconDef?: { icon: IconName; className: string }
  onTriggerClick?: () => void
}

const setup = (overrides: SetupOptions = {}) => {
  const triggerRef = createRef<HTMLDivElement>()
  const dropdownRef = createRef<HTMLDivElement>()
  const searchInputRef = createRef<HTMLInputElement>()

  const props = {
    triggerRef,
    disabled: false,
    loading: overrides.loading ?? false,
    isOpen: overrides.isOpen ?? false,
    variant: 'default' as const,
    isMultipleWithChips: false,
    triggerTabIndex: 0,
    onTriggerClick: overrides.onTriggerClick ?? vi.fn(),
    handleInnerKeyDown: vi.fn(),
    selectedValues: overrides.selectedValues ?? [],
    options,
    handleOptionDeselect: vi.fn(),
    singleLabel: 'Option A',
    placeholder: 'Pick an option',
    multiple: overrides.multiple ?? false,
    idField: 'test-select',
    dropdownRef,
    dropdownStyle,
    search: false,
    searchInputRef,
    searchQuery: '',
    setSearchQuery: vi.fn(),
    filteredOptions: options,
    handleOptionSelect: vi.fn(),
    setFocusedOptionIndex: vi.fn(),
    mounted: overrides.mounted ?? true,
    ...(overrides.leftSlot !== undefined && { leftSlot: overrides.leftSlot }),
    ...(overrides.rightSlot !== undefined && {
      rightSlot: overrides.rightSlot,
    }),
    ...(overrides.variantIconDef !== undefined && {
      variantIconDef: overrides.variantIconDef,
    }),
  }

  render(<SelectInputArea {...props} />)
}

describe('SelectInputArea', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('combobox trigger', () => {
    it('should render the combobox trigger element', () => {
      // Arrange & Act
      setup()

      // Assert
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should set aria-expanded to false when closed', () => {
      // Arrange & Act
      setup({ isOpen: false })

      // Assert
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    })

    it('should set aria-expanded to true when open', () => {
      // Arrange & Act
      setup({ isOpen: true })

      // Assert
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'true'
      )
    })

    it('should call onTriggerClick when caret button is clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      const onTriggerClick = vi.fn()
      setup({ onTriggerClick })

      // Act
      await user.click(screen.getByRole('button'))

      // Assert
      expect(onTriggerClick).toHaveBeenCalledTimes(1)
    })

    it('should show "Open options" aria-label on caret button when closed', () => {
      // Arrange & Act
      setup({ isOpen: false })

      // Assert
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Open options'
      )
    })

    it('should show "Close options" aria-label on caret button when open', () => {
      // Arrange & Act
      setup({ isOpen: true })

      // Assert
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Close options'
      )
    })

    it('should render caret down icon when closed', () => {
      // Arrange & Act
      setup({ isOpen: false })

      // Assert
      expect(screen.getByTestId('icon-RiArrowDownSLine')).toBeInTheDocument()
    })

    it('should render caret up icon when open', () => {
      // Arrange & Act
      setup({ isOpen: true })

      // Assert
      expect(screen.getByTestId('icon-RiArrowUpSLine')).toBeInTheDocument()
    })
  })

  describe('slots', () => {
    it('should render leftSlot when provided', () => {
      // Arrange & Act
      setup({ leftSlot: <span data-testid="left-slot">L</span> })

      // Assert
      expect(screen.getByTestId('left-slot')).toBeInTheDocument()
    })

    it('should render rightSlot when provided', () => {
      // Arrange & Act
      setup({ rightSlot: <span data-testid="right-slot">R</span> })

      // Assert
      expect(screen.getByTestId('right-slot')).toBeInTheDocument()
    })

    it('should not render leftSlot when not provided', () => {
      // Arrange & Act
      setup()

      // Assert
      expect(screen.queryByTestId('left-slot')).not.toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('should render spinner when loading is true', () => {
      // Arrange & Act
      setup({ loading: true })

      // Assert
      expect(screen.getByTestId('spinner-small')).toBeInTheDocument()
    })

    it('should not render spinner when loading is false', () => {
      // Arrange & Act
      setup({ loading: false })

      // Assert
      expect(screen.queryByTestId('spinner-small')).not.toBeInTheDocument()
    })
  })

  describe('variant icon', () => {
    it('should render variantIconDef icon when provided', () => {
      // Arrange & Act
      setup({
        variantIconDef: {
          icon: 'RiErrorWarningFill',
          className: 'text-red-500',
        },
      })

      // Assert
      expect(screen.getByTestId('icon-RiErrorWarningFill')).toBeInTheDocument()
    })

    it('should not render variantIconDef when not provided', () => {
      // Arrange & Act
      setup()

      // Assert
      expect(
        screen.queryByTestId('icon-RiErrorWarningFill')
      ).not.toBeInTheDocument()
    })
  })

  describe('multiple selection', () => {
    it('should render SelectedChips when multiple is true', () => {
      // Arrange & Act
      setup({ multiple: true, selectedValues: ['a', 'b'] })

      // Assert
      expect(screen.getByTestId('selected-chips')).toBeInTheDocument()
    })

    it('should not render SelectedChips when multiple is false', () => {
      // Arrange & Act
      setup({ multiple: false })

      // Assert
      expect(screen.queryByTestId('selected-chips')).not.toBeInTheDocument()
    })

    it('should render TriggerDisplay when multiple is true but no values selected', () => {
      // Arrange & Act
      setup({ multiple: true, selectedValues: [] })

      // Assert
      expect(screen.getByTestId('trigger-display')).toBeInTheDocument()
    })

    it('should render TriggerDisplay when multiple is false', () => {
      // Arrange & Act
      setup({ multiple: false })

      // Assert
      expect(screen.getByTestId('trigger-display')).toBeInTheDocument()
    })

    it('should not render TriggerDisplay when multiple is true and values are selected', () => {
      // Arrange & Act
      setup({ multiple: true, selectedValues: ['a'] })

      // Assert
      expect(screen.queryByTestId('trigger-display')).not.toBeInTheDocument()
    })
  })

  describe('dropdown portal', () => {
    it('should render dropdown portal when isOpen and mounted', () => {
      // Arrange & Act
      setup({ isOpen: true, mounted: true })

      // Assert
      expect(screen.getByTestId('dropdown-portal')).toBeInTheDocument()
    })

    it('should not render dropdown portal when closed', () => {
      // Arrange & Act
      setup({ isOpen: false, mounted: true })

      // Assert
      expect(screen.queryByTestId('dropdown-portal')).not.toBeInTheDocument()
    })

    it('should not render dropdown portal when not mounted', () => {
      // Arrange & Act
      setup({ isOpen: true, mounted: false })

      // Assert
      expect(screen.queryByTestId('dropdown-portal')).not.toBeInTheDocument()
    })
  })

  describe('classInput prop (branch coverage)', () => {
    it('should accept classInput prop without error (covers classInput !== undefined true branch)', () => {
      const triggerRef = createRef<HTMLDivElement>()
      const dropdownRef = createRef<HTMLDivElement>()
      const searchInputRef = createRef<HTMLInputElement>()
      render(
        <SelectInputArea
          triggerRef={triggerRef}
          disabled={false}
          loading={false}
          isOpen={false}
          variant="default"
          isMultipleWithChips={false}
          classInput="custom-class"
          triggerTabIndex={0}
          onTriggerClick={vi.fn()}
          handleInnerKeyDown={vi.fn()}
          selectedValues={[]}
          options={options}
          handleOptionDeselect={vi.fn()}
          singleLabel=""
          placeholder="Pick"
          multiple={false}
          idField="test-select"
          dropdownRef={dropdownRef}
          dropdownStyle={dropdownStyle}
          search={false}
          searchInputRef={searchInputRef}
          searchQuery=""
          setSearchQuery={vi.fn()}
          filteredOptions={options}
          handleOptionSelect={vi.fn()}
          setFocusedOptionIndex={vi.fn()}
          mounted={true}
        />
      )
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
  })
})
