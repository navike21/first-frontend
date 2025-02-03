import { ELanguage } from '@Enums/language'

export type TUrlPathData = {
  title: string
  slug: string
}

export type TUrlPath = Record<ELanguage, TUrlPathData>
