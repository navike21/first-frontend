import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLanguageStore } from '@/shared/model/language.store'
import { FormFieldCard } from './FormFieldCard'
import { createField } from '../../model/form.builder'

beforeEach(() => {
  useLanguageStore.setState({ language: 'en' })
})

function renderCard(overrides: Parameters<typeof createField>[0] = 'text') {
  const field = createField(overrides)
  const onChange = vi.fn()
  const onTypeChange = vi.fn()
  const onRemove = vi.fn()
  render(
    <FormFieldCard
      field={field}
      id={field.fieldId ?? ''}
      editingLanguage="en"
      onChange={onChange}
      onTypeChange={onTypeChange}
      onRemove={onRemove}
    />
  )
  return { field, onChange, onTypeChange, onRemove }
}

describe('FormFieldCard', () => {
  it('does not render an options editor for a plain text field', () => {
    renderCard('text')
    expect(
      screen.queryByText('Value', { exact: false })
    ).not.toBeInTheDocument()
  })

  it('renders an options editor with 2 rows for a select field', () => {
    renderCard('select')
    const optionValueInputs = screen.getAllByLabelText('Value')
    expect(optionValueInputs).toHaveLength(2)
  })

  it('calls onTypeChange (not onChange) when the field type is switched', () => {
    const { onTypeChange, onChange } = renderCard('text')
    const typeSelect = screen.getByLabelText('Field type')
    fireEvent.change(typeSelect, { target: { value: 'email' } })
    expect(onTypeChange).toHaveBeenCalledWith('email')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onChange with the required flag when the switch is toggled', () => {
    const { onChange } = renderCard('text')
    const requiredSwitch = screen.getByLabelText('Required')
    fireEvent.click(requiredSwitch)
    expect(onChange).toHaveBeenCalledWith({ required: false })
  })

  it('calls onRemove when the delete action is used', () => {
    const { onRemove } = renderCard('text')
    fireEvent.click(screen.getByLabelText('Remove field'))
    expect(onRemove).toHaveBeenCalled()
  })
})
