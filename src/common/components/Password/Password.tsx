import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import { useId, useState } from 'react'
import { TPasswordProps } from './types'

export const Password = ({ label }: TPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const idElement = useId()

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor={idElement}>{label}</InputLabel>
      <OutlinedInput
        id={idElement}
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? 'hide the password' : 'display the password'
              }
              onClick={handleClickShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  )
}
