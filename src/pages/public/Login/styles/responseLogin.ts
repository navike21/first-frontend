export type TResponseLogin = {
  status: number
  message: string
  data: TDataLogin
}

export type TDataLogin = {
  token: string
  names: string
  motherLastName: string
  fatherLastName: string
  email: string
}
