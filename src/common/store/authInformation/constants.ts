import { IAuthInformation } from './type'

export const defaultAuthInformationState: IAuthInformation = {
  token: '',
  isAuth: false,
  userInformation: {
    email: '',
    names: '',
    avatar: '',
    role: '',
  },
}
