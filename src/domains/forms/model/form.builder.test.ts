import { describe, it, expect } from 'vitest'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import {
  emptyLocalized,
  createField,
  resetFieldForType,
  emptyOption,
} from './form.builder'

describe('emptyLocalized', () => {
  it('returns an empty string for every supported language', () => {
    const result = emptyLocalized()
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(result[lang]).toBe('')
    }
  })
})

describe('createField', () => {
  it('assigns a stable client-side fieldId', () => {
    const field = createField('text')
    expect(field.fieldId).toBeTruthy()
  })

  it('defaults to required and no options for a plain text field', () => {
    const field = createField('text')
    expect(field.required).toBe(true)
    expect(field.options).toEqual([])
  })

  it('starts textarea/email/phone/checkbox/date fields with no options', () => {
    for (const type of [
      'textarea',
      'email',
      'phone',
      'checkbox',
      'date',
    ] as const) {
      expect(createField(type).options).toEqual([])
    }
  })

  it('starts select fields with 2 empty options (backend requires at least 2)', () => {
    const field = createField('select')
    expect(field.options).toHaveLength(2)
    expect(field.options[0].value).toBe('')
  })

  it('starts radio fields with 2 empty options', () => {
    const field = createField('radio')
    expect(field.options).toHaveLength(2)
  })

  it('gives each new field a distinct fieldId', () => {
    const a = createField('text')
    const b = createField('text')
    expect(a.fieldId).not.toBe(b.fieldId)
  })
})

describe('resetFieldForType', () => {
  it('drops options when switching from select to text', () => {
    const selectField = createField('select')
    selectField.options[0].value = 'a'
    const updated = resetFieldForType(selectField, 'text')
    expect(updated.type).toBe('text')
    expect(updated.options).toEqual([])
  })

  it('keeps existing options when switching between select and radio (both choice types)', () => {
    const selectField = createField('select')
    selectField.options[0].value = 'kept'
    const updated = resetFieldForType(selectField, 'radio')
    expect(updated.options[0].value).toBe('kept')
  })

  it('adds default options when switching from a non-choice type to select', () => {
    const textField = createField('text')
    const updated = resetFieldForType(textField, 'select')
    expect(updated.options).toHaveLength(2)
  })

  it('preserves label/placeholder/required when changing type', () => {
    const field = createField('text')
    field.label.en = 'Full name'
    field.required = false
    const updated = resetFieldForType(field, 'email')
    expect(updated.label.en).toBe('Full name')
    expect(updated.required).toBe(false)
  })
})

describe('emptyOption', () => {
  it('returns an option with an empty value and fully-localized empty label', () => {
    const option = emptyOption()
    expect(option.value).toBe('')
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(option.label[lang]).toBe('')
    }
  })
})
