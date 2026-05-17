import type { UsersTranslations } from '../types'

export const zh: UsersTranslations = {
  page: {
    listTitle: '用户',
    listDescription: '管理系统用户',
    createTitle: '新用户',
    createDescription: '填写字段以注册新用户',
    editTitle: '编辑用户',
    editDescription: (name) => `编辑 ${name} 的信息`,
  },
  table: {
    noResults: '未找到用户',
    colUser: '用户', colEmail: '邮箱', colStatus: '状态',
    colPresence: '在线状态', colActions: '操作',
    editUser: '编辑用户', deleteUser: '删除用户',
    prevPage: '上一页', nextPage: '下一页',
    totalCount: (n) => `共 ${n} 位用户`,
  },
  status: { active: '活跃', inactive: '非活跃', deleted: '已删除' },
  presence: { available: '在线', busy: '忙碌', away: '离开', offline: '离线' },
  form: {
    firstName: '名', firstNamePlaceholder: '伟',
    lastName: '姓', lastNamePlaceholder: '张',
    email: '邮箱', emailPlaceholder: 'user@navike21.com',
    password: '密码', passwordPlaceholder: '至少8个字符',
    phone: '电话', phonePlaceholder: '+86 130 0000 0000',
    gender: '性别', genderPlaceholder: '请选择',
    genderFemale: '女', genderMale: '男',
    genderOther: '其他', genderPreferNotToSay: '不愿透露',
    statusLabel: '状态', statusActive: '活跃', statusInactive: '非活跃',
    createButton: '创建用户', saveButton: '保存更改', cancelButton: '取消',
  },
  actions: {
    newUser: '新用户',
    deactivateTitle: '停用用户',
    deactivateDescription: (first, last) =>
      `确认停用 ${last}${first}？该用户将失去系统访问权限。`,
    confirmDeactivate: '停用',
    cancel: '取消',
  },
  filters: {
    searchLabel: '搜索', searchPlaceholder: '姓名或邮箱…',
    statusLabel: '状态', statusAll: '全部',
    statusActive: '活跃', statusInactive: '非活跃',
  },
  toasts: {
    created: '用户创建成功',
    updated: '用户更新成功',
    deactivated: '用户停用成功',
  },
  validation: {
    emailInvalid: '邮箱格式无效',
    passwordMin: '至少需要8个字符',
    passwordUppercase: '必须包含至少一个大写字母',
    passwordNumber: '必须包含至少一个数字',
    fieldMin2: '至少需要2个字符',
    dateFormat: '格式：YYYY-MM-DD',
    urlInvalid: '无效的URL',
  },
}
