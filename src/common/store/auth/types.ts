export interface IUserSession {
  names: string
  email: string
  role: string
}

export interface IAuthState {
  token: string
  user: IUserSession
  isLogged: boolean
}

export interface IAuthStore extends IAuthState {
  setLogin: (params: Omit<IAuthState, 'isLogged'>) => void
  setLogout: () => void
}
