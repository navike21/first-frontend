import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToggleLayout } from './ToggleLayout'

describe('ToggleLayout', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <ToggleLayout>
        <input type="checkbox" />
      </ToggleLayout>
    )
    const input = screen.getByRole('checkbox')
    expect(input).toBeInTheDocument()
  })

  it('should apply correct container classes', () => {
    render(
      <ToggleLayout>
        <input type="checkbox" />
      </ToggleLayout>
    )
    const container = screen
      .getByRole('checkbox')
      .closest('.flex.items-start.gap-3')
    expect(container).toHaveClass('flex', 'items-start', 'gap-3')
  })

  it('should render label when provided', () => {
    render(
      <ToggleLayout label="Test Label">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
  })

  it('should not render label when not provided', () => {
    render(
      <ToggleLayout>
        <input type="checkbox" />
      </ToggleLayout>
    )
    const label = screen.queryByRole('label')
    expect(label).not.toBeInTheDocument()
  })

  it('should pass disabled to Label', () => {
    render(
      <ToggleLayout label="Test Label" disabled>
        <input type="checkbox" />
      </ToggleLayout>
    )
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('text-disabled', 'cursor-not-allowed')
  })

  it('should generate unique id when id is not provided', () => {
    render(
      <ToggleLayout label="Label 1">
        <input type="checkbox" />
      </ToggleLayout>
    )
    render(
      <ToggleLayout label="Label 2">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const label1 = screen.getByText('Label 1')
    const label2 = screen.getByText('Label 2')
    expect(label1).toHaveAttribute('for')
    expect(label2).toHaveAttribute('for')
    expect(label1.getAttribute('for')).not.toBe(label2.getAttribute('for'))
  })

  it('should use provided id for htmlFor', () => {
    render(
      <ToggleLayout label="Test Label" id="custom-id">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('for', 'custom-id')
  })

  it('should render error message when error and errorMessage are provided', () => {
    render(
      <ToggleLayout error errorMessage="Error occurred">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const errorText = screen.getByText('Error occurred')
    expect(errorText).toBeInTheDocument()
    expect(errorText).toHaveClass('text-danger-600') // HelperText error variant
  })

  it('should not render error message when error is true but errorMessage is not provided', () => {
    render(
      <ToggleLayout error>
        <input type="checkbox" />
      </ToggleLayout>
    )
    const errorText = screen.queryByText(/error/i)
    expect(errorText).not.toBeInTheDocument()
  })

  it('should not render error message when errorMessage is provided but error is false', () => {
    render(
      <ToggleLayout errorMessage="Error occurred">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const errorText = screen.queryByText('Error occurred')
    expect(errorText).not.toBeInTheDocument()
  })

  it('should render helper text when provided and no errorMessage', () => {
    render(
      <ToggleLayout helperText="Help text">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const helperText = screen.getByText('Help text')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-secondary') // Default HelperText variant
  })

  it('should not render helper text when errorMessage is provided', () => {
    render(
      <ToggleLayout helperText="Help text" error errorMessage="Error">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const helperText = screen.queryByText('Help text')
    expect(helperText).not.toBeInTheDocument()
    const errorText = screen.getByText('Error')
    expect(errorText).toBeInTheDocument()
  })

  it('should render both label and helper text', () => {
    render(
      <ToggleLayout label="Label" helperText="Help">
        <input type="checkbox" />
      </ToggleLayout>
    )
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
  })

  it('should render both label and error message', () => {
    render(
      <ToggleLayout label="Label" error errorMessage="Error">
        <input type="checkbox" />
      </ToggleLayout>
    )
    expect(screen.getByText('Label')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should apply correct structure with nested divs', () => {
    render(
      <ToggleLayout label="Label">
        <input type="checkbox" />
      </ToggleLayout>
    )
    const container = screen
      .getByRole('checkbox')
      .closest('.flex.items-start.gap-3')
    expect(container?.children).toHaveLength(2)
    const labelDiv = container?.children[1]
    expect(labelDiv).toHaveClass('flex', 'flex-col', 'gap-0.5')
  })

  it('should handle empty children gracefully', () => {
    render(<ToggleLayout>{null}</ToggleLayout>)
    const container = document.querySelector('.flex.items-start.gap-3')
    expect(container).toBeInTheDocument()
  })
})
