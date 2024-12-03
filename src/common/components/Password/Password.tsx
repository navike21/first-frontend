import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import { forwardRef, useId, useState } from 'react'
import { TPasswordProps } from './types'

export const Password = forwardRef<HTMLInputElement, TPasswordProps>(
  ({ label, name, error, helperText, prefix, ...props }, ref) => {
    const idElement = useId()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const { message: errorMessage } = (error && error[name]) ?? {}

    return (
      <TextField
        error={Boolean(errorMessage)}
        label={label}
        id={idElement}
        helperText={`${errorMessage || helperText || ''}`}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            startAdornment: prefix,
            endAdornment: (
              <IconButton
                color={errorMessage ? 'error' : 'primary'}
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={() => setShowPassword((show) => !show)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          },
        }}
        name={name}
        inputRef={ref}
        {...props}
      />
    )
  }
)
