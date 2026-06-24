import type { AuditLogsTranslations } from '../types'

export const ru: AuditLogsTranslations = {
  page: {
    title: 'Журналы аудита',
    desc: 'Модуль активности системы и журналов аудита',
  },
  table: {
    colDate: 'Дата и время',
    colUser: 'ID пользователя',
    colAction: 'Действие',
    colResource: 'Ресурс',
    colIp: 'IP-адрес',
    noResults: 'Журналы аудита не найдены',
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
    totalCount: (n) => `Всего записей: ${n}`,
  },
}
