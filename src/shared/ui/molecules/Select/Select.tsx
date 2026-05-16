import clsx from 'clsx'
import { forwardRef, useMemo } from 'react'
import { useMounted } from '@/shared/lib'
import type { SelectProps } from './Select.types'
import { useSelectHook } from './Select.hooks'
import { SelectFooter } from './components/SelectFooter/SelectFooter'
import { SelectInputArea } from './components/SelectInputArea/SelectInputArea'
import { VARIANT_ICON_MAP } from './constants/variantIconMap'
import { DEFAULT_SELECT_TEXTS, SELECT_TEXTS_BY_LANG, SelectTextsProvider } from './Select.texts'
import { Label } from '../../atoms/Label/Label'

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      classInput,
      label,
      helperText,
      errorMessage,
      variant = 'default',
      loading = false,
      disabled = false,
      options,
      multiple = false,
      search = false,
      placeholder,
      lang,
      texts,
      leftSlot,
      rightSlot,
      id,
      defaultValue,
      value,
      ...rest
    },
    ref,
  ) => {
    const {
      idField,
      isOpen,
      toggleOpen,
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
      setFocusedOptionIndex,
    } = useSelectHook(
      {
        options,
        multiple,
        search,
        disabled,
        ...(id !== undefined && { id }),
        ...(defaultValue !== undefined && { defaultValue }),
        ...(value !== undefined && { value }),
      },
      ref,
    )

    const variantIconDef = loading ? undefined : VARIANT_ICON_MAP[variant]
    const onTriggerClick = disabled || loading ? undefined : toggleOpen
    const triggerTabIndex = disabled ? -1 : 0
    const mergedTexts = useMemo(
      () => ({
        ...DEFAULT_SELECT_TEXTS,
        ...(lang === undefined ? {} : SELECT_TEXTS_BY_LANG[lang]),
        ...texts,
      }),
      [lang, texts],
    )

    // SSR-safe portal mount flag — prevents hydration mismatch in Next.js App Router
    const mounted = useMounted()

    return (
      <SelectTextsProvider value={mergedTexts}>
        <fieldset // NOSONAR — composite widget container legitimately captures keyboard/blur events
          ref={containerRef}
          tabIndex={-1}
          className={clsx(
            'relative m-0 flex min-w-0 flex-col gap-1 border-0 p-0',
            { 'cursor-not-allowed': disabled, 'pointer-events-none': loading },
            className,
          )}
          onKeyDown={handleContainerKeyDown}
          onBlur={handleContainerBlur}
        >
          {label && (
            <Label htmlFor={idField} disabled={disabled}>
              {label}
            </Label>
          )}

          <SelectInputArea
            triggerRef={triggerRef}
            disabled={disabled}
            loading={loading}
            isOpen={isOpen}
            variant={variant}
            isMultipleWithChips={isMultipleWithChips}
            {...(classInput !== undefined && { classInput })}
            {...(leftSlot !== undefined && { leftSlot })}
            {...(rightSlot !== undefined && { rightSlot })}
            triggerTabIndex={triggerTabIndex}
            onTriggerClick={onTriggerClick}
            handleInnerKeyDown={handleInnerKeyDown}
            selectedValues={selectedValues}
            options={options}
            handleOptionDeselect={handleOptionDeselect}
            singleLabel={singleLabel}
            {...(singleOption !== undefined && { singleOption })}
            {...(placeholder !== undefined && { placeholder })}
            multiple={multiple}
            {...(variantIconDef !== undefined && { variantIconDef })}
            idField={idField}
            dropdownRef={dropdownRef}
            dropdownStyle={dropdownStyle}
            search={search}
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredOptions={filteredOptions}
            handleOptionSelect={handleOptionSelect}
            setFocusedOptionIndex={setFocusedOptionIndex}
            mounted={mounted}
          />

          {/* Native select — hidden, for RHF / form submission */}
          <select
            ref={setRef}
            id={idField}
            multiple={multiple}
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            defaultValue={defaultValue}
            {...rest}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <SelectFooter
            idField={idField}
            variant={variant}
            {...(errorMessage !== undefined && { errorMessage })}
            {...(helperText !== undefined && { helperText })}
          />
        </fieldset>
      </SelectTextsProvider>
    )
  },
)

Select.displayName = 'Select'
