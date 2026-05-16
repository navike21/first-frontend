import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProfileDrawer } from './ProfileDrawer'
import type { AuthUser } from '@/shared/types'

// Factory
const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  name: 'María García',
  email: 'm.garcia@navike21.com',
  ...overrides,
})

vi.mock('@/shared/ui', () => ({
  Avatar: ({ alt, className }: { alt?: string; className?: string }) => (
    <div data-testid="avatar" aria-label={alt} className={className} />
  ),
  Button: ({
    children,
    onClick,
    variant,
    fullWidth,
    icon,
  }: {
    children: React.ReactNode
    onClick?: () => void
    variant?: string
    fullWidth?: boolean
    icon?: string
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-full-width={fullWidth}
      data-icon={icon}
    >
      {children}
    </button>
  ),
  Drawer: ({
    isOpen,
    onClose,
    children,
    title,
  }: {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: React.ReactNode
  }) =>
    isOpen ? (
      <dialog open>
        {title}
        <button onClick={onClose} aria-label="close-drawer">
          Close
        </button>
        {children}
      </dialog>
    ) : null,
  NavItem: ({ label }: { label: string }) => (
    <div data-testid="nav-item">{label}</div>
  ),
}))

const mockUser: AuthUser = makeAuthUser()

describe('ProfileDrawer component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render nothing when isOpen is false', () => {
    // Arrange & Act
    render(
      <ProfileDrawer
        isOpen={false}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render drawer content when isOpen is true', () => {
    // Arrange & Act
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display the user name', () => {
    // Arrange & Act
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    // Assert
    expect(screen.getByText('María García')).toBeInTheDocument()
  })

  it('should display the user email', () => {
    // Arrange & Act
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    // Assert
    expect(screen.getByText('m.garcia@navike21.com')).toBeInTheDocument()
  })

  it('should display fallback name when user is null', () => {
    // Arrange & Act
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={null}
      />
    )
    // Assert
    expect(screen.getByText('Usuario Invitado')).toBeInTheDocument()
  })

  it('should call onLogout when logout button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onLogout = vi.fn()
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={onLogout}
        user={mockUser}
      />
    )
    // Act
    await user.click(screen.getByText('Cerrar sesión'))
    // Assert
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={onClose}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    // Act
    await user.click(screen.getByLabelText('close-drawer'))
    // Assert
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
