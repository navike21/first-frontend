import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { InputField } from './InputField'

// Mock IconComponent to avoid issues with icons
vi.mock('@Components/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({
    icon,
    className,
  }: {
    icon: string
    className?: string
  }) => <div data-testid={`icon-${icon}`} className={className} />,
}))

vi.mock('@Components/atoms/Spinner/Spinner', () => ({
  Spinner: ({ variant, size }: { variant: string; size: string }) => (
    <div data-testid="spinner" data-variant={variant} data-size={size} />
  ),
}))

vi.mock('@Components/atoms/Label/Label', () => ({
  Label: ({
    children,
    disabled,
    htmlFor,
    className,
  }: {
    children: React.ReactNode
    disabled?: boolean
    htmlFor?: string
    className?: string
  }) => (
    <label
      htmlFor={htmlFor}
      className={`duration-fast ease-out-expo text-sm font-semibold transition-all ${disabled ? 'text-secondary cursor-not-allowed' : 'text-foreground'} ${className || ''}`}
    >
      {children}
    </label>
  ),
}))

vi.mock('@Components/atoms/HelperText/HelperText', () => ({
  HelperText: ({
    children,
    idField,
    variant,
    className,
  }: {
    children: React.ReactNode
    idField: string
    variant?: string
    className?: string
  }) => (
    <div
      id={`${idField}-helper`}
      className={className}
      role={variant === 'error' ? 'alert' : undefined}
      aria-live={variant === 'error' ? 'polite' : undefined}
    >
      {children}
    </div>
  ),
}))

// Mock the hook
vi.mock('./inputField.hooks', () => ({
  useInputField: vi.fn((props: { type?: string }) => ({
    idField: 'test-id',
    showPassword: false,
    typeField: props.type || 'text',
    handleClassSlot: vi.fn((type: string, position: string) => {
      if (type === 'email' && position === 'left') return 'pr-3'
      if (type === 'text' && position === 'left') return 'pr-4'
      if (position === 'right') return 'pl-4'
      return ''
    }),
    handleChangeTypePassword: vi.fn(),
  })),
}))

describe('InputField', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render default input', () => {
    // Arrange & Act
    render(<InputField placeholder="Enter text" />)
    // Assert
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('should render with label', () => {
    // Arrange & Act
    render(<InputField label="Test Label" placeholder="Enter text" />)
    // Assert
    const label = screen.getByText('Test Label')
    const input = screen.getByPlaceholderText('Enter text')
    expect(label).toBeInTheDocument()
    expect(label).toHaveAttribute('for', input.id)
  })

  it('should render with helper text', () => {
    // Arrange & Act
    render(<InputField helperText="Helper message" placeholder="Enter text" />)
    // Assert
    const helper = screen.getByText('Helper message')
    expect(helper).toBeInTheDocument()
  })

  it('should render email type as a plain input, no leading icon', () => {
    // Arrange & Act — el Design System muestra el input de email como un
    // campo de texto plano, sin ícono (verificado contra el HTML del manual)
    render(<InputField type="email" placeholder="Enter email" />)
    // Assert
    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toHaveAttribute('type', 'email')
    expect(screen.queryByTestId('icon-RiMailFill')).not.toBeInTheDocument()
  })

  it('should render password type with a toggle button but no leading icon', () => {
    // Arrange & Act
    render(<InputField type="password" placeholder="Enter password" />)
    // Assert
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('type', 'password')
    expect(
      screen.queryByTestId('icon-RiLockPasswordFill')
    ).not.toBeInTheDocument()
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('should render with left slot', () => {
    // Arrange & Act
    render(<InputField leftSlot={<span>Left</span>} placeholder="Enter text" />)
    // Assert
    expect(screen.getByText('Left')).toBeInTheDocument()
  })

  it('should render with right slot', () => {
    // Arrange & Act
    render(
      <InputField rightSlot={<span>Right</span>} placeholder="Enter text" />
    )
    // Assert
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('should render success variant with icon', () => {
    // Arrange & Act
    render(<InputField variant="success" placeholder="Enter text" />)
    // Assert
    expect(screen.getByTestId('icon-RiCheckboxCircleFill')).toBeInTheDocument()
  })

  it('should render error variant with icon', () => {
    // Arrange & Act
    render(<InputField variant="error" placeholder="Enter text" />)
    // Assert
    expect(screen.getByTestId('icon-RiErrorWarningFill')).toBeInTheDocument()
  })

  it('should render warning variant with icon', () => {
    // Arrange & Act
    render(<InputField variant="warning" placeholder="Enter text" />)
    // Assert
    expect(screen.getByTestId('icon-RiErrorWarningFill')).toBeInTheDocument()
  })

  it('should render loading state with spinner', () => {
    // Arrange & Act
    render(<InputField loading placeholder="Enter text" />)
    // Assert
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should render disabled state', () => {
    // Arrange & Act
    render(<InputField disabled placeholder="Enter text" />)
    // Assert
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeDisabled()
  })

  it('should apply custom className', () => {
    // Arrange & Act
    render(<InputField className="custom-class" placeholder="Enter text" />)
    // Assert
    const input = screen.getByPlaceholderText('Enter text')
    const outerDiv = input.closest('div')?.parentElement
    expect(outerDiv).toHaveClass('custom-class')
  })

  it('should apply custom classInput', () => {
    // Arrange & Act
    render(
      <InputField classInput="custom-input-class" placeholder="Enter text" />
    )
    // Assert
    const inputContainer =
      screen.getByPlaceholderText('Enter text').parentElement
    expect(inputContainer).toHaveClass('custom-input-class')
  })

  it('should pass through other input props', () => {
    // Arrange & Act
    render(<InputField maxLength={10} placeholder="Enter text" />)
    // Assert
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveAttribute('maxlength', '10')
  })

  it('should render helperText as ReactNode', () => {
    // Arrange & Act
    render(
      <InputField
        helperText={<em>Italic helper</em>}
        placeholder="Enter text"
      />
    )
    // Assert
    const helper = screen.getByText('Italic helper')
    expect(helper).toBeInTheDocument()
    expect(helper.tagName).toBe('EM')
  })

  it('should not render icons when loading', () => {
    // Arrange & Act
    render(<InputField variant="success" loading placeholder="Enter text" />)
    // Assert
    expect(
      screen.queryByTestId('icon-RiCheckboxCircleFill')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should not render rightSlot for password type', () => {
    // Arrange & Act
    render(
      <InputField
        type="password"
        rightSlot={<span>Right</span>}
        placeholder="Enter password"
      />
    )
    // Assert
    expect(screen.queryByText('Right')).not.toBeInTheDocument()
  })

  it('should apply correct classes for disabled label', () => {
    // Arrange & Act
    render(
      <InputField disabled label="Disabled Label" placeholder="Enter text" />
    )
    // Assert
    const label = screen.getByText('Disabled Label')
    expect(label).toHaveClass('text-disabled', 'cursor-not-allowed')
  })

  it('should apply correct classes for enabled label', () => {
    // Arrange & Act
    render(<InputField label="Enabled Label" placeholder="Enter text" />)
    // Assert
    const label = screen.getByText('Enabled Label')
    expect(label).toHaveClass('text-foreground')
  })

  it('should handle class slot for different types and positions', () => {
    // Arrange & Act
    render(
      <InputField
        type="email"
        leftSlot={<span>Left</span>}
        placeholder="Enter email"
      />
    )
    // Assert
    const leftSlot = screen.getByText('Left').parentElement
    expect(leftSlot).toHaveClass('pr-3')
  })

  it('should forward ref to input element', () => {
    // Arrange
    const ref = React.createRef<HTMLInputElement>()
    // Act
    render(<InputField ref={ref} placeholder="Test ref" />)
    // Assert
    const input = screen.getByPlaceholderText('Test ref')
    expect(ref.current).toBe(input)
  })

  it('should add aria-describedby when helperText is provided', () => {
    // Arrange & Act
    render(<InputField helperText="Helper text" placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveAttribute('aria-describedby', `${input.id}-helper-text`)
  })

  it('should add role alert and aria-live to helperText when variant is error', () => {
    // Arrange & Act
    render(
      <InputField
        variant="error"
        errorMessage="Error message"
        placeholder="Test"
      />
    )
    // Assert
    const helper = screen.getByText('Error message')
    expect(helper).toHaveAttribute('role', 'alert')
    expect(helper).toHaveAttribute('aria-live', 'polite')
  })

  it('should disable toggle button when input is disabled', () => {
    // Arrange & Act
    render(<InputField type="password" disabled placeholder="Enter password" />)
    // Assert
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeDisabled()
  })

  it('should enable toggle button when input is not disabled', () => {
    // Arrange & Act
    render(<InputField type="password" placeholder="Enter password" />)
    // Assert
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).not.toBeDisabled()
    expect(toggleButton).toHaveClass(
      'hover:bg-surface-subtle',
      'cursor-pointer'
    )
  })

  it('should apply correct classes to toggle button when disabled', () => {
    // Arrange & Act
    render(<InputField type="password" disabled placeholder="Enter password" />)
    // Assert
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toHaveClass('cursor-not-allowed')
    expect(toggleButton).not.toHaveClass('hover:bg-slate-200/50')
  })

  it('should render with left slot for password type', () => {
    // Arrange & Act
    render(
      <InputField
        type="password"
        leftSlot={<span>Icon</span>}
        placeholder="Enter password"
      />
    )
    // Assert
    expect(screen.getByText('Icon')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveClass('pr-1')
  })

  it('should apply correct input classes for text type without slots', () => {
    // Arrange & Act
    render(<InputField type="text" placeholder="Test" />)
    // Assert — 11px/14px exactos del Design System
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('py-[11px]', 'px-[14px]')
  })

  it('should apply correct input classes for email type without slots', () => {
    // Arrange & Act — email es un input plano, mismo padding que text
    render(<InputField type="email" placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('py-[11px]', 'px-[14px]')
  })

  it('should apply correct input classes for password type without slots', () => {
    // Arrange & Act
    render(<InputField type="password" placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('py-[11px]', 'pl-[14px]', 'pr-1')
  })

  it('should apply correct input classes with left slot', () => {
    // Arrange & Act
    render(<InputField leftSlot={<span>L</span>} placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('pr-[14px]')
  })

  it('should apply correct input classes with right slot', () => {
    // Arrange & Act
    render(<InputField rightSlot={<span>R</span>} placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('pl-[14px]')
  })

  it('should apply disabled classes to input', () => {
    // Arrange & Act
    render(<InputField disabled placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('text-muted', 'cursor-not-allowed')
  })

  it('should apply loading classes to input', () => {
    // Arrange & Act
    render(<InputField loading placeholder="Test" />)
    // Assert
    const input = screen.getByPlaceholderText('Test')
    expect(input).toHaveClass('pointer-events-none')
  })

  it('should render errorMessage when variant is error', () => {
    // Arrange & Act
    render(
      <InputField
        variant="error"
        errorMessage="Error occurred"
        placeholder="Test"
      />
    )
    // Assert
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('should toggle password visibility and cover both icon branches', async () => {
    const user = userEvent.setup()
    render(<InputField type="password" placeholder="Enter password" />)
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('type', 'password')
    // Click toggle — showPassword becomes true → 'RiEyeOffFill' branch
    await user.click(screen.getByRole('button'))
    expect(input).toHaveAttribute('type', 'text')
    // Click again — showPassword becomes false → 'RiEyeFill' branch
    await user.click(screen.getByRole('button'))
    expect(input).toHaveAttribute('type', 'password')
  })
})
