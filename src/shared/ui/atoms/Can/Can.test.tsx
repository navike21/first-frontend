import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Can } from './Can'
import { useSessionStore } from '@/shared/model'
import type { AuthUser } from '@/shared/types'

const userWith = (permissions: string[]): AuthUser => ({
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@navike21.com',
  permissions,
})

const setPermissions = (permissions: string[]) =>
  useSessionStore.setState({
    isAuthenticated: true,
    token: 'tok',
    user: userWith(permissions),
  })

describe('Can', () => {
  beforeEach(() => {
    useSessionStore.setState({
      isAuthenticated: false,
      token: null,
      user: null,
    })
  })

  it('renders children when the user has one of the required permissions', () => {
    setPermissions(['users:read'])
    render(
      <Can anyOf={['users:read', 'users:manage']}>
        <span>visible</span>
      </Can>
    )
    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('renders nothing when the user lacks the permission', () => {
    setPermissions(['app-settings:read'])
    render(
      <Can anyOf={['users:read']}>
        <span>secret</span>
      </Can>
    )
    expect(screen.queryByText('secret')).not.toBeInTheDocument()
  })

  it('renders the fallback when the permission check fails', () => {
    setPermissions([])
    render(
      <Can anyOf="users:read" fallback={<span>denied</span>}>
        <span>secret</span>
      </Can>
    )
    expect(screen.getByText('denied')).toBeInTheDocument()
    expect(screen.queryByText('secret')).not.toBeInTheDocument()
  })

  it('grants everything to the *:* super-root wildcard', () => {
    setPermissions(['*:*'])
    render(
      <Can anyOf={['users:purge']}>
        <span>visible</span>
      </Can>
    )
    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('gates purely on `when` when no permission is required', () => {
    setPermissions([])
    const { rerender } = render(
      <Can when={true}>
        <span>shown</span>
      </Can>
    )
    expect(screen.getByText('shown')).toBeInTheDocument()
    rerender(
      <Can when={false}>
        <span>shown</span>
      </Can>
    )
    expect(screen.queryByText('shown')).not.toBeInTheDocument()
  })

  it('requires BOTH the permission and `when` when both are given', () => {
    setPermissions(['users:read'])
    render(
      <Can anyOf="users:read" when={false}>
        <span>secret</span>
      </Can>
    )
    expect(screen.queryByText('secret')).not.toBeInTheDocument()
  })
})
