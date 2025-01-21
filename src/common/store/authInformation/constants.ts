import { IAuthInformation } from './type'

export const defaultAuthInformationState: IAuthInformation = {
  token: '',
  isAuth: false,
  userInformation: {
    email: '',
    fatherLastName: '',
    motherLastName: '',
    names: '',
    avatar: '',
    role: '',
  },
}
