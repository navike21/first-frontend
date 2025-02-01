import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionZh: TUserSessionLang = {
  mainMenu: {
    title: '主菜单',
    items: [
      {
        label: '个人资料',
        icon: EIcons.PROFILE,
        urlPath: 'profile',
      },
      {
        label: '消息',
        icon: EIcons.MESSAGES,
        urlPath: 'messages',
      },
      {
        label: '安全性',
        icon: EIcons.SECURITY,
        urlPath: 'security',
      },
      {
        label: '帮助和支持',
        icon: EIcons.HELP,
        urlPath: 'help-and-support',
      },
      {
        label: '系统信息',
        icon: EIcons.INFO,
        urlPath: 'system-information',
      },
    ],
  },
  logOut: {
    title: '登出',
    modalConfirm: {
      title: '登出',
      content: '您确定要登出吗？',
      actions: {
        cancel: '否，取消',
        confirm: '是，登出',
      },
    },
  },
}
