import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '@/shared/model'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
  beforeEach(() => {
    useThemeStore.setState({ color: 'teal', theme: 'light' })
  })

  it('renders a radiogroup with aria-label', () => {
    render(<ColorPicker />)
    expect(screen.getByRole('radiogroup', { name: /brand color/i })).toBeInTheDocument()
  })

  it('renders 10 color buttons', () => {
    render(<ColorPicker />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(10)
  })

  it('marks the active color as checked', () => {
    render(<ColorPicker />)
    expect(screen.getByRole('radio', { name: 'Teal' })).toHaveAttribute('aria-checked', 'true')
  })

  it('marks non-selected colors as not checked', () => {
    render(<ColorPicker />)
    expect(screen.getByRole('radio', { name: 'Violet' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: 'Sky' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: 'Indigo' })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls setColor when a color button is clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Violet' }))
    expect(useThemeStore.getState().color).toBe('violet')
  })

  it('shows checkmark SVG on selected color', () => {
    render(<ColorPicker />)
    const tealBtn = screen.getByRole('radio', { name: 'Teal' })
    expect(tealBtn.querySelector('svg')).toBeInTheDocument()
  })

  it('does not show checkmark on unselected colors', () => {
    render(<ColorPicker />)
    const violetBtn = screen.getByRole('radio', { name: 'Violet' })
    expect(violetBtn.querySelector('svg')).toBeNull()
  })

  it('selects emerald when clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Emerald' }))
    expect(useThemeStore.getState().color).toBe('emerald')
  })

  it('selects sky when clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Sky' }))
    expect(useThemeStore.getState().color).toBe('sky')
  })

  it('selects indigo when clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Indigo' }))
    expect(useThemeStore.getState().color).toBe('indigo')
  })

  it('selects orange when clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Orange' }))
    expect(useThemeStore.getState().color).toBe('orange')
  })

  it('selects pink when clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Pink' }))
    expect(useThemeStore.getState().color).toBe('pink')
  })

  it('selects cyan when clicked', async () => {
    const user = userEvent.setup()
    render(<ColorPicker />)
    await user.click(screen.getByRole('radio', { name: 'Cyan' }))
    expect(useThemeStore.getState().color).toBe('cyan')
  })
})
