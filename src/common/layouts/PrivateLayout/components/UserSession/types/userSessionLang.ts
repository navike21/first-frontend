import { EIcons } from '../enums/icons'

type TMainMenuItem = {
  label: string
  icon: EIcons
  urlPath: string
}

type TMainMenu = {
  title: string
  items: TMainMenuItem[]
}

type TLogOutModalConfirmActions = {
  cancel: string
  confirm: string
}

type TLogOutModalConfirm = {
  title: string
  content: string
  actions: TLogOutModalConfirmActions
}

type TLogOut = {
  title: string
  modalConfirm: TLogOutModalConfirm
}

export type TUserSessionLang = {
  mainMenu: TMainMenu
  logOut: TLogOut
}
