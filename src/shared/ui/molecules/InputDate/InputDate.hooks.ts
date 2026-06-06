import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useLanguageStore } from '@/shared/model/language.store'
import type { InputDateProps, InputDateTexts } from './InputDate.types'
import {
  DATE_FNS_LOCALES,
  DATE_DISPLAY_FORMATS,
  DATE_SHORT_FORMATS,
  MONTH_DISPLAY_FORMATS,
  INPUT_DATE_TEXTS,
} from './InputDate.i18n'
import {
  parseToDate,
  dateToISO,
  monthToISO,
  yearToISO,
  buildDisabledMatcher,
  getYearPage,
  todayDate,
} from './InputDate.utils'

const DROPDOWN_HEIGHT = 380

const fireNativeChange = (el: HTMLInputElement | null, value: string) => {
  if (!el) return
  // Use native setter to bypass React's controlled-input guard
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

export const useInputDate = (
  {
    mode = 'date',
    lang,
    texts,
    minDate,
    maxDate,
    displayFormat,
    value,
    defaultValue,
    fromInput,
    toInput,
    name,
  }: InputDateProps,
  forwardedRef: React.ForwardedRef<HTMLInputElement>
) => {
  const generated = useId()
  const idField = name ?? generated

  // ── i18n ────────────────────────────────────────────────────────────────────
  const storeLang = useLanguageStore((state) => state.language)
  const activeLang = lang ?? storeLang
  const locale = DATE_FNS_LOCALES[activeLang]

  const mergedTexts: InputDateTexts = { ...INPUT_DATE_TEXTS[activeLang], ...texts }

  const effectiveDisplayFormat =
    displayFormat ??
    (mode === 'month'
      ? MONTH_DISPLAY_FORMATS[activeLang]
      : mode === 'year'
        ? 'yyyy'
        : DATE_DISPLAY_FORMATS[activeLang])

  // ── State ────────────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false)
  // Drill-down view — only used when mode is 'date' or 'dateRange'
  const [calendarView, setCalendarView] = useState<'day' | 'month' | 'year'>('day')

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
    parseToDate(value ?? (defaultValue as string | undefined))
  )
  const [selectedRange, setSelectedRange] = useState<DateRange>({})

  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    return parseToDate(value ?? (defaultValue as string | undefined)) ?? todayDate()
  })

  const [yearPageCenter, setYearPageCenter] = useState<number>(() => {
    const d = parseToDate(value ?? (defaultValue as string | undefined))
    return d ? d.getFullYear() : todayDate().getFullYear()
  })

  // ── Refs ─────────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Internal ref for the single-mode hidden input (merged with forwardedRef)
  const internalHiddenRef = useRef<HTMLInputElement>(null)

  // Merged ref — satisfies both internal dispatch and RHF's forwarded ref
  const setHiddenRef = useCallback(
    (node: HTMLInputElement | null) => {
      internalHiddenRef.current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef !== null && forwardedRef !== undefined) {
        // eslint-disable-next-line react-hooks/immutability -- merged-ref pattern
        ;(forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      }
    },
    [forwardedRef]
  )

  // Internal refs for range from/to hidden inputs (merged with fromInput/toInput refs)
  const fromInternalRef = useRef<HTMLInputElement>(null)
  const toInternalRef = useRef<HTMLInputElement>(null)

  const setFromRef = useCallback(
    (node: HTMLInputElement | null) => {
      fromInternalRef.current = node
      fromInput?.ref?.(node)
    },
    [fromInput]
  )

  const setToRef = useCallback(
    (node: HTMLInputElement | null) => {
      toInternalRef.current = node
      toInput?.ref?.(node)
    },
    [toInput]
  )

  // ── Dropdown positioning (mirrors Select pattern) ────────────────────────────
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    openAbove: false,
  })

  const calculateDropdownPosition = useCallback(() => {
    /* v8 ignore next */
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = globalThis.innerHeight - rect.bottom
    const openAbove = spaceBelow < DROPDOWN_HEIGHT && rect.top > DROPDOWN_HEIGHT
    setDropdownStyle({
      top: openAbove ? 0 : rect.bottom + 4,
      bottom: openAbove ? globalThis.innerHeight - rect.top + 4 : 0,
      left: rect.left,
      width: rect.width,
      openAbove,
    })
  }, [])

  const openDropdown = useCallback(() => {
    calculateDropdownPosition()
    setIsOpen(true)
  }, [calculateDropdownPosition])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setCalendarView('day')
  }, [])

  const toggleOpen = useCallback(() => {
    if (isOpen) closeDropdown()
    else openDropdown()
  }, [isOpen, openDropdown, closeDropdown])

  // ── Selection handlers ───────────────────────────────────────────────────────
  const handleSelectDate = useCallback(
    (date: Date | undefined) => {
      if (!date) return
      setSelectedDate(date)
      setDisplayMonth(date)
      fireNativeChange(internalHiddenRef.current, dateToISO(date))
      closeDropdown()
    },
    [closeDropdown]
  )

  const handleSelectMonth = useCallback(
    (year: number, month: number) => {
      // month is 0-indexed; build ISO without new Date()
      const iso = `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-01`
      const d = parseToDate(iso)
      if (!d) return
      setSelectedDate(d)
      fireNativeChange(internalHiddenRef.current, monthToISO(d))
      closeDropdown()
    },
    [closeDropdown]
  )

  const handleSelectYear = useCallback(
    (year: number) => {
      const iso = yearToISO(year)
      const d = parseToDate(iso)
      if (!d) return
      setSelectedDate(d)
      fireNativeChange(internalHiddenRef.current, iso)
      closeDropdown()
    },
    [closeDropdown]
  )

  // ── Drill-down navigation (only for mode='date' / 'dateRange') ──────────────
  // Select year from year-grid → navigate to month view for that year
  const handleDrillSelectYear = useCallback((year: number) => {
    setYearPageCenter(year)
    const iso = `${String(year).padStart(4, '0')}-01-01`
    const d = parseToDate(iso)
    if (d) setDisplayMonth(d)
    setCalendarView('month')
  }, [])

  // Select month from month-grid → navigate to day calendar for that month
  const handleDrillSelectMonth = useCallback((year: number, month: number) => {
    const iso = `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-01`
    const d = parseToDate(iso)
    if (d) setDisplayMonth(d)
    setCalendarView('day')
  }, [])

  const handleSelectRange = useCallback(
    (range: DateRange | undefined) => {
      const next = range ?? {}
      setSelectedRange(next)

      if (next.from) {
        const fromISO = dateToISO(next.from)
        fireNativeChange(fromInternalRef.current, fromISO)
      }
      if (next.to) {
        const toISO = dateToISO(next.to)
        fireNativeChange(toInternalRef.current, toISO)
        closeDropdown()
      }
    },
    [closeDropdown]
  )

  const handleClear = useCallback(() => {
    setSelectedDate(undefined)
    setSelectedRange({})
    fireNativeChange(internalHiddenRef.current, '')
    fireNativeChange(fromInternalRef.current, '')
    fireNativeChange(toInternalRef.current, '')
  }, [])

  const handleToday = useCallback(() => {
    const t = todayDate()
    const iso = dateToISO(t)
    setSelectedDate(t)
    setDisplayMonth(t)
    fireNativeChange(internalHiddenRef.current, iso)
    closeDropdown()
  }, [closeDropdown])

  // ── Sync controlled value ────────────────────────────────────────────────────
  useEffect(() => {
    if (value !== undefined) {
      const d = parseToDate(value)
      setSelectedDate(d)
      if (d) {
        setDisplayMonth(d)
        setYearPageCenter(d.getFullYear())
      }
    }
  }, [value])

  // ── Click-outside → close ────────────────────────────────────────────────────
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return
      closeDropdown()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [closeDropdown])

  // ── Recalculate position on scroll/resize while open ─────────────────────────
  useEffect(() => {
    if (!isOpen) return
    globalThis.addEventListener('scroll', calculateDropdownPosition, {
      capture: true,
      passive: true,
    })
    globalThis.addEventListener('resize', calculateDropdownPosition, { passive: true })
    return () => {
      globalThis.removeEventListener('scroll', calculateDropdownPosition, { capture: true })
      globalThis.removeEventListener('resize', calculateDropdownPosition)
    }
  }, [isOpen, calculateDropdownPosition])

  // ── Derived display values ───────────────────────────────────────────────────
  const displayValue = selectedDate
    ? format(selectedDate, effectiveDisplayFormat, { locale })
    : ''

  const shortFmt = DATE_SHORT_FORMATS[activeLang]
  const rangeDisplayFrom = selectedRange.from
    ? format(selectedRange.from, shortFmt, { locale })
    : ''
  const rangeDisplayTo = selectedRange.to
    ? format(selectedRange.to, shortFmt, { locale })
    : ''

  const disabledMatcher = buildDisabledMatcher(minDate, maxDate)
  const yearPage = getYearPage(yearPageCenter)

  return {
    idField,
    locale,
    mergedTexts,
    effectiveDisplayFormat,
    isOpen,
    toggleOpen,
    closeDropdown,
    calendarView,
    setCalendarView,
    handleDrillSelectYear,
    handleDrillSelectMonth,
    selectedDate,
    selectedRange,
    displayMonth,
    setDisplayMonth,
    yearPage,
    yearPageCenter,
    setYearPageCenter,
    displayValue,
    rangeDisplayFrom,
    rangeDisplayTo,
    containerRef,
    triggerRef,
    dropdownRef,
    setHiddenRef,
    setFromRef,
    setToRef,
    dropdownStyle,
    disabledMatcher,
    handleSelectDate,
    handleSelectMonth,
    handleSelectYear,
    handleSelectRange,
    handleClear,
    handleToday,
    minDate,
    maxDate,
  }
}
