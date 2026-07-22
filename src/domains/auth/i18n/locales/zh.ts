import type { AuthTranslations } from '../types'

export const zh: AuthTranslations = {
  title: 'First',
  subtitle: 'navike21 管理系统',
  form: {
    email: '电子邮件',
    password: '密码',
    submit: '登录',
    forgotPasswordLink: '忘记密码？',
  },
  forgotPassword: {
    heading: '忘记密码？',
    subtitle: '我们将向您注册的邮箱发送恢复链接。',
    emailLabel: '电子邮件',
    submitButton: '发送链接',
    backToLoginLink: '← 返回登录',
    successHeading: '请查看您的邮箱',
  },
  resetPassword: {
    heading: '重置密码',
    subtitle: '为您的账户创建一个新密码。',
    newPasswordLabel: '新密码',
    confirmPasswordLabel: '确认密码',
    submitButton: '保存密码',
    successHeading: '密码已更新',
    backToLoginLink: '登录',
    invalidTokenHeading: '链接无效',
    invalidTokenMessage: '此链接无效或已过期。',
    requestNewLinkLink: '请求新链接',
  },
  validation: {
    emailInvalid: '请输入有效的电子邮件地址',
    passwordMin: '密码至少需要8个字符',
    passwordUppercase: '必须包含至少一个大写字母',
    passwordNumber: '必须包含至少一个数字',
    passwordMismatch: '两次输入的密码不一致',
  },
}
