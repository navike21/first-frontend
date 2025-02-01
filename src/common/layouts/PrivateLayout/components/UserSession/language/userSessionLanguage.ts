import { ELanguage } from '@Enums/language'
import {
  userSessionDe,
  userSessionEn,
  userSessionEs,
  userSessionFr,
  userSessionIt,
  userSessionJp,
  userSessionKo,
  userSessionPt,
  userSessionRu,
  userSessionZh,
} from './userSession'

export const userSessionLanguage = {
  [ELanguage.DE]: userSessionDe,
  [ELanguage.EN]: userSessionEn,
  [ELanguage.ES]: userSessionEs,
  [ELanguage.FR]: userSessionFr,
  [ELanguage.IT]: userSessionIt,
  [ELanguage.JP]: userSessionJp,
  [ELanguage.KO]: userSessionKo,
  [ELanguage.PT]: userSessionPt,
  [ELanguage.RU]: userSessionRu,
  [ELanguage.ZH]: userSessionZh,
}
