import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi } from 'vitest'
import { InputNumber } from './InputNumber'
import type { InputNumberProps } from './InputNumber.types'

// Test harness: an RHF form using plain `register`, surfacing the stored value.
function Harness({
  onValue,
  defaultValue = '',
  ...props
}: InputNumberProps & { onValue: (v: unknown) => void; defaultValue?: string }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { field: defaultValue },
  })
  return (
    <form onSubmit={handleSubmit((d) => onValue(d.field))}>
      <InputNumber aria-label="field" {...props} {...register('field')} />
      <button type="submit">submit</button>
    </form>
  )
}

const input = () => screen.getByLabelText('field') as HTMLInputElement

describe('InputNumber', () => {
  it('blocks alphabetic characters (only digits remain)', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} />)
    await user.type(input(), 'a1b2c3')
    expect(input().value).toBe('123')
  })

  it('displays grouped thousands but stores the raw number', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} thousandSeparator decimals={2} />)
    await user.type(input(), '1200')
    expect(input().value).toBe('1,200')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('1200')
  })

  it('keeps up to `decimals` places', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} decimals={2} />)
    await user.type(input(), '1234.099')
    expect(input().value).toBe('1234.09')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('1234.09')
  })

  it('applies a phone mask for display and stores the raw digits', async () => {
    const user = userEvent.setup()
    const onValue = vi.fn()
    render(<Harness onValue={onValue} mask="+## ### ### ###" />)
    await user.type(input(), '51989505027')
    expect(input().value).toBe('+51 989 505 027')
    await user.click(screen.getByText('submit'))
    expect(onValue).toHaveBeenCalledWith('51989505027')
  })

  it('formats an injected default value on mount', () => {
    render(<Harness onValue={vi.fn()} mask="+## ### ### ###" defaultValue="51989505027" />)
    expect(input().value).toBe('+51 989 505 027')
  })

  it('rejects a negative sign unless allowNegative is set', async () => {
    const user = userEvent.setup()
    render(<Harness onValue={vi.fn()} allowNegative />)
    await user.type(input(), '-50')
    expect(input().value).toBe('-50')
  })
})
