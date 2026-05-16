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

// Factory
const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  name: 'Test User',
  email: 'test@indra.com',
  ...overrides,
})

vi.mock('../model/useHeader', () => ({
  useHeader: () => ({
    user: makeAuthUser(),
    isCollapsed: false,
    isProfileOpen: false,
    toggleProfile: toggleProfileMock,
    closeProfile: closeProfileMock,
    logout: logoutMock,
    toggleSidebar: toggleSidebarMock,
    toggleMobileSidebar: toggleMobileSidebarMock,
  }),
}))

vi.mock('@/shared/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/ui')>()
  return {
    ...actual,
    IsoLogoIndra: () => <svg data-testid="iso-logo" />,
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
  }
})

vi.mock('./ProfileDrawer', () => ({
  ProfileDrawer: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="profile-drawer" /> : null,
}))

describe('Header component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the header element', () => {
    // Arrange & Act
    render(<Header />)
    // Assert
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render the Indra logo', () => {
    // Arrange & Act
    render(<Header />)
    // Assert
    expect(screen.getByTestId('iso-logo')).toBeInTheDocument()
  })

  it('should render the Performance title', () => {
    // Arrange & Act
    render(<Header />)
    // Assert
    expect(screen.getByText('Performance')).toBeInTheDocument()
  })

  it('should render the user name', () => {
    // Arrange & Act
    render(<Header />)
    // Assert
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('should render the user email', () => {
    // Arrange & Act
    render(<Header />)
    // Assert
    expect(screen.getByText('test@indra.com')).toBeInTheDocument()
  })

  it('should call toggleMobileSidebar when mobile menu button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<Header />)
    // Act
    const mobileBtn = screen.getAllByRole('button')[0]
    await user.click(mobileBtn)
    // Assert
    expect(toggleMobileSidebarMock).toHaveBeenCalledTimes(1)
  })

  it('should call toggleProfile when avatar area is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<Header />)
    // Act
    await user.click(screen.getByLabelText('Menú de usuario'))
    // Assert
    expect(toggleProfileMock).toHaveBeenCalledTimes(1)
  })
})
