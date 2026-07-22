import type { AuthTranslations } from '../types'

export const ko: AuthTranslations = {
  title: 'First',
  subtitle: 'navike21 관리자',
  form: {
    email: '이메일',
    password: '비밀번호',
    submit: '로그인',
    forgotPasswordLink: '비밀번호를 잊으셨나요?',
  },
  forgotPassword: {
    heading: '비밀번호를 잊으셨나요?',
    subtitle: '등록된 이메일로 복구 링크를 보내드립니다.',
    emailLabel: '이메일',
    submitButton: '링크 보내기',
    backToLoginLink: '← 로그인으로 돌아가기',
    successHeading: '이메일을 확인하세요',
  },
  resetPassword: {
    heading: '비밀번호 재설정',
    subtitle: '계정의 새 비밀번호를 만드세요.',
    newPasswordLabel: '새 비밀번호',
    confirmPasswordLabel: '비밀번호 확인',
    submitButton: '비밀번호 저장',
    successHeading: '비밀번호가 업데이트되었습니다',
    backToLoginLink: '로그인',
    invalidTokenHeading: '유효하지 않은 링크',
    invalidTokenMessage: '이 링크는 유효하지 않거나 만료되었습니다.',
    requestNewLinkLink: '새 링크 요청',
  },
  validation: {
    emailInvalid: '유효한 이메일 주소를 입력하세요',
    passwordMin: '비밀번호는 8자 이상이어야 합니다',
    passwordUppercase: '대문자를 하나 이상 포함해야 합니다',
    passwordNumber: '숫자를 하나 이상 포함해야 합니다',
    passwordMismatch: '비밀번호가 일치하지 않습니다',
  },
}
