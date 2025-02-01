import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionEs: TUserSessionLang = {
  mainMenu: {
    title: 'Menú principal',
    items: [
      {
        label: 'Perfil',
        icon: EIcons.PROFILE,
        urlPath: 'perfil',
      },
      {
        label: 'Mensajes',
        icon: EIcons.MESSAGES,
        urlPath: 'mensajes',
      },
      {
        label: 'Seguridad',
        icon: EIcons.SECURITY,
        urlPath: 'seguridad',
      },
      {
        label: 'Ayuda y Soporte',
        icon: EIcons.HELP,
        urlPath: 'ayuda-y-soporte',
      },
      {
        label: 'Información del Sistema',
        icon: EIcons.INFO,
        urlPath: 'informacion-del-sistema',
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
