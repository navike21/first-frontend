import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { createRef } from 'react'

import { TimeInput } from './TimeInput'

describe('TimeInput', () => {
  it('should render a native time input', () => {
    render(<TimeInput label="Hora" />)
    const input = screen.getByLabelText('Hora')
    expect(input).toHaveAttribute('type', 'time')
  })

  it('should call onChange when a time is typed', async () => {
    const user = userEvent.setup()
    render(<TimeInput label="Hora" defaultValue="" />)
    const input = screen.getByLabelText('Hora') as HTMLInputElement
    await user.type(input, '1430')
    expect(input.value).toBe('14:30')
  })

  it('should forward the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TimeInput ref={ref} label="Hora" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.type).toBe('time')
  })

  it('should show the error message when variant is error', () => {
    render(<TimeInput label="Hora" variant="error" errorMessage="Requerido" />)
    expect(screen.getByText('Requerido')).toBeInTheDocument()
  })

  it('should show the helper text when variant is not error', () => {
    render(<TimeInput label="Hora" helperText="Formato 24h" />)
    expect(screen.getByText('Formato 24h')).toBeInTheDocument()
  })

  it('should disable the input when disabled is true', () => {
    render(<TimeInput label="Hora" disabled />)
    expect(screen.getByLabelText('Hora')).toBeDisabled()
  })

  it('should disable the input when loading is true', () => {
    render(<TimeInput label="Hora" loading />)
    expect(screen.getByLabelText('Hora')).toBeDisabled()
  })

  it('should render a custom leftSlot instead of the default clock icon', () => {
    render(<TimeInput label="Hora" leftSlot={<span data-testid="custom-slot" />} />)
    expect(screen.getByTestId('custom-slot')).toBeInTheDocument()
  })

  it('should render rightSlot when provided', () => {
    render(<TimeInput label="Hora" rightSlot={<span data-testid="right-slot" />} />)
    expect(screen.getByTestId('right-slot')).toBeInTheDocument()
  })
})
