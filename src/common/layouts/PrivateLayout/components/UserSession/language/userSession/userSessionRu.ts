import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionRu: TUserSessionLang = {
  mainMenu: {
    title: 'Главное меню',
    items: [
      {
        label: 'Профиль',
        icon: EIcons.PROFILE,
        urlPath: 'profile',
      },
      {
        label: 'Сообщения',
        icon: EIcons.MESSAGES,
        urlPath: 'messages',
      },
      {
        label: 'Безопасность',
        icon: EIcons.SECURITY,
        urlPath: 'security',
      },
      {
        label: 'Помощь и поддержка',
        icon: EIcons.HELP,
        urlPath: 'help-and-support',
      },
      {
        label: 'Информация о системе',
        icon: EIcons.INFO,
        urlPath: 'system-information',
      },
    ],
  },
  logOut: {
    title: 'Выйти',
    modalConfirm: {
      title: 'Выйти',
      content: 'Вы уверены, что хотите выйти?',
      actions: {
        cancel: 'Нет, отмена',
        confirm: 'Да, выйти',
      },
    },
  },
}
