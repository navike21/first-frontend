import type { ErrorTranslations } from '../types'

export const ko: ErrorTranslations = {
  forbidden: {
    heading: '접근 제한',
    message:
      '이 페이지에 접근할 활성 세션이 없습니다. 계속하려면 로그인하세요.',
    loginButton: '로그인',
  },
  notFound: {
    heading: '페이지를 찾을 수 없음',
    message:
      '찾으시는 페이지가 존재하지 않거나 이동되었습니다. URL을 확인하거나 홈으로 돌아가세요.',
    backButton: '이전 페이지',
    homeButton: '홈으로',
    loginButton: '로그인',
  },
  serverError: {
    heading: '서버 오류',
    message:
      '예기치 않은 서버 오류가 발생했습니다. 이미 확인하고 있습니다 — 잠시 후 다시 시도해 주세요.',
    retryButton: '다시 시도',
  },
}
