import { InputText } from '@Components/InputText/InputText'
import { IconButton } from '@mui/material'
import { forwardRef, useId, useState } from 'react'
import { TPasswordProps } from './types'
import { AnimateIcon } from '@Components/AnimateIcon/AnimateIcon'
import eyeIcon from '@Json/animateIcons/wired-outline-69-eye-morph-lashes.json'

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
                {/* {showPassword ? <HiEyeSlash /> : <HiEye />} */}
                <AnimateIcon icon={eyeIcon} toggleAnimation={showPassword} />
              </IconButton>
            ),
          },
        }}
        {...props}
      />
    )
  }
)
