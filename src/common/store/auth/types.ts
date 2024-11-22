export interface IUserSession {
  id: number
  name: string
  email: string
  role: string
}

export interface IAuthState {
  token: string
  user: IUserSession
  isLogged: boolean
}

export interface IAuthStore extends IAuthState {
  setLogin: (params: IAuthState) => void
  setLogout: () => void
}
