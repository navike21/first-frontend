import type { Locale } from 'date-fns'
import { es, enUS, de, fr, pt, it, ja, ko, zhCN, ru } from 'date-fns/locale'
import type { Language } from '@/shared/types/languages'
import type { InputDateTexts } from './InputDate.types'

export const DATE_FNS_LOCALES: Record<Language, Locale> = {
  es,
  en: enUS,
  de,
  fr,
  pt,
  it,
  ja,
  ko,
  zh: zhCN,
  ru,
}

/** Default display formats per language (date-fns pattern strings) */
export const DATE_DISPLAY_FORMATS: Record<Language, string> = {
  es: "d 'de' MMMM 'de' yyyy", // 15 de enero de 2024
  en: 'MMMM d, yyyy', // January 15, 2024
  de: 'd. MMMM yyyy', // 15. Januar 2024
  fr: 'd MMMM yyyy', // 15 janvier 2024
  pt: "d 'de' MMMM 'de' yyyy", // 15 de janeiro de 2024
  it: 'd MMMM yyyy', // 15 gennaio 2024
  ja: 'yyyy年M月d日', // 2024年1月15日
  ko: 'yyyy년 M월 d일', // 2024년 1월 15일
  zh: 'yyyy年M月d日', // 2024年1月15日
  ru: "d MMMM yyyy 'г.'", // 15 января 2024 г.
}

/** Short display formats (used in range trigger) */
export const DATE_SHORT_FORMATS: Record<Language, string> = {
  es: 'dd/MM/yyyy',
  en: 'MM/dd/yyyy',
  de: 'dd.MM.yyyy',
  fr: 'dd/MM/yyyy',
  pt: 'dd/MM/yyyy',
  it: 'dd/MM/yyyy',
  ja: 'yyyy/MM/dd',
  ko: 'yyyy. MM. dd.',
  zh: 'yyyy/MM/dd',
  ru: 'dd.MM.yyyy',
}

/** Month-only display formats */
export const MONTH_DISPLAY_FORMATS: Record<Language, string> = {
  es: 'MMMM yyyy',
  en: 'MMMM yyyy',
  de: 'MMMM yyyy',
  fr: 'MMMM yyyy',
  pt: 'MMMM yyyy',
  it: 'MMMM yyyy',
  ja: 'yyyy年M月',
  ko: 'yyyy년 M월',
  zh: 'yyyy年M月',
  ru: 'MMMM yyyy',
}

export const INPUT_DATE_TEXTS: Record<Language, InputDateTexts> = {
  es: {
    clear: 'Limpiar',
    today: 'Hoy',
    apply: 'Aplicar',
    from: 'Desde',
    to: 'Hasta',
    placeholder: 'Seleccionar fecha',
    placeholderFrom: 'Fecha inicio',
    placeholderTo: 'Fecha fin',
  },
  en: {
    clear: 'Clear',
    today: 'Today',
    apply: 'Apply',
    from: 'From',
    to: 'To',
    placeholder: 'Select date',
    placeholderFrom: 'Start date',
    placeholderTo: 'End date',
  },
  de: {
    clear: 'Löschen',
    today: 'Heute',
    apply: 'Anwenden',
    from: 'Von',
    to: 'Bis',
    placeholder: 'Datum wählen',
    placeholderFrom: 'Startdatum',
    placeholderTo: 'Enddatum',
  },
  fr: {
    clear: 'Effacer',
    today: "Aujourd'hui",
    apply: 'Appliquer',
    from: 'De',
    to: 'À',
    placeholder: 'Sélectionner une date',
    placeholderFrom: 'Date de début',
    placeholderTo: 'Date de fin',
  },
  pt: {
    clear: 'Limpar',
    today: 'Hoje',
    apply: 'Aplicar',
    from: 'De',
    to: 'Até',
    placeholder: 'Selecionar data',
    placeholderFrom: 'Data inicial',
    placeholderTo: 'Data final',
  },
  it: {
    clear: 'Cancella',
    today: 'Oggi',
    apply: 'Applica',
    from: 'Da',
    to: 'A',
    placeholder: 'Seleziona data',
    placeholderFrom: 'Data inizio',
    placeholderTo: 'Data fine',
  },
  ja: {
    clear: 'クリア',
    today: '今日',
    apply: '適用',
    from: '開始',
    to: '終了',
    placeholder: '日付を選択',
    placeholderFrom: '開始日',
    placeholderTo: '終了日',
  },
  ko: {
    clear: '지우기',
    today: '오늘',
    apply: '적용',
    from: '시작',
    to: '종료',
    placeholder: '날짜 선택',
    placeholderFrom: '시작일',
    placeholderTo: '종료일',
  },
  zh: {
    clear: '清除',
    today: '今天',
    apply: '应用',
    from: '从',
    to: '到',
    placeholder: '选择日期',
    placeholderFrom: '开始日期',
    placeholderTo: '结束日期',
  },
  ru: {
    clear: 'Очистить',
    today: 'Сегодня',
    apply: 'Применить',
    from: 'От',
    to: 'До',
    placeholder: 'Выбрать дату',
    placeholderFrom: 'Дата начала',
    placeholderTo: 'Дата окончания',
  },
}
