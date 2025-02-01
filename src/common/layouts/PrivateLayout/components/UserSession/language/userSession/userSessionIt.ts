import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionIt: TUserSessionLang = {
  mainMenu: {
    title: 'Menu Principale',
    items: [
      {
        label: 'Profilo',
        icon: EIcons.PROFILE,
        urlPath: 'profilo',
      },
      {
        label: 'Messaggi',
        icon: EIcons.MESSAGES,
        urlPath: 'messaggi',
      },
      {
        label: 'Sicurezza',
        icon: EIcons.SECURITY,
        urlPath: 'sicurezza',
      },
      {
        label: 'Aiuto e Supporto',
        icon: EIcons.HELP,
        urlPath: 'aiuto-e-supporto',
      },
      {
        label: 'Informazioni di Sistema',
        icon: EIcons.INFO,
        urlPath: 'informazioni-di-sistema',
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
