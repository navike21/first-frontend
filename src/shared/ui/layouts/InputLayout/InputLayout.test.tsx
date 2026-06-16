import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { InputLayout } from './InputLayout'

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useId: vi.fn(() => 'test-uuid'),
  }
})

vi.mock('@Components/atoms/HelperText/HelperText', () => ({
  HelperText: ({
    children,
    variant,
    idField,
    ...props
  }: {
    children?: ReactNode
    variant?: string
    idField?: string
  } & HTMLAttributes<HTMLDivElement>) => (
    <div
      data-testid="helper-text"
      data-variant={variant}
      id={idField}
      {...props}
    >
      {children}
    </div>
  ),
}))

vi.mock('@Components/atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({
    icon,
    className,
  }: {
    icon?: string
    className?: string
  }) => <span data-testid={`icon-${icon}`} className={className} />,
}))

vi.mock('@Components/atoms/Label/Label', () => ({
  Label: ({
    children,
    ...props
  }: { children?: ReactNode } & LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>{children}</label>
  ),
}))

vi.mock('@Components/atoms/Spinner/Spinner', () => ({
  Spinner: ({ variant, size }: { variant?: string; size?: string }) => (
    <div data-testid="spinner" data-variant={variant} data-size={size} />
  ),
}))

describe('InputLayout', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render with label and children', () => {
    render(
      <InputLayout label="Test Label">
        <input type="text" />
      </InputLayout>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render without label', () => {
    render(
      <InputLayout>
        <input type="text" />
      </InputLayout>
    )

    expect(screen.queryByRole('label')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <InputLayout className="custom-class">
        <input type="text" />
      </InputLayout>
    )

    const container = screen.getByRole('textbox').closest('div')
    expect(container?.parentElement).toHaveClass('custom-class')
  })

  it('should apply custom classInput', () => {
    render(
      <InputLayout classInput="custom-input-class">
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('custom-input-class')
  })

  it('should render with custom id', () => {
    render(
      <InputLayout id="custom-id" label="Label">
        <input type="text" />
      </InputLayout>
    )

    const label = screen.getByText('Label')
    expect(label).toHaveAttribute('for', 'custom-id')
  })

  it('should generate id when not provided', () => {
    render(
      <InputLayout label="Label">
        <input type="text" />
      </InputLayout>
    )

    const label = screen.getByText('Label')
    expect(label).toHaveAttribute('for', 'test-uuid')
  })

  it('should render with disabled state', () => {
    render(
      <InputLayout disabled label="Label">
        <input type="text" />
      </InputLayout>
    )

    const container = screen.getByText('Label').closest('div')
    expect(container).toHaveClass('cursor-not-allowed')
    expect(container).not.toHaveClass('pointer-events-none')
  })

  it('should render with loading state', () => {
    render(
      <InputLayout loading label="Label">
        <input type="text" />
      </InputLayout>
    )

    const container = screen.getByText('Label').closest('div')
    expect(container).toHaveClass('pointer-events-none')
    expect(container).not.toHaveClass('cursor-not-allowed')
    // Spinner should be present
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should render with both disabled and loading', () => {
    render(
      <InputLayout disabled loading label="Label">
        <input type="text" />
      </InputLayout>
    )

    const container = screen.getByText('Label').closest('div')
    expect(container).toHaveClass('cursor-not-allowed')
    expect(container).toHaveClass('pointer-events-none')
  })

  it('should render with variant default', () => {
    render(
      <InputLayout variant="default">
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('ring-(--border)')
  })

  it('should render with variant success', () => {
    render(
      <InputLayout variant="success">
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('ring-emerald-500')
    // Success icon should be present
    expect(screen.getByTestId('icon-RiCheckboxCircleFill')).toBeInTheDocument()
  })

  it('should render with variant error', () => {
    render(
      <InputLayout variant="error">
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('ring-red-500')
    // Error icon should be present
    expect(screen.getByTestId('icon-RiErrorWarningFill')).toBeInTheDocument()
  })

  it('should render with variant warning', () => {
    render(
      <InputLayout variant="warning">
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('ring-yellow-500')
    // Warning icon should be present
    expect(screen.getByTestId('icon-RiErrorWarningFill')).toBeInTheDocument()
  })

  it('should render errorMessage when variant is error', () => {
    render(
      <InputLayout variant="error" errorMessage="Error occurred">
        <input type="text" />
      </InputLayout>
    )

    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('should not render errorMessage when variant is not error', () => {
    render(
      <InputLayout variant="default" errorMessage="Error occurred">
        <input type="text" />
      </InputLayout>
    )

    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument()
  })

  it('should render helperText when variant is not error', () => {
    render(
      <InputLayout variant="default" helperText="Help text">
        <input type="text" />
      </InputLayout>
    )

    expect(screen.getByText('Help text')).toBeInTheDocument()
  })

  it('should not render helperText when variant is error', () => {
    render(
      <InputLayout variant="error" helperText="Help text">
        <input type="text" />
      </InputLayout>
    )

    expect(screen.queryByText('Help text')).not.toBeInTheDocument()
  })

  it('should render helperText with correct variant', () => {
    render(
      <InputLayout variant="success" helperText="Success help">
        <input type="text" />
      </InputLayout>
    )

    const helperText = screen.getByText('Success help')
    expect(helperText).toHaveAttribute('data-variant', 'success')
  })

  it('should not render icons when loading is true', () => {
    render(
      <InputLayout variant="success" loading>
        <input type="text" />
      </InputLayout>
    )

    expect(
      screen.queryByTestId('icon-RiCheckboxCircleFill')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should render disabled styles correctly', () => {
    render(
      <InputLayout disabled>
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('bg-slate-400/50')
    expect(inputContainer).not.toHaveClass('ring-1')
  })

  it('should render enabled styles correctly', () => {
    render(
      <InputLayout>
        <input type="text" />
      </InputLayout>
    )

    const inputContainer = screen.getByRole('textbox').parentElement
    expect(inputContainer).toHaveClass('ring-1')
    expect(inputContainer).toHaveClass('ring-(--border)')
  })
})
