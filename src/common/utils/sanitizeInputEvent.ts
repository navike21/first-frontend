import { FormEvent } from 'react'

export const sanitizeInputEvent = (
  event: FormEvent<HTMLInputElement>
): void => {
  const input = event.target as HTMLInputElement
  input.value = input.value.toLowerCase().trim().replace(/\s+/g, ' ')
}
