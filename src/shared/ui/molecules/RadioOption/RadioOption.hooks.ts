import { useId, useRef, type ForwardedRef, type RefObject } from 'react'
import type { RadioOptionProps } from './RadioOption.types'

export const useRadioOption = (
  props: RadioOptionProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const idField = useId()
  const internalRef = useRef<HTMLInputElement>(null)
  const resolvedRef = (ref ?? internalRef) as RefObject<HTMLInputElement>

  return {
    idField,
    resolvedRef,
    inputProps: props
  }
}
