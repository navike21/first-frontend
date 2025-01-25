import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionDe: TUserSessionLang = {
  mainMenu: {
    title: 'Hauptmenü',
    items: [
      {
        label: 'Profil',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Nachrichten',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Sicherheit',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Hilfe und Support',
        icon: EIcons.HELP,
      },
      {
        label: 'Systeminformationen',
        icon: EIcons.INFO,
      },
    ],
  },
  logOut: {
    title: 'Abmelden',
    modalConfirm: {
      title: 'Abmelden',
      content: 'Sind Sie sicher, dass Sie sich abmelden möchten?',
      actions: {
        cancel: 'Nein, abbrechen',
        confirm: 'Ja, abmelden',
      },
    },
  },
}
