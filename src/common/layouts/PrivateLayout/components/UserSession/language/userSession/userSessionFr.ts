import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionFr: TUserSessionLang = {
  mainMenu: {
    title: 'Menu Principal',
    items: [
      {
        label: 'Profil',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Messages',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Sécurité',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Aide et Support',
        icon: EIcons.HELP,
      },
      {
        label: 'Informations Système',
        icon: EIcons.INFO,
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
