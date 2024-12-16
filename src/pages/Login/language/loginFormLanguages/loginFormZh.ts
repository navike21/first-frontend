import { MIN_PASSWORD_LENGTH } from '@Pages/Login/constants'
import { TLoginForm } from '@Pages/Login/types'

export const loginFormZh: TLoginForm = {
  fields: {
    email: {
      label: '电子邮件',
      placeholder: '输入您的电子邮件',
      error: '电子邮件无效',
      required: '电子邮件不能为空',
    },
    password: {
      label: '密码',
      placeholder: '输入您的密码',
      required: '密码不能为空',
      min: `密码至少需要${MIN_PASSWORD_LENGTH}个字符`,
      togglePassword: '显示或隐藏密码',
    },
    submit: {
      label: '登录',
    },
  },
  links: {
    forgotPassword: '忘记密码了吗？',
    getStarted: '开始',
  },
  title: '登录您的账户',
  subtitle: '还没有账户？',
  api: {
    error: {
      unexpected: '登录时出现意外错误',
    },
  },
}
