import type { AuditLogsTranslations } from '../types'

export const ko: AuditLogsTranslations = {
  page: {
    title: '감사 로그',
    desc: '시스템 활동 및 감사 로그 모듈',
  },
  table: {
    colDate: '날짜 및 시간',
    colUser: '사용자 ID',
    colAction: '작업',
    colResource: '리소스',
    colIp: 'IP 주소',
    noResults: '감사 로그를 찾을 수 없습니다',
    prevPage: '이전 페이지',
    nextPage: '다음 페이지',
    totalCount: (n) => `총 ${n}개의 감사 로그`,
  },
}
