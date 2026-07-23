import clsx from 'clsx'
import type { HexColorInputProps } from './HexColorInput.types'

/** Swatch (`input type="color"`) + campo de texto hexadecimal, para
 * campos de color arbitrario (ej. el color de un grupo de usuarios). No
 * confundir con `ColorPicker` (paleta fija de 10 swatches de marca/tema). */
export const HexColorInput = ({
  label,
  value,
  onChange,
  disabled = false,
  errorMessage,
}: HexColorInputProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-foreground text-sm font-medium">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={clsx(
          'h-9 w-14 cursor-pointer p-0.5',
          'border-border rounded border',
          'disabled:cursor-not-allowed'
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={7}
        className={clsx(
          'h-9 w-28 px-3',
          'border-border bg-surface text-foreground rounded-lg border text-sm',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none',
          'disabled:bg-surface-subtle disabled:cursor-not-allowed'
        )}
      />
    </div>
    {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
  </div>
)
