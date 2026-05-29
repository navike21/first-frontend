import { useId } from 'react'
import type { SwitchProps } from './Switch.types'

export const useSwitchHook = ({ name }: Pick<SwitchProps, 'name'>) => {
  const generated = useId()
  return { idField: name ?? generated }
}
