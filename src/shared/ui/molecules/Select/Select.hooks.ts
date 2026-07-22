'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type KeyboardEvent,
} from 'react'
import type { SelectOptionItem } from './Select.types'

interface DropdownStyle {
  top: number
  bottom: number
  left: number
  width: number
  openAbove: boolean
}

const DROPDOWN_MAX_HEIGHT = 248
const SEARCH_BAR_HEIGHT = 52
// A compact trigger (e.g. the flag-only LanguageSwitcher on mobile) is
// narrower than its own option labels — without a floor, the panel would
// inherit that width and clip every option's text.
const DROPDOWN_MIN_WIDTH = 180
const VIEWPORT_MARGIN = 8

interface UseSelectHookProps {
  options: SelectOptionItem[]
  multiple?: boolean
  search?: boolean
  id?: string
  defaultValue?: string | number | ReadonlyArray<string>
  value?: string | number | ReadonlyArray<string>
  disabled?: boolean
}

const normalizeValues = (
  raw: string | number | ReadonlyArray<string> | undefined
): string[] => {
  if (raw === undefined || raw === '') return []
  if (Array.isArray(raw)) return raw.map(String)
  return [String(raw)]
}

export const useSelectHook = (
  {
    options,
    multiple,
    search,
    id,
    defaultValue,
    value,
    disabled,
  }: UseSelectHookProps,
  ref: ForwardedRef<HTMLSelectElement>
) => {
  const generatedId = useId()
  const idField = id ?? generatedId

  const internalRef = useRef<HTMLSelectElement>(null)
  const containerRef = useRef<HTMLFieldSetElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<DropdownStyle>({
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    openAbove: false,
  })
  const [selectedValues, setSelectedValues] = useState<string[]>(() =>
    normalizeValues(value ?? defaultValue)
  )

  // Adjust state during render (React's recommended alternative to an effect
  // for "reset internal state when a prop changes") — avoids the extra
  // effect-triggered render pass. Content-equality check avoids setting a new
  // array reference when the values are the same.
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== undefined) {
      const next = normalizeValues(value)
      setSelectedValues((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next
      )
    }
  }

  // Merged ref: satisfies both internal use and forwarded ref (RHF callback ref)
  /* eslint-disable react-hooks/immutability -- merged-ref pattern: intentional mutation of forwarded object ref */
  const setRef = useCallback(
    (node: HTMLSelectElement | null) => {
      internalRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref !== null && ref !== undefined) {
        ref.current = node
      }
    },
    [ref]
  )
  /* eslint-enable react-hooks/immutability */

  const filteredOptions = useMemo(() => {
    // Never render the empty/placeholder option as a clickable list item —
    // the trigger's placeholder text already communicates the no-selection state.
    const visible = options.filter((o) => o.value !== '')
    if (!search || !searchQuery.trim()) return visible
    return visible.filter((o) =>
      o.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, search, searchQuery])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setSearchQuery('')
    setFocusedOptionIndex(-1)
  }, [])

  const calculateDropdownPosition = useCallback(() => {
    /* v8 ignore next */
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const estimatedHeight =
      DROPDOWN_MAX_HEIGHT + (search ? SEARCH_BAR_HEIGHT : 0)
    const spaceBelow = globalThis.innerHeight - rect.bottom
    const openAbove = spaceBelow < estimatedHeight && rect.top > estimatedHeight

    const width = Math.max(rect.width, DROPDOWN_MIN_WIDTH)
    // Anchor to the trigger's left edge, but pull back if a panel wider than
    // the trigger would overflow past the right edge of the viewport.
    const maxLeft = globalThis.innerWidth - width - VIEWPORT_MARGIN
    const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft))

    setDropdownStyle({
      // When opening below: anchor top edge 4px below trigger bottom
      top: openAbove ? 0 : rect.bottom + 4,
      // When opening above: anchor bottom edge 4px above trigger top
      // CSS `bottom` = distance from viewport bottom = globalThis.innerHeight - rect.top + 4
      bottom: openAbove ? globalThis.innerHeight - rect.top + 4 : 0,
      left,
      width,
      openAbove,
    })
  }, [search])

  const openDropdown = useCallback(() => {
    calculateDropdownPosition()
    setIsOpen(true)
  }, [calculateDropdownPosition])

  const toggleOpen = useCallback(() => {
    if (isOpen) {
      setSearchQuery('')
      setFocusedOptionIndex(-1)
      setIsOpen(false)
    } else {
      openDropdown()
    }
  }, [isOpen, openDropdown])

  const fireNativeChange = useCallback(() => {
    const select = internalRef.current
    /* v8 ignore next */
    if (!select) return
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }, [])

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      const select = internalRef.current
      if (!select) return

      let newValues: string[]

      if (multiple) {
        const prevValues = Array.from(select.selectedOptions).map(
          (o) => o.value
        )
        const alreadySelected = prevValues.includes(optionValue)
        newValues = alreadySelected
          ? prevValues.filter((v) => v !== optionValue)
          : [...prevValues, optionValue]

        Array.from(select.options).forEach((opt) => {
          opt.selected = newValues.includes(opt.value)
        })
      } else {
        select.value = optionValue
        newValues = [optionValue]
        closeDropdown()
      }

      setSelectedValues(newValues)
      fireNativeChange()
    },
    [multiple, closeDropdown, fireNativeChange]
  )

  const handleOptionDeselect = useCallback(
    (optionValue: string) => {
      const select = internalRef.current
      if (!select || !multiple) return

      const prevValues = Array.from(select.selectedOptions).map((o) => o.value)
      const newValues = prevValues.filter((v) => v !== optionValue)

      Array.from(select.options).forEach((opt) => {
        opt.selected = newValues.includes(opt.value)
      })

      setSelectedValues(newValues)
      fireNativeChange()
    },
    [multiple, fireNativeChange]
  )

  // Click-outside → close
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        closeDropdown()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [closeDropdown])

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen && search) {
      searchInputRef.current?.focus()
    }
  }, [isOpen, search])

  // On open, scroll the selected option into view — with a long list it may sit
  // below the visible window, forcing the user to scroll to find it.
  useEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(() => {
      const selected = dropdownRef.current?.querySelector<HTMLElement>(
        'button[data-option][aria-selected="true"]'
      )
      // Optional call: jsdom doesn't implement scrollIntoView.
      selected?.scrollIntoView?.({ block: 'nearest' })
    })
    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  // Arrow key: sync focused option index to DOM focus
  useEffect(() => {
    if (!dropdownRef.current || focusedOptionIndex < 0) return
    const buttons = Array.from(
      dropdownRef.current.querySelectorAll<HTMLButtonElement>(
        'button[data-option]'
      )
    )
    buttons[focusedOptionIndex]?.focus()
  }, [focusedOptionIndex])

  // Recalculate dropdown position on scroll/resize while open
  useEffect(() => {
    if (!isOpen) return
    globalThis.addEventListener('scroll', calculateDropdownPosition, {
      capture: true,
      passive: true,
    })
    globalThis.addEventListener('resize', calculateDropdownPosition, {
      passive: true,
    })
    return () => {
      globalThis.removeEventListener('scroll', calculateDropdownPosition, {
        capture: true,
      })
      globalThis.removeEventListener('resize', calculateDropdownPosition)
    }
  }, [isOpen, calculateDropdownPosition])

  const handleContainerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeDropdown()
        return
      }

      if (!isOpen) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault()
          if (!disabled) openDropdown()
        }
        return
      }

      const enabledOptions = filteredOptions.filter((o) => !o.disabled)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedOptionIndex((prev) =>
          prev < enabledOptions.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedOptionIndex((prev) =>
          prev > 0 ? prev - 1 : enabledOptions.length - 1
        )
      }
    },
    [isOpen, filteredOptions, closeDropdown, disabled, openDropdown]
  )

  const handleContainerBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      // Guard against the portal dropdown: option buttons are in document.body (outside
      // containerRef), so we must also check dropdownRef before closing.
      if (
        !containerRef.current?.contains(e.relatedTarget as Node) &&
        !dropdownRef.current?.contains(e.relatedTarget as Node)
      ) {
        closeDropdown()
      }
    },
    [closeDropdown]
  )

  // Stable handler for the inner combobox div — calls container keydown + stops propagation
  const handleInnerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      handleContainerKeyDown(e)
      e.stopPropagation()
    },
    [handleContainerKeyDown]
  )

  // Pre-computed derived display values
  const isMultipleWithChips = (multiple ?? false) && selectedValues.length > 0
  const singleOption =
    !(multiple ?? false) && selectedValues.length > 0
      ? options.find((o) => o.value === selectedValues[0])
      : undefined
  const singleLabel = singleOption?.label ?? ''

  return {
    idField,
    isOpen,
    toggleOpen,
    closeDropdown,
    searchQuery,
    setSearchQuery,
    filteredOptions,
    selectedValues,
    isMultipleWithChips,
    singleOption,
    singleLabel,
    handleOptionSelect,
    handleOptionDeselect,
    handleContainerKeyDown,
    handleInnerKeyDown,
    handleContainerBlur,
    containerRef,
    triggerRef,
    dropdownStyle,
    setRef,
    dropdownRef,
    searchInputRef,
    focusedOptionIndex,
    setFocusedOptionIndex,
  }
}

export type UseSelectHookReturn = ReturnType<typeof useSelectHook>
export type { SelectProps } from './Select.types'
