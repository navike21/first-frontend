import { createContext, useContext } from 'react'
import type { SelectTexts } from './Select.types'
import type { Language } from '@/shared/types/languages'

export const DEFAULT_SELECT_TEXTS: SelectTexts = {
  noOptionsFound: 'No options found',
  searchPlaceholder: 'Search...',
  searchAriaLabel: 'Search options',
  openOptionsAriaLabel: 'Open options',
  closeOptionsAriaLabel: 'Close options',
}

export const SELECT_TEXTS_BY_LANG: Record<Language, SelectTexts> = {
  es: {
    noOptionsFound: 'Sin opciones',
    searchPlaceholder: 'Buscar...',
    searchAriaLabel: 'Buscar opciones',
    openOptionsAriaLabel: 'Abrir opciones',
    closeOptionsAriaLabel: 'Cerrar opciones',
  },
  en: {
    noOptionsFound: 'No options found',
    searchPlaceholder: 'Search...',
    searchAriaLabel: 'Search options',
    openOptionsAriaLabel: 'Open options',
    closeOptionsAriaLabel: 'Close options',
  },
  de: {
    noOptionsFound: 'Keine Optionen',
    searchPlaceholder: 'Suchen...',
    searchAriaLabel: 'Optionen suchen',
    openOptionsAriaLabel: 'Optionen öffnen',
    closeOptionsAriaLabel: 'Optionen schließen',
  },
  fr: {
    noOptionsFound: 'Aucune option',
    searchPlaceholder: 'Rechercher...',
    searchAriaLabel: 'Rechercher des options',
    openOptionsAriaLabel: 'Ouvrir les options',
    closeOptionsAriaLabel: 'Fermer les options',
  },
  it: {
    noOptionsFound: 'Nessuna opzione',
    searchPlaceholder: 'Cerca...',
    searchAriaLabel: 'Cerca opzioni',
    openOptionsAriaLabel: 'Apri opzioni',
    closeOptionsAriaLabel: 'Chiudi opzioni',
  },
  ja: {
    noOptionsFound: '選択肢なし',
    searchPlaceholder: '検索...',
    searchAriaLabel: 'オプションを検索',
    openOptionsAriaLabel: 'オプションを開く',
    closeOptionsAriaLabel: 'オプションを閉じる',
  },
  ko: {
    noOptionsFound: '옵션 없음',
    searchPlaceholder: '검색...',
    searchAriaLabel: '옵션 검색',
    openOptionsAriaLabel: '옵션 열기',
    closeOptionsAriaLabel: '옵션 닫기',
  },
  pt: {
    noOptionsFound: 'Sem opções',
    searchPlaceholder: 'Pesquisar...',
    searchAriaLabel: 'Pesquisar opções',
    openOptionsAriaLabel: 'Abrir opções',
    closeOptionsAriaLabel: 'Fechar opções',
  },
  zh: {
    noOptionsFound: '无选项',
    searchPlaceholder: '搜索...',
    searchAriaLabel: '搜索选项',
    openOptionsAriaLabel: '打开选项',
    closeOptionsAriaLabel: '关闭选项',
  },
  ru: {
    noOptionsFound: 'Нет вариантов',
    searchPlaceholder: 'Поиск...',
    searchAriaLabel: 'Поиск вариантов',
    openOptionsAriaLabel: 'Открыть варианты',
    closeOptionsAriaLabel: 'Закрыть варианты',
  },
}

const SelectTextsContext = createContext<SelectTexts>(DEFAULT_SELECT_TEXTS)

export const SelectTextsProvider = SelectTextsContext.Provider

export const useSelectTexts = () => useContext(SelectTextsContext)
