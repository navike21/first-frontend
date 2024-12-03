import { TextField } from '@mui/material'
import { forwardRef, useId } from 'react'
import { TInputTextProps } from './types'

export const InputText = forwardRef<HTMLInputElement, TInputTextProps>(
  ({ label, name, error, helperText, suffix, prefix, ...props }, ref) => {
    const idElement = useId()
    const { message: errorMessage } = (error && error[name]) ?? {}

    return (
      <TextField
        error={Boolean(errorMessage)}
        label={label}
        id={idElement}
        helperText={`${errorMessage || helperText || ''}`}
        slotProps={{
          input: {
            startAdornment: prefix,
            endAdornment: suffix,
          },
        }}
        name={name}
        inputRef={ref}
        {...props}
      />
    )
  }
)
