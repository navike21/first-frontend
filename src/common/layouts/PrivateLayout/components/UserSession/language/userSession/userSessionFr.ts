import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionFr: TUserSessionLang = {
  mainMenu: {
    title: 'Menu Principal',
    items: [
      {
        label: 'Profil',
        icon: EIcons.PROFILE,
        urlPath: 'profil',
      },
      {
        label: 'Messages',
        icon: EIcons.MESSAGES,
        urlPath: 'messages',
      },
      {
        label: 'Sécurité',
        icon: EIcons.SECURITY,
        urlPath: 'securite',
      },
      {
        label: 'Aide et Support',
        icon: EIcons.HELP,
        urlPath: 'aide-et-support',
      },
      {
        label: 'Informations Système',
        icon: EIcons.INFO,
        urlPath: 'informations-systeme',
      },
    ],
  },
  logOut: {
    title: 'Se Déconnecter',
    modalConfirm: {
      title: 'Se Déconnecter',
      content: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      actions: {
        cancel: 'Non, annuler',
        confirm: 'Oui, se déconnecter',
      },
    },
  },
}
