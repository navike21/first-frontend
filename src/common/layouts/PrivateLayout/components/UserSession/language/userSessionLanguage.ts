import { ELanguages } from '@Enums/language'
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
  [ELanguages.DE]: userSessionDe,
  [ELanguages.EN]: userSessionEn,
  [ELanguages.ES]: userSessionEs,
  [ELanguages.FR]: userSessionFr,
  [ELanguages.IT]: userSessionIt,
  [ELanguages.JP]: userSessionJp,
  [ELanguages.KO]: userSessionKo,
  [ELanguages.PT]: userSessionPt,
  [ELanguages.RU]: userSessionRu,
  [ELanguages.ZH]: userSessionZh,
}
