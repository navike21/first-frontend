import {
  useEffect,
  useId,
  useRef,
  type ForwardedRef,
  type RefObject,
} from 'react'
import type { CheckboxProps } from './Checkbox.types'

export const useCheckbox = (
  { indeterminate, ...props }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const idField = useId()
  const internalRef = useRef<HTMLInputElement>(null)
  const resolvedRef = (ref ?? internalRef) as RefObject<HTMLInputElement>

  useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate, resolvedRef])

  return {
    idField,
    resolvedRef,
    inputPropsWithoutIndeterminate: {
      ...props,
      indeterminate: undefined,
    },
  }
}
