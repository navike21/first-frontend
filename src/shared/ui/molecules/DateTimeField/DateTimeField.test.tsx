import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'

import { DateTimeField } from './DateTimeField'

/** Mirrors how a real caller drives DateTimeField (controlled via
 * useWatch/setValue) — re-renders with the new value after each onChange,
 * unlike a fixed prop that never updates between keystrokes. */
function ControlledHarness({
  initialValue,
  onChange,
}: {
  initialValue: string
  onChange: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  return (
    <DateTimeField
      label="Inicio"
      value={value}
      onChange={(next) => {
        setValue(next)
        onChange(next)
      }}
    />
  )
}

describe('DateTimeField', () => {
  it('should render the label once for the pair', () => {
    render(<DateTimeField label="Inicio" onChange={vi.fn()} />)
    expect(screen.getByText('Inicio')).toBeInTheDocument()
  })

  it('should split an incoming combined value across the date and time inputs', () => {
    render(
      <DateTimeField
        label="Inicio"
        value="2026-08-15T14:30"
        onChange={vi.fn()}
      />
    )
    const timeInput = screen.getByDisplayValue('14:30')
    expect(timeInput).toHaveAttribute('type', 'time')
  })

  it('should call onChange with the joined value when the time changes', () => {
    // fireEvent.change (not userEvent.type): jsdom doesn't emulate a native
    // <input type="time">'s segmented hour/minute editing, so simulated
    // keystrokes land unpredictably — setting the value directly is the
    // standard RTL approach for native date/time inputs.
    const onChange = vi.fn()
    render(
      <ControlledHarness initialValue="2026-08-15T00:00" onChange={onChange} />
    )
    const timeInput = screen.getByDisplayValue('00:00')
    fireEvent.change(timeInput, { target: { value: '09:30' } })
    expect(onChange).toHaveBeenLastCalledWith('2026-08-15T09:30')
  })

  it('should render the error message once when variant is error', () => {
    render(
      <DateTimeField
        label="Inicio"
        variant="error"
        errorMessage="Fecha inválida"
        onChange={vi.fn()}
      />
    )
    expect(screen.getAllByText('Fecha inválida')).toHaveLength(1)
  })

  it('should render the helper text when variant is not error', () => {
    render(
      <DateTimeField label="Inicio" helperText="Zona horaria local" onChange={vi.fn()} />
    )
    expect(screen.getByText('Zona horaria local')).toBeInTheDocument()
  })
})
