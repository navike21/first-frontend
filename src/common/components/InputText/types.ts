import { TextFieldProps } from '@mui/material'
import { TErrorField } from '@Types/hooksForm'
import { ReactNode } from 'react'

export type TInputTextProps = Omit<TextFieldProps, 'error'> & {
  label?: string
  name: string
  error?: TErrorField
  helperText?: string
  suffix?: ReactNode
  prefix?: ReactNode
}
