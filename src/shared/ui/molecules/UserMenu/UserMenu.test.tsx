import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserMenu } from './UserMenu'
import type { UserMenuLabels } from './UserMenu.types'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      to,
      children,
      ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  }
})

const labels: UserMenuLabels = {
  ariaLabel: 'User menu',
  profile: 'My profile',
  preferences: 'Preferences',
  themeDark: 'Dark theme',
  themeLight: 'Light theme',
  logout: 'Sign out',
}

const useThemeMock = vi.fn(() => 'light' as 'light' | 'dark')
const toggleThemeMock = vi.fn()

vi.mock('@/shared/model', () => ({
  useTheme: () => useThemeMock(),
  useToggleTheme: () => toggleThemeMock,
}))

const renderMenu = (overrides: Partial<Parameters<typeof UserMenu>[0]> = {}) =>
  render(
    <UserMenu
      name="Ana Nuñez"
      email="ana@navike21.com"
      profileHref="/es/perfil"
      labels={labels}
      onPreferencesClick={vi.fn()}
      onLogoutClick={vi.fn()}
      {...overrides}
    />
  )

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useThemeMock.mockReturnValue('light')
  })

  it('should render the trigger with the user name', () => {
    renderMenu()
    expect(screen.getByRole('button', { name: 'User menu' })).toBeInTheDocument()
    expect(screen.getByText('Ana Nuñez')).toBeInTheDocument()
  })

  it('should not render the menu before opening', () => {
    renderMenu()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should open the menu on trigger click and show all items', async () => {
    const user = userEvent.setup()
    renderMenu()
    await user.click(screen.getByRole('button', { name: 'User menu' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('ana@navike21.com')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /My profile/ })).toHaveAttribute(
      'href',
      '/es/perfil'
    )
    expect(screen.getByRole('menuitem', { name: /Preferences/ })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Dark theme/ })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Sign out/ })).toBeInTheDocument()
  })

  it('should show "Light theme" as the toggle label when the theme is dark', async () => {
    useThemeMock.mockReturnValue('dark')
    const user = userEvent.setup()
    renderMenu()
    await user.click(screen.getByRole('button', { name: 'User menu' }))

    expect(screen.getByRole('menuitem', { name: /Light theme/ })).toBeInTheDocument()
  })

  it('should call useToggleTheme when the theme item is clicked', async () => {
    const user = userEvent.setup()
    renderMenu()
    await user.click(screen.getByRole('button', { name: 'User menu' }))
    await user.click(screen.getByRole('menuitem', { name: /Dark theme/ }))

    expect(toggleThemeMock).toHaveBeenCalledTimes(1)
  })

  it('should call onPreferencesClick and close the menu', async () => {
    const onPreferencesClick = vi.fn()
    const user = userEvent.setup()
    renderMenu({ onPreferencesClick })
    await user.click(screen.getByRole('button', { name: 'User menu' }))
    await user.click(screen.getByRole('menuitem', { name: /Preferences/ }))

    expect(onPreferencesClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should call onLogoutClick and close the menu', async () => {
    const onLogoutClick = vi.fn()
    const user = userEvent.setup()
    renderMenu({ onLogoutClick })
    await user.click(screen.getByRole('button', { name: 'User menu' }))
    await user.click(screen.getByRole('menuitem', { name: /Sign out/ }))

    expect(onLogoutClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should close the menu when Escape is pressed', async () => {
    const user = userEvent.setup()
    renderMenu()
    await user.click(screen.getByRole('button', { name: 'User menu' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should close the menu on outside click', async () => {
    const user = userEvent.setup()
    renderMenu()
    await user.click(screen.getByRole('button', { name: 'User menu' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should toggle the menu closed when the trigger is clicked again', async () => {
    const user = userEvent.setup()
    renderMenu()
    const trigger = screen.getByRole('button', { name: 'User menu' })
    await user.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
