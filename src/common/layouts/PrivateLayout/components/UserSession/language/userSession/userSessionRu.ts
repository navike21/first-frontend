import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionRu: TUserSessionLang = {
  mainMenu: {
    title: 'Главное меню',
    items: [
      {
        label: 'Профиль',
        icon: EIcons.PROFILE,
      },
      {
        label: 'Сообщения',
        icon: EIcons.MESSAGES,
      },
      {
        label: 'Безопасность',
        icon: EIcons.SECURITY,
      },
      {
        label: 'Помощь и поддержка',
        icon: EIcons.HELP,
      },
      {
        label: 'Информация о системе',
        icon: EIcons.INFO,
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
