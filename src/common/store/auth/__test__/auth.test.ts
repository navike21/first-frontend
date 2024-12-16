import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../auth' // Ajusta la ruta según tu estructura de archivos
import { IAuthState } from '../types'
import { STORAGE_KEY_AUTH_STORE } from '../constant'

describe('useAuthStore', () => {
  const defaultUserState: IAuthState = {
    token: '',
    user: {
      names: '',
      email: '',
      role: '',
    },
    isLogged: false,
  }

  const loginState: IAuthState = {
    token: 'token',
    user: {
      names: 'John Doe',
      email: 'jhon@doe.com',
      role: 'admin',
    },
    isLogged: true,
  }

  beforeEach(() => {
    useAuthStore.setState({ ...defaultUserState })
  })

  it('should set login state', () => {
    const store = useAuthStore.getState()
    store.setLogin(loginState)
    expect(useAuthStore.getState()).toMatchObject(loginState)
  })

  it('should set logout state', () => {
    const store = useAuthStore.getState()
    store.setLogin(loginState)
    store.setLogout()
    expect(useAuthStore.getState()).toMatchObject(defaultUserState)
  })

  it('should not affect login state when unrelated actions are performed', () => {
    const store = useAuthStore.getState()
    store.setLogin(loginState)

    // Simula una acción no relacionada
    useAuthStore.setState({ token: 'unrelated-token' })

    expect(useAuthStore.getState()).toMatchObject({
      ...loginState,
      token: 'unrelated-token',
    })
  })

  it('should not overwrite user properties when only token is updated', () => {
    const store = useAuthStore.getState()
    store.setLogin(loginState)

    useAuthStore.setState({ token: 'new-token' })

    expect(useAuthStore.getState().user).toMatchObject(loginState.user)
  })

  it('should not set isLogged to true if token is empty', () => {
    const store = useAuthStore.getState()
    store.setLogin({ ...loginState, token: '' })

    expect(useAuthStore.getState().isLogged).toBe(false)
  })

  it('should persist and restore state from storage', () => {
    const store = useAuthStore.getState()
    store.setLogin(loginState)

    const persistedState = JSON.parse(
      localStorage.getItem(STORAGE_KEY_AUTH_STORE) || '{}'
    )
    expect(persistedState.state).toMatchObject(loginState)

    useAuthStore.setState(persistedState.state)
    expect(useAuthStore.getState()).toMatchObject(loginState)
  })
})
