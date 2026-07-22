import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from './Header'
import type { AuthUser } from '@/shared/types'
import type { UserMenuProps } from '@/shared/ui'

const toggleSettingsMock = vi.fn()
const closeSettingsMock = vi.fn()
const logoutMock = vi.fn()
const toggleSidebarMock = vi.fn()
const toggleMobileSidebarMock = vi.fn()

const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@navike21.com',
  permissions: [],
  ...overrides,
})

const makeHeaderState = (
  overrides?: Partial<
    ReturnType<(typeof import('../model/useHeader'))['useHeader']>
  >
) => ({
  user: makeAuthUser() as AuthUser | null,
  isCollapsed: false,
  isSettingsOpen: false,
  toggleSettings: toggleSettingsMock,
  closeSettings: closeSettingsMock,
  logout: logoutMock,
  toggleSidebar: toggleSidebarMock,
  toggleMobileSidebar: toggleMobileSidebarMock,
  isLoading: false,
  ...overrides,
})

const { useHeaderMock } = vi.hoisted(() => ({
  useHeaderMock: vi.fn(),
}))

vi.mock('../model/useHeader', () => ({
  useHeader: useHeaderMock,
}))

vi.mock('@/shared/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui')>()
  return {
    ...actual,
    AppLogo: () => <svg data-testid="app-logo" />,
    BrandMark: ({ pulse }: { pulse?: boolean }) => (
      <span data-testid="brand-mark" data-pulse={pulse}>
        First
      </span>
    ),
    IconComponent: ({
      icon,
      className,
    }: {
      icon: string
      className?: string
    }) => <span data-testid={`icon-${icon}`} className={className} />,
    IconButton: ({
      onClick,
      'aria-label': ariaLabel,
    }: {
      onClick?: () => void
      'aria-label'?: string
    }) => (
      <button
        data-testid="icon-button"
        onClick={onClick}
        aria-label={ariaLabel}
      />
    ),
    LanguageSwitcher: ({ label }: { label?: string }) => (
      <div data-testid="language-switcher">{label}</div>
    ),
    UserMenu: ({
      name,
      email,
      onPreferencesClick,
      onLogoutClick,
    }: UserMenuProps) => (
      <div data-testid="user-menu">
        <span>{name}</span>
        <span>{email}</span>
        <button onClick={onPreferencesClick}>preferences</button>
        <button onClick={onLogoutClick}>logout</button>
      </div>
    ),
  }
})

vi.mock('./SettingsDrawer', () => ({
  SettingsDrawer: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="settings-drawer" /> : null,
}))

describe('Header component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    useHeaderMock.mockReturnValue(makeHeaderState())
  })

  it('should render the header element', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render the First title', () => {
    render(<Header />)
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should render the user name', () => {
    render(<Header />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('should pass the user email to UserMenu', () => {
    render(<Header />)
    expect(screen.getByText('test@navike21.com')).toBeInTheDocument()
  })

  it('should call toggleMobileSidebar when mobile menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const mobileBtn = screen.getAllByRole('button')[0]
    await user.click(mobileBtn)
    expect(toggleMobileSidebarMock).toHaveBeenCalledTimes(1)
  })

  it('should call toggleSettings when UserMenu requests preferences', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByText('preferences'))
    expect(toggleSettingsMock).toHaveBeenCalledTimes(1)
  })

  it('should call logout when UserMenu requests logout', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByText('logout'))
    expect(logoutMock).toHaveBeenCalledTimes(1)
  })

  it('should render LanguageSwitcher', () => {
    render(<Header />)
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
  })

  it('should show expand-menu aria-label when sidebar is collapsed', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ isCollapsed: true }))
    render(<Header />)
    expect(screen.getByLabelText('Expandir menú')).toBeInTheDocument()
  })

  it('should show collapse-menu aria-label when sidebar is expanded', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ isCollapsed: false }))
    render(<Header />)
    expect(screen.getByLabelText('Colapsar menú')).toBeInTheDocument()
  })

  it('should show RiMenuUnfoldLine icon when collapsed', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ isCollapsed: true }))
    render(<Header />)
    expect(screen.getByTestId('icon-RiMenuUnfoldLine')).toBeInTheDocument()
  })

  it('should show RiMenuFoldLine icon when expanded', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ isCollapsed: false }))
    render(<Header />)
    expect(screen.getByTestId('icon-RiMenuFoldLine')).toBeInTheDocument()
  })

  it('should show guest name when user is null', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ user: null }))
    render(<Header />)
    expect(screen.getByText('Usuario Invitado')).toBeInTheDocument()
  })

  it('should show guest email when user is null', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ user: null }))
    render(<Header />)
    expect(screen.getByText('Sin iniciar sesión')).toBeInTheDocument()
  })

  it('should render SettingsDrawer when isSettingsOpen is true', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ isSettingsOpen: true }))
    render(<Header />)
    expect(screen.getByTestId('settings-drawer')).toBeInTheDocument()
  })

  it('should not pulse the brand mark when nothing is loading', () => {
    render(<Header />)
    expect(screen.getByTestId('brand-mark')).toHaveAttribute('data-pulse', 'false')
  })

  it('should pulse the brand mark when isLoading is true', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ isLoading: true }))
    render(<Header />)
    expect(screen.getByTestId('brand-mark')).toHaveAttribute('data-pulse', 'true')
  })
})
