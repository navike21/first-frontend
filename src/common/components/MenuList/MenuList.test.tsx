import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MenuList, IItemMenu, IMenuProps } from './MenuList'

describe('MenuList Component', () => {
  const items: IItemMenu[] = [
    { label: 'Item 1', onClick: vi.fn() },
    { label: 'Item 2', disabled: true },
    { label: 'Item 3', selected: true },
  ]

  it('renders all menu items', () => {
    render(<MenuList items={items} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('calls onClick when a menu item is clicked', () => {
    render(<MenuList items={items} />)
    const item1 = screen.getByText('Item 1')
    fireEvent.click(item1)
    expect(items[0].onClick).toHaveBeenCalled()
  })

  it('renders MenuMUI when menuSelectable is provided', () => {
    const menuSelectable: IMenuProps = {
      open: true,
      onClose: vi.fn(),
    }
    render(<MenuList items={items} menuSelectable={menuSelectable} />)
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('calls onClose when MenuMUI is closed', () => {
    const onClose = vi.fn()
    const menuSelectable: IMenuProps = {
      open: true,
      onClose,
    }
    render(<MenuList items={items} menuSelectable={menuSelectable} />)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
