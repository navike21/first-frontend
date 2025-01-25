import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionIt: TUserSessionLang = {
  mainMenu: {
    title: 'Menu Principale',
    items: [
      {
        label: 'Profilo',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Messaggi',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Sicurezza',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Aiuto e Supporto',
        icon: EIcons.HELP,
      },
      {
        label: 'Informazioni di Sistema',
        icon: EIcons.INFO,
      },
    ],
  },
  logOut: {
    title: 'Disconnettersi',
    modalConfirm: {
      title: 'Disconnettersi',
      content: 'Sei sicuro di voler uscire?',
      actions: {
        cancel: 'No, annulla',
        confirm: 'Sì, disconnettersi',
      },
    },
  },
}
