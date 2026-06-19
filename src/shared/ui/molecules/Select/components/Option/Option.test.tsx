import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Option } from './Option'

describe('Option', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders the label inside a role=option button', () => {
    render(<Option value="1" label="Spanish" selected={false} onSelect={vi.fn()} />)
    expect(screen.getByRole('option', { name: 'Spanish' })).toBeInTheDocument()
  })

  it('renders an arbitrary leftSlot node (e.g. a flag/image)', () => {
    render(
      <Option
        value="1"
        label="Spanish"
        selected={false}
        leftSlot={<span data-testid="flag" />}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByTestId('flag')).toBeInTheDocument()
  })

  it('renders an arbitrary rightSlot node', () => {
    render(
      <Option
        value="1"
        label="Spanish"
        selected={false}
        rightSlot={<span data-testid="meta" />}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByTestId('meta')).toBeInTheDocument()
  })

  it('marks the selected option with aria-selected=true', () => {
    render(<Option value="1" label="Spanish" selected onSelect={vi.fn()} />)
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onSelect with the value when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Option value="es" label="Spanish" selected={false} onSelect={onSelect} />)
    await user.click(screen.getByRole('option'))
    expect(onSelect).toHaveBeenCalledWith('es')
  })

  it('does not call onSelect or onFocus when disabled', () => {
    const onSelect = vi.fn()
    const onFocus = vi.fn()
    render(
      <Option
        value="es"
        label="Spanish"
        selected={false}
        disabled
        onSelect={onSelect}
        onFocus={onFocus}
      />
    )
    const option = screen.getByRole('option')
    expect(option).toBeDisabled()
    fireEvent.focus(option)
    expect(onFocus).not.toHaveBeenCalled()
  })

  it('shows the multi-select check when showCheck is true', () => {
    render(
      <Option value="1" label="Spanish" selected showCheck onSelect={vi.fn()} />
    )
    expect(screen.getByTestId('icon-RiCheckLine')).toBeInTheDocument()
  })

  it('calls onFocus when an enabled option receives focus', () => {
    const onFocus = vi.fn()
    render(
      <Option
        value="1"
        label="Spanish"
        selected={false}
        onSelect={vi.fn()}
        onFocus={onFocus}
      />
    )
    fireEvent.focus(screen.getByRole('option'))
    expect(onFocus).toHaveBeenCalledOnce()
  })
})
