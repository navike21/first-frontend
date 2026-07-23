import type { TagTranslations } from '../types'

export const ko: TagTranslations = {
  page: {
    listTitle: '태그',
    listDescription: '페이지를 정리하는 데 사용되는 태그를 관리합니다',
    createTitle: '새 태그',
    createDescription: '새 태그 등록',
    editTitle: '태그 편집',
    editDescription: (name) => `${name} 업데이트`,
    trashTitle: '태그 휴지통',
    trashDescription:
      '휴지통으로 이동된 태그입니다. 복원하거나 영구 삭제할 수 있습니다.',
    trashEmpty: '휴지통에 태그가 없습니다',
    trashEmptyDescription: '삭제된 태그가 여기에 표시됩니다.',
  },
  table: {
    noResults: '태그를 찾을 수 없습니다',
    colName: '이름',
    colSlug: '슬러그',
    colStatus: '상태',
    colActions: '작업',
    editTag: '태그 편집',
    deleteTag: '태그 삭제',
    viewTag: '상세 보기',
    restoreTag: '복원',
    purgeTag: '영구 삭제',
    prevPage: '이전',
    nextPage: '다음',
    totalCount: (count) => `총: ${count}`,
    deletedAt: '삭제됨',
    selectAll: '전체 선택',
    selectRow: '행 선택',
  },
  filters: {
    searchLabel: '검색',
    searchPlaceholder: '이름으로 검색…',
    statusLabel: '상태',
    statusAll: '전체',
    statusActive: '활성',
    statusInactive: '비활성',
  },
  status: {
    active: '활성',
    inactive: '비활성',
  },
  actions: {
    newTag: '새 태그',
    viewTrash: '휴지통 보기',
    cancel: '취소',
    selectedCount: (count) => `${count}개 선택됨`,
    clearSelection: '선택 해제',
    bulkDelete: '삭제',
    bulkRestore: '복원',
    bulkPurge: '영구 삭제',
    deleteTitle: '태그 삭제',
    deleteDescription: (name) =>
      `${name}을(를) 삭제하시겠습니까? 휴지통에서 복원할 수 있습니다.`,
    confirmDelete: '삭제',
    bulkDeleteDescription: (count) =>
      `${count}개의 태그를 삭제하시겠습니까? 휴지통에서 복원할 수 있습니다.`,
    restoreTitle: '태그 복원',
    restoreDescription: (name) =>
      `${name}을(를) 활성 목록으로 복원하시겠습니까?`,
    confirmRestore: '복원',
    bulkRestoreDescription: (count) =>
      `태그 ${count}개를 활성 목록으로 복원하시겠습니까?`,
    purgeTitle: '영구 삭제',
    purgeDescription: (name) =>
      `${name}을(를) 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.`,
    confirmPurge: '삭제',
    bulkPurgeDescription: (count) =>
      `태그 ${count}개를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.`,
  },
  form: {
    tabTranslations: '번역',
    name: '이름',
    slug: '슬러그',
    order: '순서',
    isActive: '활성',
    save: '변경 사항 저장',
    create: '태그 생성',
    cancel: '취소',
  },
  toasts: {
    created: '태그가 생성되었습니다',
    updated: '태그가 업데이트되었습니다',
    deleted: '태그가 삭제되었습니다',
    restored: '태그가 복원되었습니다',
    purged: '태그가 영구적으로 삭제되었습니다',
    bulkDeleted: '태그가 삭제되었습니다',
    bulkRestored: '태그가 복원되었습니다',
    bulkPurged: '태그가 영구적으로 삭제되었습니다',
  },
  validation: {
    required: '필수 항목',
    slugInvalid: '소문자, 숫자, 하이픈만 사용할 수 있습니다',
  },
}
