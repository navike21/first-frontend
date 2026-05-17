import { SLUG_TO_MODULE, ROUTE_SLUGS } from './route-slugs'
import type { Language } from '@/shared/types/languages'
import type { RouteModule } from './route-slugs'

const MODULE_LABELS: Record<RouteModule, Record<Language, string>> = {
  users: {
    es: 'Usuarios', en: 'Users', de: 'Benutzer', fr: 'Utilisateurs',
    pt: 'Utilizadores', it: 'Utenti', ja: 'ユーザー', ko: '사용자', zh: '用户', ru: 'Пользователи',
  },
  userCreate: {
    es: 'Nuevo', en: 'New', de: 'Neu', fr: 'Nouveau',
    pt: 'Novo', it: 'Nuovo', ja: '新規', ko: '새로', zh: '新建', ru: 'Новый',
  },
  userEdit: {
    es: 'Editar', en: 'Edit', de: 'Bearbeiten', fr: 'Modifier',
    pt: 'Alterar', it: 'Modifica', ja: '編集', ko: '편집', zh: '编辑', ru: 'Редактировать',
  },
}

const HOME_LABELS: Record<Language, string> = {
  es: 'Inicio', en: 'Home', de: 'Start', fr: 'Accueil',
  pt: 'Início', it: 'Inizio', ja: 'ホーム', ko: '홈', zh: '首页', ru: 'Главная',
}

export function getSegmentLabel(slug: string, uiLang: Language): string {
  const module = SLUG_TO_MODULE[slug]
  if (module) return MODULE_LABELS[module][uiLang]
  return slug
}

export function getHomeLabel(lang: Language): string {
  return HOME_LABELS[lang]
}

// Kept for backwards-compat; prefer getSegmentLabel for new code
export const SEGMENT_LABELS: Readonly<Record<string, string>> = Object.fromEntries(
  (Object.keys(ROUTE_SLUGS) as RouteModule[]).flatMap((module) =>
    Object.values(ROUTE_SLUGS[module]).map((slug) => [slug, MODULE_LABELS[module].es]),
  ),
)
