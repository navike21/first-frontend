import { IAuthState } from './types'

export const defaultUserState: IAuthState = {
  token: '',
  user: {
    id: 0,
    name: '',
    email: '',
    role: '',
  },
  isLogged: false,
}

export const STORAGE_KEY_AUTH_STORE = 'auth'
