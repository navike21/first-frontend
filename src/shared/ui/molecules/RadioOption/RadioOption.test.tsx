import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { beforeEach, describe, it, expect, vi } from 'vitest'

import { RadioOption } from './RadioOption'

describe('RadioOption', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render without props', () => {
    // Arrange & Act
    render(<RadioOption />)
    // Assert
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('should render with label', () => {
    // Arrange & Act
    render(<RadioOption label="Test Label" />)
    // Assert
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render with helperText', () => {
    // Arrange & Act
    render(<RadioOption helperText="Helper text" />)
    // Assert
    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })

  it('should render with error and errorMessage', () => {
    // Arrange & Act
    render(<RadioOption error errorMessage="Error message" />)
    // Assert
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    // Arrange & Act
    render(<RadioOption disabled />)
    // Assert
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('should be checked when checked prop is true', () => {
    // Arrange & Act
    render(<RadioOption checked onChange={vi.fn()} />)
    // Assert
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('should not be checked when checked prop is false', () => {
    // Arrange & Act
    render(<RadioOption checked={false} onChange={vi.fn()} />)
    // Assert
    expect(screen.getByRole('radio')).not.toBeChecked()
  })

  it('should be checked when defaultChecked prop is true', () => {
    // Arrange & Act
    render(<RadioOption defaultChecked />)
    // Assert
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('should call onChange when clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<RadioOption onChange={onChange} />)
    const radio = screen.getByRole('radio')
    // Act
    await user.click(radio)
    // Assert
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('should forward ref correctly', () => {
    // Arrange
    const ref = createRef<HTMLInputElement>()
    // Act
    render(<RadioOption ref={ref} />)
    // Assert
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should have native input type radio', () => {
    // Arrange & Act
    render(<RadioOption />)
    // Assert
    expect(screen.getByRole('radio')).toHaveAttribute('type', 'radio')
  })

  it('should apply name and value props to the native input', () => {
    // Arrange & Act
    render(<RadioOption name="group" value="option-a" />)
    const radio = screen.getByRole('radio')
    // Assert
    expect(radio).toHaveAttribute('name', 'group')
    expect(radio).toHaveAttribute('value', 'option-a')
  })

  it('should toggle checked state via controlled wrapper', async () => {
    // Arrange
    const user = userEvent.setup()
    const TestWrapper = () => {
      const [checked, setChecked] = useState(false)
      return <RadioOption checked={checked} onChange={(e) => setChecked(e.target.checked)} />
    }
    render(<TestWrapper />)
    const radio = screen.getByRole('radio')
    expect(radio).not.toBeChecked()
    // Act
    await user.click(radio)
    // Assert
    expect(radio).toBeChecked()
  })

  it('should apply disabled styles to the outer button', () => {
    // Arrange & Act
    render(<RadioOption disabled />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass(
      'cursor-not-allowed',
      'ring-slate-400',
      'bg-slate-200',
    )
  })

  it('should apply error ring class when error is true', () => {
    // Arrange & Act
    render(<RadioOption error />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass('ring-red-500')
  })

  it('should render as rounded-full shape', () => {
    // Arrange & Act
    render(<RadioOption />)
    // Assert
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('should have displayName RadioOption', () => {
    // Arrange & Act & Assert
    expect(RadioOption.displayName).toBe('RadioOption')
  })
})
