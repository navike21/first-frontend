import { useId } from 'react'
import { Label } from '../../atoms/Label/Label'
import { HelperText } from '../../atoms/HelperText/HelperText'
import type { ToggleLayoutProps } from './ToggleLayout.types'

export const ToggleLayout = ({
  children,
  disabled = false,
  error,
  errorMessage,
  helperText,
  id,
  label,
}: ToggleLayoutProps) => {
  const generatedId = useId()
  const idField = id ?? generatedId
  return (
    <div className="flex items-start gap-3">
      {children}
      <div className="flex flex-col gap-0.5">
        {label && (
          <Label disabled={disabled} htmlFor={idField}>
            {label}
          </Label>
        )}
        {error && errorMessage && (
          <HelperText idField={idField} variant="error">
            {errorMessage}
          </HelperText>
        )}
        {helperText && !errorMessage && (
          <HelperText idField={idField}>{helperText}</HelperText>
        )}
      </div>
    </div>
  )
}
