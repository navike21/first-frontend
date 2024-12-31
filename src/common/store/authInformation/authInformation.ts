import { createStore } from '@Utils/createStore'
import { IAuthInformationState } from './type'
import { defaultAuthInformationState } from './constants'

export const useAuthInformationStore = createStore<IAuthInformationState>(
  (set) => ({
    ...defaultAuthInformationState,
    setToken: (token) => set((state) => ({ ...state, token })),
    setIsAuth: (isAuth) => set((state) => ({ ...state, isAuth })),
    setUserInformation: (userInformation) =>
      set((state) => ({ ...state, userInformation })),
    setLogin: (loginInfo) => set((state) => ({ ...state, ...loginInfo })),
    clearAuthInformation: () =>
      set((state) => ({
        ...state,
        ...defaultAuthInformationState,
      })),
  }),
  'auth-information-store'
)
