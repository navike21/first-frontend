import { EIcons } from '../../enums/icons'
import { TUserSessionLang } from '../../types/userSessionLang'

export const userSessionKo: TUserSessionLang = {
  mainMenu: {
    title: '메인 메뉴',
    items: [
      {
        label: '프로필',
        icon: EIcons.PROFILE,
        urlPath: 'profile',
      },
      {
        label: '메시지',
        icon: EIcons.MESSAGES,
        urlPath: 'messages',
      },
      {
        label: '보안',
        icon: EIcons.SECURITY,
        urlPath: 'security',
      },
      {
        label: '도움말 및 지원',
        icon: EIcons.HELP,
        urlPath: 'help-and-support',
      },
      {
        label: '시스템 정보',
        icon: EIcons.INFO,
        urlPath: 'system-information',
      },
    ],
  },
  logOut: {
    title: '로그아웃',
    modalConfirm: {
      title: '로그아웃',
      content: '로그아웃 하시겠습니까?',
      actions: {
        cancel: '아니요, 취소',
        confirm: '예, 로그아웃',
      },
    },
  },
}
