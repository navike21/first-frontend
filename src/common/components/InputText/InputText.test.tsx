import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputText } from './InputText'
import { describe, it, expect } from 'vitest'

describe('InputText', () => {
  it('renders correctly with required props', () => {
    render(<InputText name="test-input" label="Test Label" />)

    const inputElement = screen.getByLabelText('Test Label')
    expect(inputElement).toBeInTheDocument()
  })

  it('displays error message when error is provided', () => {
    const error = { testInput: { message: 'Required field', type: 'required' } }
    render(<InputText name="testInput" label="Test Label" error={error} />)

    const errorMessage = screen.getByText('Required field')
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders with prefix and suffix', () => {
    render(
      <InputText
        name="testInput"
        label="Test Label"
        prefix="Prefix"
        suffix="Suffix"
      />
    )

    const prefixElement = screen.getByText('Prefix')
    const suffixElement = screen.getByText('Suffix')

    expect(prefixElement).toBeInTheDocument()
    expect(suffixElement).toBeInTheDocument()
  })

  it('renders with helper text', () => {
    render(
      <InputText name="testInput" label="Test Label" helperText="Helper" />
    )

    const helperTextElement = screen.getByText('Helper')
    expect(helperTextElement).toBeInTheDocument()
  })

  it('renders with error message instead of helper text', () => {
    const error = { testInput: { message: 'Required field', type: 'required' } }
    render(
      <InputText
        name="testInput"
        label="Test Label"
        helperText="Helper"
        error={error}
      />
    )

    const errorMessage = screen.getByText('Required field')
    expect(errorMessage).toBeInTheDocument()
  })

  it('sets aria-invalid when there is an error', () => {
    const error = { testInput: { message: 'Required field', type: 'required' } }
    render(<InputText name="testInput" label="Test Label" error={error} />)

    const inputElement = screen.getByLabelText('Test Label')
    expect(inputElement).toHaveAttribute('aria-invalid', 'true')
  })

  it('calls onChange handler when input value changes', async () => {
    const handleChange = vi.fn()
    render(
      <InputText name="testInput" label="Test Label" onChange={handleChange} />
    )

    const inputElement = screen.getByLabelText('Test Label')
    await userEvent.type(inputElement, 'Hello')

    expect(handleChange).toHaveBeenCalledTimes(5)
  })
})
