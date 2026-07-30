import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'
import { InputPhone } from './InputPhone'
import type { InputPhoneProps } from './InputPhone.types'

// Test harness: an RHF form using plain `register`, surfacing the stored value.
function Harness({
  onValue,
  defaultValue = '',
  ...props
}: InputPhoneProps & {
  onValue: (v: unknown) => void
  defaultValue?: string
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: { field: defaultValue },
  })
  return (
    <form onSubmit={handleSubmit((d) => onValue(d.field))}>
      <InputPhone aria-label="field" {...props} {...register('field')} />
      <button type="submit">submit</button>
    </form>
  )
}

const input = () => screen.getByLabelText('field') as HTMLInputElement

describe('InputPhone', () => {
  it('renders the fixed country-code prefix', () => {
    render(<Harness onValue={vi.fn()} />)
    expect(screen.getByText('+51')).toBeInTheDocument()
  })

  it('supports a custom prefix', () => {
    render(<Harness onValue={vi.fn()} prefix="+52" />)
    expect(screen.getByText('+52')).toBeInTheDocument()
    expect(screen.queryByText('+51')).not.toBeInTheDocument()
  })

  it('the prefix is not part of the editable value', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} />)
    await user.type(input(), '989505027')
    // The prefix stays a separate, non-input element — never appears inside the value.
    expect(input().value).toBe('989 505 027')
  })

  it('formats the national number with the default Peru mask and stores raw digits', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} />)
    await user.type(input(), '989505027')
    expect(input().value).toBe('989 505 027')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('989505027')
  })

  it('blocks alphabetic characters (only digits remain)', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} />)
    await user.type(input(), 'a9b8c9')
    expect(input().value).toBe('989')
  })

  it('supports a custom mask', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} mask="## ####" />)
    await user.type(input(), '551234')
    expect(input().value).toBe('55 1234')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('551234')
  })

  it('formats an injected default value on mount', () => {
    render(<Harness onValue={vi.fn()} defaultValue="989505027" />)
    expect(input().value).toBe('989 505 027')
  })

  it('shows the error message and applies the error variant', () => {
    render(<Harness onValue={vi.fn()} variant="error" errorMessage="Inválido" />)
    expect(screen.getByText('Inválido')).toBeInTheDocument()
  })

  it('disables the input and dims the prefix', () => {
    render(<Harness onValue={vi.fn()} disabled />)
    expect(input()).toBeDisabled()
    expect(screen.getByText('+51')).toHaveClass('text-muted')
  })
})
