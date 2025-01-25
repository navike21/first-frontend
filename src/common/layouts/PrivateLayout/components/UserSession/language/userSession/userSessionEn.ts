import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionEn: TUserSessionLang = {
  mainMenu: {
    title: 'Main Menu',
    items: [
      {
        label: 'Profile',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Messages',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Security',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Help and Support',
        icon: EIcons.HELP,
      },
      {
        label: 'System Information',
        icon: EIcons.INFO,
      },
    ],
  },
  logOut: {
    title: 'Log Out',
    modalConfirm: {
      title: 'Log Out',
      content: 'Are you sure you want to log out?',
      actions: {
        cancel: 'No, cancel',
        confirm: 'Yes, log out',
      },
    },
  },
}
