import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Tabs } from './Tabs'
import type { TabItem } from './Tabs.types'

vi.mock('../../atoms/IconComponent/IconComponent', () => ({
  IconComponent: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}))

const tabs: TabItem[] = [
  { id: 'settings', label: 'Settings' },
  { id: 'members', label: 'Members', icon: 'RiGroupLine' },
]

describe('Tabs component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a tab per item', () => {
    render(<Tabs tabs={tabs} activeId="settings" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Members/ })).toBeInTheDocument()
  })

  it('marks the active tab with aria-selected', () => {
    render(<Tabs tabs={tabs} activeId="members" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: /Members/ })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })

  it('calls onChange with the tab id when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs tabs={tabs} activeId="settings" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: /Members/ }))
    expect(onChange).toHaveBeenCalledWith('members')
  })

  it('renders the icon when provided', () => {
    render(<Tabs tabs={tabs} activeId="settings" onChange={vi.fn()} />)
    expect(screen.getByTestId('icon-RiGroupLine')).toBeInTheDocument()
  })
})
