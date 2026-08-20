import clsx from 'clsx'
import { splitDateTimeLocal, joinDateTimeLocal } from '@/shared/lib'
import { Label } from '../../atoms/Label/Label'
import { HelperText } from '../../atoms/HelperText/HelperText'
import { InputDate } from '../InputDate/InputDate'
import { TimeInput } from '../TimeInput/TimeInput'
import type { DateTimeFieldProps } from './DateTimeField.types'

/**
 * Date + time pair for fields needing day AND hour precision (coupons'
 * startsAt/expiresAt, pages/blog's scheduledAt) — InputDate alone has no time
 * mode, so this pairs it with TimeInput and combines both into the single
 * "YYYY-MM-DDTHH:mm" string the schema/backend already expects. One label,
 * one error/helper text for the pair — not duplicated per sub-input.
 */
export const DateTimeField = ({
  label,
  helperText,
  errorMessage,
  variant = 'default',
  value,
  onChange,
  onBlur,
  minDate,
  maxDate,
  disabled,
  lang,
  name,
  className,
}: DateTimeFieldProps) => {
  const { date, time } = splitDateTimeLocal(value)

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <Label disabled={disabled}>{label}</Label>}
      <div className="flex gap-2">
        <InputDate
          mode="date"
          className="flex-[3]"
          value={date}
          onChange={(e) => onChange(joinDateTimeLocal(e.target.value, time))}
          onBlur={onBlur}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          lang={lang}
          variant={variant}
          name={name ? `${name}-date` : undefined}
        />
        <TimeInput
          className="flex-[2]"
          value={time}
          onChange={(e) => onChange(joinDateTimeLocal(date, e.target.value))}
          onBlur={onBlur}
          disabled={disabled}
          variant={variant}
          name={name ? `${name}-time` : undefined}
        />
      </div>
      {errorMessage && variant === 'error' && <HelperText variant="error">{errorMessage}</HelperText>}
      {helperText && variant !== 'error' && <HelperText variant={variant}>{helperText}</HelperText>}
    </div>
  )
}
