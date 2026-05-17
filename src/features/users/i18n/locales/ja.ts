import type { UsersTranslations } from '../types'

export const ja: UsersTranslations = {
  page: {
    listTitle: 'ユーザー',
    listDescription: 'システムユーザーを管理する',
    createTitle: '新規ユーザー',
    createDescription: 'フィールドに入力して新しいユーザーを登録してください',
    editTitle: 'ユーザーを編集',
    editDescription: (name) => `${name} のデータを編集する`,
  },
  table: {
    noResults: 'ユーザーが見つかりません',
    colUser: 'ユーザー', colEmail: 'メール', colStatus: 'ステータス',
    colPresence: 'プレゼンス', colActions: 'アクション',
    editUser: 'ユーザーを編集', deleteUser: 'ユーザーを削除',
    prevPage: '前のページ', nextPage: '次のページ',
    totalCount: (n) => `合計 ${n} 件`,
  },
  status: { active: '有効', inactive: '無効', deleted: '削除済み' },
  presence: { available: '対応可', busy: '対応不可', away: '離席中', offline: 'オフライン' },
  form: {
    firstName: '名', firstNamePlaceholder: '太郎',
    lastName: '姓', lastNamePlaceholder: '山田',
    email: 'メール', emailPlaceholder: 'user@navike21.com',
    password: 'パスワード', passwordPlaceholder: '8文字以上',
    phone: '電話番号', phonePlaceholder: '+81 90 0000 0000',
    gender: '性別', genderPlaceholder: '選択する',
    genderFemale: '女性', genderMale: '男性',
    genderOther: 'その他', genderPreferNotToSay: '回答しない',
    statusLabel: 'ステータス', statusActive: '有効', statusInactive: '無効',
    createButton: 'ユーザーを作成', saveButton: '変更を保存', cancelButton: 'キャンセル',
  },
  actions: {
    newUser: '新規ユーザー',
    deactivateTitle: 'ユーザーを無効化',
    deactivateDescription: (first, last) =>
      `${last} ${first} を無効化しますか？ユーザーはシステムへのアクセスを失います。`,
    confirmDeactivate: '無効化',
    cancel: 'キャンセル',
  },
  filters: {
    searchLabel: '検索', searchPlaceholder: '名前またはメール…',
    statusLabel: 'ステータス', statusAll: 'すべて',
    statusActive: '有効', statusInactive: '無効',
  },
  toasts: {
    created: 'ユーザーを作成しました',
    updated: 'ユーザーを更新しました',
    deactivated: 'ユーザーを無効化しました',
  },
  validation: {
    emailInvalid: '無効なメールアドレスです',
    passwordMin: '8文字以上必要です',
    passwordUppercase: '大文字を1文字以上含める必要があります',
    passwordNumber: '数字を1文字以上含める必要があります',
    fieldMin2: '2文字以上必要です',
    dateFormat: '形式: YYYY-MM-DD',
    urlInvalid: '無効なURLです',
  },
}
