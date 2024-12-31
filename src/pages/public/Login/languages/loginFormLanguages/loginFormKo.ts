import { MIN_PASSWORD_LENGTH } from '../../constants/constants'
import { TLoginForm } from '../../types/types'

export const loginFormKo: TLoginForm = {
  fields: {
    email: {
      label: '이메일',
      placeholder: '이메일을 입력하세요',
      error: '유효한 이메일이 아닙니다',
      required: '이메일은 비워둘 수 없습니다',
    },
    password: {
      label: '비밀번호',
      placeholder: '비밀번호를 입력하세요',
      required: '비밀번호는 비워둘 수 없습니다',
      min: `비밀번호는 최소 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다`,
      togglePassword: '비밀번호 표시 또는 숨기기',
    },
    submit: {
      label: '로그인',
    },
  },
  links: {
    forgotPassword: '비밀번호를 잊으셨나요?',
    getStarted: '시작하기',
  },
  title: '계정에 로그인하세요',
  subtitle: '계정이 없으신가요?',
  api: {
    error: {
      unexpected: '로그인 중 예기치 않은 오류가 발생했습니다',
    },
  },
}
