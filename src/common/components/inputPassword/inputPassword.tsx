import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import { InputText } from '@Components/InputText/InputText'
import { IconButton } from '@mui/material'
import { forwardRef, useId, useState } from 'react'
import { TPasswordProps } from './types'

export const InputPassword = forwardRef<HTMLInputElement, TPasswordProps>(
  ({ label, name, error, helperText, prefix, ...props }, ref) => {
    const idElement = `${useId()}-password`
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const { message: errorMessage } = (error && error[name]) ?? {}

    return (
      <InputText
        error={error}
        label={label}
        id={idElement}
        helperText={helperText}
        name={name}
        prefix={prefix}
        inputRef={ref}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                color={errorMessage ? 'error' : 'primary'}
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={() => setShowPassword((show) => !show)}
              >
                {showPassword ? <HiEyeSlash /> : <HiEye />}
              </IconButton>
            ),
          },
        }}
        {...props}
      />
    )
  }
)
