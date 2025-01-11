import { TSettingsLang } from '../../types/settingsLang'

export const settingsKo: TSettingsLang = {
  title: '설정',
  principalSettings: {
    themeMode: {
      light: '라이트 모드',
      dark: '다크 모드',
      title: '테마 모드',
    },
    compact: {
      title: '콤팩트',
      description: `이 모드는 1600px 이상의 해상도를 가진 화면에서만 구별할 수 있습니다.`,
    },
    principalColor: {
      title: '주요 색상',
      description: `애플리케이션의 주요 색상을 선택하세요.`,
    },
    fontSize: {
      title: '글꼴 크기',
      description: `애플리케이션의 글꼴 크기를 선택하세요.`,
    },
  },
  actions: {
    resetAll: '모두 초기화',
    fullscreen: '전체 화면',
  },
}
