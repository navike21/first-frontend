import type { AuditLogsTranslations } from '../types'

export const ru: AuditLogsTranslations = {
  page: {
    title: 'Журналы аудита',
    desc: 'Модуль активности системы и журналов аудита',
  },
  table: {
    colDate: 'Дата и время',
    colUser: 'Пользователь',
    colAction: 'Действие',
    colResource: 'Ресурс',
    colIp: 'IP-адрес',
    colActions: 'Действия',
    noResults: 'Журналы аудита не найдены',
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
    totalCount: (n) => `Всего записей: ${n}`,
    viewDetail: 'Показать детали',
  },
  detail: {
    title: 'Детали записи журнала',
    colUserAgent: 'Устройство / User Agent',
    colMetadata: 'Данные действия (Метаданные)',
    closeButton: 'Закрыть',
  },
}
