import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useCheckbox } from './Checkbox.hooks'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render without props', () => {
    // Arrange & Act
    render(<Checkbox />)
    // Assert
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('should render with label', () => {
    // Arrange & Act
    render(<Checkbox label="Test Label" />)
    // Assert
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render with helperText', () => {
    // Arrange & Act
    render(<Checkbox helperText="Helper text" />)
    // Assert
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  it('should render with error and errorMessage', () => {
    // Arrange & Act
    render(<Checkbox error errorMessage="Error message" />)
    // Assert
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    // Arrange & Act
    render(<Checkbox disabled />)
    // Assert
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('should be checked when checked prop is true', () => {
    // Arrange & Act
    render(<Checkbox checked onChange={vi.fn()} />)
    // Assert
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should not be checked when checked prop is false', () => {
    // Arrange & Act
    render(<Checkbox checked={false} onChange={vi.fn()} />)
    // Assert
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should handle indeterminate state', () => {
    // Arrange & Act
    render(<Checkbox indeterminate onChange={vi.fn()} />)
    // Assert
    expect(
      (screen.getByRole('checkbox') as HTMLInputElement).indeterminate
    ).toBe(true)
  })

  it('should handle non-indeterminate state', () => {
    // Arrange & Act
    render(<Checkbox indeterminate={false} onChange={vi.fn()} />)
    // Assert
    expect(
      (screen.getByRole('checkbox') as HTMLInputElement).indeterminate
    ).toBe(false)
  })

  it('should call onChange when clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    // Act
    await user.click(checkbox)
    // Assert
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should forward ref correctly', () => {
    // Arrange
    const ref = createRef<HTMLInputElement>()
    // Act
    render(<Checkbox ref={ref} />)
    // Assert
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should toggle checked state correctly', async () => {
    // Arrange
    const user = userEvent.setup()
    const TestWrapper = () => {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      )
    }
    render(<TestWrapper />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    // Act
    await user.click(checkbox)
    // Assert
    expect(checkbox).toBeChecked()
  })

  it('should apply correct classes when disabled', () => {
    // Arrange & Act
    render(<Checkbox disabled />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass(
      'cursor-not-allowed',
      'ring-slate-400',
      'bg-slate-200'
    )
  })

  it('should apply correct classes when not disabled', () => {
    // Arrange & Act
    render(<Checkbox />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass('ring-slate-30', 'bg-(--surface)')
  })

  it('should apply correct classes when checked and not error', () => {
    // Arrange & Act
    render(<Checkbox checked onChange={vi.fn()} />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass(
      'has-[input:checked]:ring-slate-700'
    )
  })

  it('should apply correct classes when error', () => {
    // Arrange & Act
    render(<Checkbox error />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass('ring-red-500')
  })

  it('should not throw when ref current is null (defensive guard branch)', () => {
    // Arrange: use createRef — current is null before the element mounts
    const nullRef = createRef<HTMLInputElement>()

    const { result, rerender } = renderHook(
      ({ indeterminate }: { indeterminate: boolean }) =>
        useCheckbox({ indeterminate }, nullRef),
      { initialProps: { indeterminate: false } }
    )

    // Act: trigger useEffect with indeterminate=true while current is null
    rerender({ indeterminate: true })

    // Assert: hook still returns the expected shape — no error thrown
    expect(result.current.idField).toBeDefined()
    expect(result.current.resolvedRef).toBe(nullRef)
  })
})
