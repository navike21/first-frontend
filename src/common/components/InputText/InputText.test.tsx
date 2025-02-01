import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputText } from './InputText'

describe('InputText Component', () => {
  it('renders without crashing', () => {
    render(<InputText name="test-input" />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()
  })

  it('displays the correct value', () => {
    render(<InputText name="test-input" value="test" />)
    const inputElement = screen.getByDisplayValue('test')
    expect(inputElement).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn()
    render(<InputText name="test-input" onChange={handleChange} />)
    const inputElement = screen.getByRole('textbox')
    fireEvent.change(inputElement, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('displays the correct label', () => {
    render(<InputText name="test-input" label="Test Label" />)
    const labelElement = screen.getAllByRole('textbox', {
      name: 'Test Label',
    })[0]
    expect(labelElement).toBeInTheDocument()
  })

  it('displays the correct helper text', () => {
    render(<InputText name="test-input" helperText="Test Helper Text" />)
    const helperTextElement = screen.getByText('Test Helper Text')
    expect(helperTextElement).toBeInTheDocument()
  })
})
