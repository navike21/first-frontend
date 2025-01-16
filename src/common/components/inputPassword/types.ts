import { TextFieldProps } from '@mui/material'
import { TErrorField } from '@Types/hooksForm'
import { ReactNode } from 'react'

export type TPasswordProps = Omit<TextFieldProps, 'error' | 'type'> & {
  label?: string
  name: string
  error?: TErrorField
  helperText?: string
  prefix?: ReactNode
}
