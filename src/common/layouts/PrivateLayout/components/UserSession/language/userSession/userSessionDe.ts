import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionDe: TUserSessionLang = {
  mainMenu: {
    title: 'Hauptmenü',
    items: [
      {
        label: 'Profil',
        icon: EIcons.PROFILE,
        urlPath: 'profil',
      },
      {
        label: 'Nachrichten',
        icon: EIcons.MESSAGES,
        urlPath: 'nachrichten',
      },
      {
        label: 'Sicherheit',
        icon: EIcons.SECURITY,
        urlPath: 'sicherheit',
      },
      {
        label: 'Hilfe und Support',
        icon: EIcons.HELP,
        urlPath: 'hilfe-und-support',
      },
      {
        label: 'Systeminformationen',
        icon: EIcons.INFO,
        urlPath: 'systeminformationen',
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
