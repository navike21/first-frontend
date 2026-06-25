import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProfileDrawer } from './ProfileDrawer'
import type { AuthUser } from '@/shared/types'

const makeAuthUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  id: '1',
  firstName: 'María',
  lastName: 'García',
  email: 'm.garcia@navike21.com',
  permissions: [],
  ...overrides,
})

vi.mock('@/shared/ui', () => ({
  Avatar: ({ alt }: { alt?: string }) => (
    <div data-testid="avatar" aria-label={alt} />
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
  IconComponent: ({ icon }: { icon: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      children,
      onClick,
      to,
    }: {
      children: React.ReactNode
      onClick?: () => void
      to?: string
    }) => (
      <a href={to} onClick={onClick}>
        {children}
      </a>
    ),
  }
})

const mockUser: AuthUser = makeAuthUser()

describe('ProfileDrawer component', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render nothing when isOpen is false', () => {
    render(
      <ProfileDrawer
        isOpen={false}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render drawer content when isOpen is true', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display the user name', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    expect(screen.getByText('María García')).toBeInTheDocument()
  })

  it('should display the user email', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    expect(screen.getByText('m.garcia@navike21.com')).toBeInTheDocument()
  })

  it('should display fallback name when user is null', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={null}
      />
    )
    expect(screen.getByText('Usuario Invitado')).toBeInTheDocument()
  })

  it('should display fallback email when user is null', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={null}
      />
    )
    expect(screen.getByText('Sin iniciar sesión')).toBeInTheDocument()
  })

  it('should render the nav links', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    expect(screen.getByText('Mi perfil')).toBeInTheDocument()
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument()
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument()
    expect(screen.queryByText('Grupos de usuarios')).not.toBeInTheDocument()
  })

  it('should call onClose when a nav link is clicked', async () => {
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
    await user.click(screen.getByText('Mi perfil'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onLogout when logout button is clicked', async () => {
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
    await user.click(screen.getByText('Cerrar sesión'))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when close button is clicked', async () => {
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
    await user.click(screen.getByLabelText('close-drawer'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should render avatar', () => {
    render(
      <ProfileDrawer
        isOpen={true}
        onClose={vi.fn()}
        onLogout={vi.fn()}
        user={mockUser}
      />
    )
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })
})
