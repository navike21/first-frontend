import { describe, it, expect } from 'vitest'
import { sanitizeInputEvent } from '../sanitizeInputEvent'
import { FormEvent } from 'react'

describe('sanitizeInputEvent', () => {
  const createInputEvent = (value: string): FormEvent<HTMLInputElement> => {
    return {
      target: { value } as HTMLInputElement,
      preventDefault: () => {},
      nativeEvent: {} as Event,
      currentTarget: {} as EventTarget & HTMLInputElement,
      bubbles: false,
      cancelable: false,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: false,
      stopPropagation: () => {},
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {},
      timeStamp: Date.now(),
      type: 'input',
    } as unknown as FormEvent<HTMLInputElement>
  }

  it('should convert input value to lowercase', () => {
    const event = createInputEvent('TEST')
    sanitizeInputEvent(event)
    expect((event.target as HTMLInputElement).value).toBe('test')
  })

  it('should trim whitespace from input value', () => {
    const event = createInputEvent('  test  ')
    sanitizeInputEvent(event)
    expect((event.target as HTMLInputElement).value).toBe('test')
  })

  it('should replace multiple spaces with a single space', () => {
    const event = createInputEvent('test    input')
    sanitizeInputEvent(event)
    expect((event.target as HTMLInputElement).value).toBe('test input')
  })

  it('should handle empty input value', () => {
    const event = createInputEvent('')
    sanitizeInputEvent(event)
    expect((event.target as HTMLInputElement).value).toBe('')
  })

  it('should handle input value with only spaces', () => {
    const event = createInputEvent('     ')
    sanitizeInputEvent(event)
    expect((event.target as HTMLInputElement).value).toBe('')
  })
})
