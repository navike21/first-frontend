import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionEs: TUserSessionLang = {
  mainMenu: {
    title: 'Menú principal',
    items: [
      {
        label: 'Perfil',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Mensajes',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Seguridad',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Ayuda y soporte',
        icon: EIcons.HELP,
      },
      {
        label: 'Información del sistema',
        icon: EIcons.INFO,
      },
    ],
  },
  logOut: {
    title: 'Cerrar sesión',
    modalConfirm: {
      title: 'Cerrar sesión',
      content: '¿Estás seguro de que deseas cerrar sesión?',
      actions: {
        cancel: 'No, cancelar',
        confirm: 'Sí, cerrar sesión',
      },
    },
  },
}
