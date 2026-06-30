import clsx from 'clsx'
import { createPortal } from 'react-dom'
import { forwardRef } from 'react'
import { useMounted } from '@/shared/lib'
import { Label } from '../../atoms/Label/Label'
import { HelperText } from '../../atoms/HelperText/HelperText'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Spinner } from '../../atoms/Spinner/Spinner'
import type { InputDateProps, InputDateVariant } from './InputDate.types'
import { useInputDate } from './InputDate.hooks'
import { CalendarSingle } from './calendar/CalendarSingle'
import { CalendarRange } from './calendar/CalendarRange'
import { CalendarMonth } from './calendar/CalendarMonth'
import { CalendarYear } from './calendar/CalendarYear'

const VARIANT_RING: Record<InputDateVariant, string> = {
  default: 'ring-border',
  success: 'ring-emerald-500',
  error: 'ring-red-500',
  warning: 'ring-yellow-500',
}

const VARIANT_ICON: Record<InputDateVariant, string | null> = {
  default: null,
  success: 'RiCheckboxCircleFill',
  error: 'RiErrorWarningFill',
  warning: 'RiErrorWarningFill',
}

const VARIANT_ICON_COLOR: Record<InputDateVariant, string> = {
  default: '',
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
}

/** Resolves the label shown in the trigger for both single and range modes. */
function computeTriggerText(args: {
  isRange: boolean
  displayValue: string | undefined
  rangeDisplayFrom: string | undefined
  rangeDisplayTo: string | undefined
  fallback: string
}): string {
  const { isRange, displayValue, rangeDisplayFrom, rangeDisplayTo, fallback } =
    args
  if (!isRange) return displayValue || fallback
  if (rangeDisplayFrom || rangeDisplayTo) {
    return `${rangeDisplayFrom || '—'} → ${rangeDisplayTo || '—'}`
  }
  return fallback
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
  (
    {
      mode = 'date',
      label,
      helperText,
      errorMessage,
      variant = 'default',
      loading = false,
      disabled = false,
      placeholder,
      leftSlot,
      rightSlot,
      className,
      classInput,
      fromInput,
      toInput,
      minDate,
      maxDate,
      displayFormat,
      lang,
      texts,
      name,
      value,
      defaultValue,
      onChange,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const {
      idField,
      locale,
      mergedTexts,
      isOpen,
      toggleOpen,
      selectedDate,
      selectedRange,
      displayMonth,
      setDisplayMonth,
      yearPage,
      setYearPageCenter,
      calendarView,
      setCalendarView,
      handleDrillSelectYear,
      handleDrillSelectMonth,
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
    } = useInputDate(
      {
        mode,
        lang,
        texts,
        minDate,
        maxDate,
        displayFormat,
        value: value as string | undefined,
        defaultValue: defaultValue as string | undefined,
        fromInput,
        toInput,
        name,
        disabled,
      },
      ref
    )

    const mounted = useMounted()
    const isRange = mode === 'dateRange'
    const hasValue = isRange
      ? !!(rangeDisplayFrom || rangeDisplayTo)
      : !!displayValue

    const variantIcon = loading ? null : VARIANT_ICON[variant]

    const triggerText = computeTriggerText({
      isRange,
      displayValue,
      rangeDisplayFrom,
      rangeDisplayTo,
      fallback: placeholder ?? mergedTexts.placeholder,
    })

    const isPlaceholder = !hasValue

    return (
      <div
        ref={containerRef}
        className={clsx('relative flex flex-col gap-1', className)}
      >
        {label && (
          <Label disabled={disabled} htmlFor={idField}>
            {label}
          </Label>
        )}

        {/* ── Trigger ──────────────────────────────────────────────────── */}
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls={isOpen ? `${idField}-dropdown` : undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={disabled || loading ? undefined : toggleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled && !loading) toggleOpen()
            }
            if (e.key === 'Escape') toggleOpen()
          }}
          className={clsx(
            'content-input',
            'flex h-10 w-full items-center',
            'rounded-sm select-none',
            'duration-fast ease-out-expo transition-all',
            'focus-within:ring-2',
            {
              'bg-slate-400/50 dark:bg-slate-600/50': disabled,
              'bg-surface ring-1 ring-inset': !disabled,
              'pointer-events-none': loading,
            },
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            !disabled && 'outline-none',
            !disabled && 'focus:ring-2',
            !disabled && VARIANT_RING[variant],
            classInput
          )}
        >
          {/* Left slot */}
          {leftSlot && (
            <div className="flex h-10 min-w-10 items-center justify-center px-3 text-foreground">
              {leftSlot}
            </div>
          )}

          {/* Calendar icon (default left icon when no leftSlot) */}
          {!leftSlot && (
            <div className="flex h-10 min-w-10 items-center justify-center">
              <IconComponent
                icon="RiCalendarLine"
                className="size-5 text-secondary"
              />
            </div>
          )}

          {/* Display text */}
          <span
            className={clsx('flex-1 truncate text-sm', {
              'text-muted': isPlaceholder,
              'text-foreground': !isPlaceholder && !disabled,
              'text-secondary': !isPlaceholder && disabled,
              'pl-4': leftSlot,
            })}
          >
            {triggerText}
          </span>

          {/* Clear button */}
          {hasValue && !disabled && !loading && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className={clsx(
                'flex h-10 min-w-8 items-center justify-center',
                'text-muted',
                'duration-fast ease-out-expo transition-all',
                'hover:text-secondary'
              )}
            >
              <IconComponent icon="RiCloseLine" className="size-4" />
            </button>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="mr-3 min-w-5">
              <Spinner variant="gradient" size="small" />
            </div>
          )}

          {/* Variant icon */}
          {variantIcon && (
            <div className="mr-3 min-w-5">
              <IconComponent
                icon={
                  variantIcon as Parameters<typeof IconComponent>[0]['icon']
                }
                className={clsx('size-5', VARIANT_ICON_COLOR[variant])}
              />
            </div>
          )}

          {/* Right slot */}
          {rightSlot && !loading && !variantIcon && (
            <div className="flex h-10 items-center justify-center px-3">
              {rightSlot}
            </div>
          )}
        </div>

        {/* ── Error / helper text ───────────────────────────────────────── */}
        {errorMessage && variant === 'error' && (
          <HelperText
            idField={idField}
            variant="error"
            className="absolute -bottom-5 left-0"
          >
            {errorMessage}
          </HelperText>
        )}
        {helperText && variant !== 'error' && (
          <HelperText
            idField={idField}
            variant={variant}
            className="absolute top-[calc(100%+4px)] left-0"
          >
            {helperText}
          </HelperText>
        )}

        {/* ── Hidden inputs for RHF ────────────────────────────────────────
             Single mode: one hidden input bound via forwardRef + name.
             Range mode:  two hidden inputs bound via fromInput / toInput.   */}
        {/* type="text" + sr-only: React fires synthetic onChange on native `input` events,
             which fireNativeChange triggers — type="hidden" no garantiza esto en RHF */}
        {!isRange && (
          <input
            ref={setHiddenRef}
            type="text"
            id={idField}
            name={name}
            defaultValue={defaultValue as string | undefined}
            onChange={onChange}
            onBlur={onBlur}
            tabIndex={-1}
            aria-hidden="true"
            readOnly
            className="sr-only"
            {...rest}
          />
        )}
        {isRange && (
          <>
            <input
              ref={setFromRef}
              type="text"
              name={fromInput?.name}
              onChange={fromInput?.onChange}
              onBlur={fromInput?.onBlur}
              tabIndex={-1}
              aria-hidden="true"
              readOnly
              className="sr-only"
            />
            <input
              ref={setToRef}
              type="text"
              name={toInput?.name}
              onChange={toInput?.onChange}
              onBlur={toInput?.onBlur}
              tabIndex={-1}
              aria-hidden="true"
              readOnly
              className="sr-only"
            />
          </>
        )}

        {/* ── Dropdown portal ──────────────────────────────────────────────── */}
        {mounted &&
          isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              id={`${idField}-dropdown`}
              role="dialog"
              aria-modal="true"
              style={
                dropdownStyle.openAbove
                  ? {
                      position: 'fixed',
                      bottom: dropdownStyle.bottom,
                      left: dropdownStyle.left,
                      zIndex: 9999,
                    }
                  : {
                      position: 'fixed',
                      top: dropdownStyle.top,
                      left: dropdownStyle.left,
                      zIndex: 9999,
                    }
              }
              className={clsx(
                'overflow-hidden rounded-md bg-surface shadow-lg',
                'ring-1 ring-border',
                'animate-dropdown-in'
              )}
            >
              {/* Calendar body */}
              <div className="p-1">
                {/* ── mode='date' — drill-down: day → month → year ── */}
                {mode === 'date' && calendarView === 'day' && (
                  <CalendarSingle
                    selected={selectedDate}
                    onSelect={handleSelectDate}
                    displayMonth={displayMonth}
                    onMonthChange={setDisplayMonth}
                    disabled={
                      disabledMatcher.length > 0 ? disabledMatcher : undefined
                    }
                    locale={locale}
                    onMonthLabelClick={() => setCalendarView('month')}
                    onYearLabelClick={(year) => {
                      setYearPageCenter(year)
                      setCalendarView('year')
                    }}
                  />
                )}
                {mode === 'date' && calendarView === 'month' && (
                  <CalendarMonth
                    selected={selectedDate}
                    onSelect={handleDrillSelectMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale={locale}
                    onYearLabelClick={() => setCalendarView('year')}
                    displayYear={displayMonth.getFullYear()}
                  />
                )}
                {mode === 'date' && calendarView === 'year' && (
                  <CalendarYear
                    selected={selectedDate}
                    yearPage={yearPage}
                    onPageChange={setYearPageCenter}
                    onSelect={handleDrillSelectYear}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                )}

                {/* ── mode='dateRange' — mismo drill-down ── */}
                {mode === 'dateRange' && calendarView === 'day' && (
                  <CalendarRange
                    selected={selectedRange}
                    onSelect={handleSelectRange}
                    displayMonth={displayMonth}
                    onMonthChange={setDisplayMonth}
                    disabled={
                      disabledMatcher.length > 0 ? disabledMatcher : undefined
                    }
                    locale={locale}
                    onMonthLabelClick={() => setCalendarView('month')}
                    onYearLabelClick={(year) => {
                      setYearPageCenter(year)
                      setCalendarView('year')
                    }}
                  />
                )}
                {mode === 'dateRange' && calendarView === 'month' && (
                  <CalendarMonth
                    selected={selectedDate}
                    onSelect={handleDrillSelectMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale={locale}
                    onYearLabelClick={() => setCalendarView('year')}
                    displayYear={displayMonth.getFullYear()}
                  />
                )}
                {mode === 'dateRange' && calendarView === 'year' && (
                  <CalendarYear
                    selected={selectedDate}
                    yearPage={yearPage}
                    onPageChange={setYearPageCenter}
                    onSelect={handleDrillSelectYear}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                )}

                {/* ── mode='month' / 'year' — sin drill-down, standalone ── */}
                {mode === 'month' && (
                  <CalendarMonth
                    selected={selectedDate}
                    onSelect={handleSelectMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale={locale}
                  />
                )}
                {mode === 'year' && (
                  <CalendarYear
                    selected={selectedDate}
                    yearPage={yearPage}
                    onPageChange={setYearPageCenter}
                    onSelect={handleSelectYear}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                )}
              </div>

              {/* Footer */}
              {(mode === 'date' || mode === 'month') && (
                <div className="flex items-center justify-between border-t border-border-subtle px-3 py-2">
                  <button
                    type="button"
                    onClick={handleClear}
                    className={clsx(
                      'rounded-sm px-2 py-1 text-xs text-secondary',
                      'duration-fast ease-out-expo transition-all',
                      'hover:bg-surface-subtle hover:text-foreground',
                      'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none'
                    )}
                  >
                    {mergedTexts.clear}
                  </button>
                  {mode === 'date' && (
                    <button
                      type="button"
                      onClick={handleToday}
                      className={clsx(
                        'text-primary-600 rounded-sm px-2 py-1 text-xs font-medium',
                        'duration-fast ease-out-expo transition-all',
                        'hover:bg-primary-50 dark:hover:bg-primary-900/20',
                        'focus-visible:ring-primary-500 focus-visible:ring-2 focus-visible:outline-none'
                      )}
                    >
                      {mergedTexts.today}
                    </button>
                  )}
                </div>
              )}
            </div>,
            document.body
          )}
      </div>
    )
  }
)

InputDate.displayName = 'InputDate'
