import clsx from 'clsx'
import { useCallback, useId, useState } from 'react'
import type { InputFieldProps, TypeInput } from './InputField.types'

export const useInputField = ({ type = 'text', name }: InputFieldProps) => {
  const generatedId = useId()
  const ID_FIELD = name || generatedId

  const [showPassword, setShowPassword] = useState(false)

  const TYPE_FIELD = type === 'password' && showPassword ? 'text' : type

  const handleClassSlot = useCallback(
    (type: TypeInput, position: 'left' | 'right') =>
      clsx(
        'flex items-center justify-left min-w-5 text-xs text-secondary font-semibold h-10',
        '[&>svg]:size-5',
        {
          'px-3': type === 'text',
          'pr-3': type !== 'text' && position === 'left',
          'pl-3 pr-3': type !== 'text' && position === 'right',
        }
      ),
    []
  )

  const handleChangeTypePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return {
    idField: ID_FIELD,
    showPassword,
    typeField: TYPE_FIELD,
    handleClassSlot,
    handleChangeTypePassword,
  }
}
