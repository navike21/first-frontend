import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionEn: TUserSessionLang = {
  mainMenu: {
    title: 'Main Menu',
    items: [
      {
        label: 'Profile',
        icon: EIcons.PROFILE,
        urlPath: 'profile',
      },
      {
        label: 'Messages',
        icon: EIcons.MESSAGES,
        urlPath: 'messages',
      },
      {
        label: 'Security',
        icon: EIcons.SECURITY,
        urlPath: 'security',
      },
      {
        label: 'Help and Support',
        icon: EIcons.HELP,
        urlPath: 'help-and-support',
      },
      {
        label: 'System Information',
        icon: EIcons.INFO,
        urlPath: 'system-information',
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
