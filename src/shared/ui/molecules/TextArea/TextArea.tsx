import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import clsx from 'clsx'
import { Label } from '../../atoms/Label/Label'
import { HelperText } from '../../atoms/HelperText/HelperText'
import type { TextAreaProps } from './TextArea.types'

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      variant = 'default',
      className = '',
      classInput = '',
      disabled = false,
      rows = 4,
      showCount = false,
      maxLength,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const idField = id ?? generatedId
    const innerRef = useRef<HTMLTextAreaElement>(null)
    const [count, setCount] = useState(0)

    const setRefs = useCallback(
      (el: HTMLTextAreaElement | null) => {
        innerRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      },
      [ref]
    )

    // Sync the counter with the field's initial value (react-hook-form applies
    // `defaultValues` via the ref, so there is no `value` prop to read on edit).
    useEffect(() => {
      if (innerRef.current) setCount(innerRef.current.value.length)
    }, [])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length)
      onChange?.(e)
    }

    const length = value !== undefined ? String(value).length : count
    const atLimit = maxLength !== undefined && length >= maxLength
    const nearLimit =
      maxLength !== undefined && !atLimit && length >= maxLength * 0.9
    const isError = variant === 'error'

    return (
      <div
        className={clsx(
          'relative flex flex-col gap-1',
          { 'cursor-not-allowed': disabled },
          className
        )}
      >
        {label && (
          <Label disabled={disabled} htmlFor={idField}>
            {label}
          </Label>
        )}

        <div
          className={clsx(
            'flex w-full rounded-sm',
            'duration-fast ease-out-expo transition-all',
            'focus-within:shadow-sm focus-within:ring-2',
            {
              'bg-slate-400/50 dark:bg-slate-600/50': disabled,
              'bg-surface ring-1 ring-inset': !disabled,
              'focus-within:ring-primary-600 dark:focus-within:ring-primary-400 ring-border':
                variant === 'default' && !isError && !disabled,
              'ring-emerald-500 focus-within:ring-emerald-600':
                variant === 'success' && !disabled,
              'ring-red-500 focus-within:ring-red-600': isError && !disabled,
              'ring-yellow-500 focus-within:ring-yellow-600':
                variant === 'warning' && !disabled,
            },
            classInput
          )}
        >
          <textarea
            id={idField}
            ref={setRefs}
            rows={rows}
            disabled={disabled}
            onChange={handleChange}
            aria-describedby={
              helperText || errorMessage ? `${idField}-helper-text` : undefined
            }
            {...(maxLength !== undefined && { maxLength })}
            {...(value !== undefined && { value })}
            {...props}
            className={clsx(
              'w-full resize-y bg-transparent px-4 py-2.5 text-sm font-normal',
              'placeholder:text-muted',
              'focus:outline-none',
              {
                'cursor-not-allowed text-secondary': disabled,
                'text-foreground': !disabled,
              }
            )}
          />
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {isError && errorMessage && (
              <HelperText idField={idField} variant="error">
                {errorMessage}
              </HelperText>
            )}
            {!(isError && errorMessage) && helperText && (
              <HelperText idField={idField}>{helperText}</HelperText>
            )}
          </div>

          {showCount && maxLength !== undefined && (
            <span
              className={clsx('shrink-0 text-xs tabular-nums', {
                'text-muted': !nearLimit && !atLimit,
                'text-yellow-500': nearLimit,
                'font-medium text-red-500': atLimit,
              })}
            >
              {length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
