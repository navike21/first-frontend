import type { UsersTranslations } from '../types'

export const ko: UsersTranslations = {
  page: {
    listTitle: '사용자',
    listDescription: '시스템 사용자를 관리합니다',
    createTitle: '새 사용자',
    createDescription: '새 사용자를 등록하려면 필드를 입력하세요',
    editTitle: '사용자 편집',
    editDescription: (name) => `${name}의 정보를 수정합니다`,
  },
  table: {
    noResults: '사용자를 찾을 수 없습니다',
    colUser: '사용자', colEmail: '이메일', colStatus: '상태',
    colPresence: '접속 상태', colActions: '작업',
    editUser: '사용자 편집', deleteUser: '사용자 삭제',
    prevPage: '이전 페이지', nextPage: '다음 페이지',
    totalCount: (n) => `총 ${n}명`,
  },
  status: { active: '활성', inactive: '비활성', deleted: '삭제됨' },
  presence: { available: '온라인', busy: '바쁨', away: '자리 비움', offline: '오프라인' },
  form: {
    firstName: '이름', firstNamePlaceholder: '철수',
    lastName: '성', lastNamePlaceholder: '김',
    email: '이메일', emailPlaceholder: 'user@navike21.com',
    password: '비밀번호', passwordPlaceholder: '8자 이상',
    phone: '전화번호', phonePlaceholder: '+82 10 0000 0000',
    gender: '성별', genderPlaceholder: '선택',
    genderFemale: '여성', genderMale: '남성',
    genderOther: '기타', genderPreferNotToSay: '응답 안 함',
    statusLabel: '상태', statusActive: '활성', statusInactive: '비활성',
    createButton: '사용자 생성', saveButton: '변경 저장', cancelButton: '취소',
  },
  actions: {
    newUser: '새 사용자',
    deactivateTitle: '사용자 비활성화',
    deactivateDescription: (first, last) =>
      `${last} ${first}를 비활성화하시겠습니까? 사용자는 시스템 접근 권한을 잃게 됩니다.`,
    confirmDeactivate: '비활성화',
    cancel: '취소',
  },
  filters: {
    searchLabel: '검색', searchPlaceholder: '이름 또는 이메일…',
    statusLabel: '상태', statusAll: '전체',
    statusActive: '활성', statusInactive: '비활성',
  },
  toasts: {
    created: '사용자가 생성되었습니다',
    updated: '사용자가 업데이트되었습니다',
    deactivated: '사용자가 비활성화되었습니다',
  },
}
