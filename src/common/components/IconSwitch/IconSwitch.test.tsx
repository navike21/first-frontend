import { render, screen, fireEvent } from '@testing-library/react'
import { vi, it, describe, expect } from 'vitest'
import { IconSwitch } from './IconSwitch'

describe('IconSwitch', () => {
  it('should render the icon, title, and switch', () => {
    render(
      <IconSwitch
        icon={<img src="path_to_icon" alt="Beer icon" />}
        title="Test Switch"
        checked={false}
        onChange={vi.fn()}
        role="switch"
      />
    )

    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByText('Test Switch')).toBeInTheDocument()
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('should call the onChange function when the switch is clicked', () => {
    const onChange = vi.fn()

    render(
      <IconSwitch
        icon={<img src="path_to_icon" alt="Beer icon" />}
        title="Test Switch"
        checked={false}
        onChange={onChange}
        role="switch"
      />
    )

    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
