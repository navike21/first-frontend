import { ELanguage } from '@Enums/language'

export type TUrlPath = {
  [key in ELanguage]: string
}
