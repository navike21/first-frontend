import { createStore } from '@Utils/index'
import { IAuthState, IAuthStore } from './types'
import { STORAGE_KEY_AUTH_STORE } from './constant'

const defaultUserState: IAuthState = {
  token: '',
  user: {
    names: '',
    email: '',
    role: '',
  },
  isLogged: false,
}

export const useAuthStore = createStore<IAuthStore>(
  (set) => ({
    ...defaultUserState,
    setLogin: (params) => {
      set({
        token: params.token,
        user: params.user,
        isLogged: !!params.token,
      })
    },
    setLogout: () => {
      set(defaultUserState)
    },
  }),
  {
    name: STORAGE_KEY_AUTH_STORE,
  }
)
