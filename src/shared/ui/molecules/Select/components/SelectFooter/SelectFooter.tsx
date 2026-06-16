import { HelperText } from '@/shared/ui'
import type { SelectVariant } from '../../Select.types'

interface SelectFooterProps {
  idField: string
  errorMessage?: React.ReactNode
  helperText?: React.ReactNode
  variant: SelectVariant
}

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
