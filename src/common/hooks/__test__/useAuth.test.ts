import { describe, it, expect, vi, Mock } from 'vitest'
import { useAuthStore } from '@Store/auth'
import { useAuth } from '@Hooks/useAuth'

vi.mock('@Store/auth', () => ({
  useAuthStore: vi.fn(),
}))

describe('useAuth', () => {
  it('should return the correct state and methods from useAuthStore', () => {
    const mockState = {
      isLogged: true,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'admin',
      },
      token: 'mockToken',
      setLogin: vi.fn(),
      setLogout: vi.fn(),
    }
    ;(useAuthStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockState)
    )

    const auth = useAuth()

    expect(auth.isLogged).toBe(true)
    expect(auth.user).toEqual(mockState.user)
    expect(auth.token).toBe('mockToken')
    expect(auth.setLogin).toBe(mockState.setLogin)
    expect(auth.setLogout).toBe(mockState.setLogout)
  })

  it('should call setLogin method when invoked', () => {
    const mockState = {
      setLogin: vi.fn(),
    }
    ;(useAuthStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockState)
    )

    const { setLogin } = useAuth()
    setLogin({
      token: 'newToken',
      isLogged: true,
      user: {
        id: 2,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        role: 'user',
      },
    })

    expect(mockState.setLogin).toHaveBeenCalledWith({
      token: 'newToken',
      isLogged: true,
      user: {
        id: 2,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        role: 'user',
      },
    })
  })

  it('should call setLogout method when invoked', () => {
    const mockState = {
      setLogout: vi.fn(),
    }
    ;(useAuthStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockState)
    )

    const { setLogout } = useAuth()
    setLogout()

    expect(mockState.setLogout).toHaveBeenCalled()
  })
})
