import type { ErrorTranslations } from '../types'

export const zh: ErrorTranslations = {
  forbidden: {
    heading: '访问受限',
    message: '您没有访问此页面的活跃会话。请登录以继续。',
    loginButton: '登录',
  },
  notFound: {
    heading: '页面未找到',
    message: '您查找的页面不存在或已被移动。请检查网址或返回首页。',
    backButton: '上一页',
    homeButton: '返回首页',
    loginButton: '登录',
  },
  serverError: {
    heading: '服务器错误',
    message: '服务器发生了意外错误。我们正在处理 — 请几分钟后再试。',
    retryButton: '重试',
  },
}
