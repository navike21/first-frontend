import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionZh: TUserSessionLang = {
  mainMenu: {
    title: '主菜单',
    items: [
      {
        label: '个人资料',
        icon: EIcons.PROFILE,
      },
      {
        label: '消息',
        icon: EIcons.MESSAGES,
      },
      {
        label: '安全性',
        icon: EIcons.SECURITY,
      },
      {
        label: '帮助和支持',
        icon: EIcons.HELP,
      },
      {
        label: '系统信息',
        icon: EIcons.INFO,
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
