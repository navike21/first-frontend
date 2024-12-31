export interface IAuthInformationState extends IAuthInformation {
  setToken: (token: string) => void
  setIsAuth: (isAuth: boolean) => void
  setUserInformation: (userInformation: IUserInformation) => void
  clearAuthInformation: () => void
  setLogin: (loginInfo: IAuthInformation) => void
}

export interface IAuthInformation {
  token: string
  isAuth: boolean
  userInformation: IUserInformation
}

export interface IUserInformation {
  email: string
  names: string
  avatar: string
  role: string
}
