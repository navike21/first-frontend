import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'
import { PriceInput } from './PriceInput'
import type { PriceInputProps } from './PriceInput.types'

// Test harness: an RHF form using plain `register`, surfacing the stored value.
function Harness({
  onValue,
  defaultValue = '',
  ...props
}: PriceInputProps & {
  onValue: (v: unknown) => void
  defaultValue?: string
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: { field: defaultValue },
  })
  return (
    <form onSubmit={handleSubmit((d) => onValue(d.field))}>
      <PriceInput aria-label="field" {...props} {...register('field')} />
      <button type="submit">submit</button>
    </form>
  )
}

const input = () => screen.getByLabelText('field') as HTMLInputElement

describe('PriceInput', () => {
  it('renders the currency-symbol prefix', () => {
    render(<Harness onValue={vi.fn()} prefix="$" />)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('supports a different currency symbol', () => {
    render(<Harness onValue={vi.fn()} prefix="S/" />)
    expect(screen.getByText('S/')).toBeInTheDocument()
    expect(screen.queryByText('$')).not.toBeInTheDocument()
  })

  it('groups thousands and stores a plain decimal string', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} prefix="$" />)
    await user.type(input(), '1250.9')
    expect(input().value).toBe('1,250.9')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('1250.9')
  })

  it('caps decimals at 2 places', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} prefix="$" />)
    await user.type(input(), '10.999')
    expect(input().value).toBe('10.99')
  })

  it('blocks non-numeric characters', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} prefix="$" />)
    await user.type(input(), 'a9b8c9')
    expect(input().value).toBe('989')
  })

  it('rejects a leading minus by default (allowNegative=false)', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} prefix="$" />)
    await user.type(input(), '-10')
    expect(input().value).toBe('10')
  })

  it('allows a leading minus when allowNegative is set', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} prefix="$" allowNegative />)
    await user.type(input(), '-10.50')
    expect(input().value).toBe('-10.50')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('-10.50')
  })

  it('formats an injected default value on mount', () => {
    render(<Harness onValue={vi.fn()} prefix="$" defaultValue="1250.9" />)
    expect(input().value).toBe('1,250.9')
  })

  it('shows the error message and applies the error variant', () => {
    render(
      <Harness
        onValue={vi.fn()}
        prefix="$"
        variant="error"
        errorMessage="Inválido"
      />
    )
    expect(screen.getByText('Inválido')).toBeInTheDocument()
  })

  it('disables the input and dims the prefix', () => {
    render(<Harness onValue={vi.fn()} prefix="$" disabled />)
    expect(input()).toBeDisabled()
    expect(screen.getByText('$')).toHaveClass('text-muted')
  })
})
