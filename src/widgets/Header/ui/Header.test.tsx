import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from './Header'
import type { AuthUser } from '@/shared/types'

const toggleProfileMock = vi.fn()
const closeProfileMock = vi.fn()
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

const makeHeaderState = (overrides?: Partial<ReturnType<typeof import('../model/useHeader')['useHeader']>>) => ({
  user: makeAuthUser() as AuthUser | null,
  isCollapsed: false,
  isProfileOpen: false,
  toggleProfile: toggleProfileMock,
  closeProfile: closeProfileMock,
  logout: logoutMock,
  toggleSidebar: toggleSidebarMock,
  toggleMobileSidebar: toggleMobileSidebarMock,
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
    IconComponent: ({
      icon,
      className,
    }: {
      icon: string
      className?: string
    }) => <span data-testid={`icon-${icon}`} className={className} />,
    IconButton: () => <button data-testid="icon-button" />,
    Avatar: ({ alt, name }: { alt?: string; name?: string }) => (
      <div data-testid="avatar" aria-label={alt ?? name} />
    ),
    ThemeToggle: () => <button data-testid="theme-toggle" aria-label="theme-toggle" />,
    LanguageSwitcher: ({ label }: { label?: string }) => (
      <div data-testid="language-switcher">{label}</div>
    ),
  }
})

vi.mock('./ProfileDrawer', () => ({
  ProfileDrawer: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="profile-drawer" /> : null,
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

  it('should render the app logo', () => {
    render(<Header />)
    expect(screen.getByTestId('app-logo')).toBeInTheDocument()
  })

  it('should render the First title', () => {
    render(<Header />)
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should render the user name', () => {
    render(<Header />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should render the user email', () => {
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

  it('should call toggleProfile when avatar area is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByLabelText('Menú de usuario'))
    expect(toggleProfileMock).toHaveBeenCalledTimes(1)
  })

  it('should render ThemeToggle', () => {
    render(<Header />)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
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
    const spans = screen.getAllByText('Usuario Invitado')
    expect(spans.length).toBeGreaterThanOrEqual(1)
  })

  it('should show guest email when user is null', () => {
    useHeaderMock.mockReturnValue(makeHeaderState({ user: null }))
    render(<Header />)
    expect(screen.getByText('Sin iniciar sesión')).toBeInTheDocument()
  })
})
