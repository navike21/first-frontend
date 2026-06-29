import { HelperText } from '@/shared/ui'
import type { SelectFooterProps } from './SelectFooter.types'

export const SelectFooter = ({
  idField,
  errorMessage,
  helperText,
  variant,
}: SelectFooterProps) => (
  <>
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
      <HelperText idField={idField}>{helperText}</HelperText>
    )}
  </>
)
