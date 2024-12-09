import { ELanguages } from '@Enums/language'
import {
  loginFormDe,
  loginFormEn,
  loginFormEs,
  loginFormFr,
  loginFormIt,
  loginFormJp,
  loginFormKo,
  loginFormPt,
  loginFormRu,
  loginFormZh,
} from './loginFormLanguages'

export const loginForm = {
  [ELanguages.DE]: loginFormDe,
  [ELanguages.EN]: loginFormEn,
  [ELanguages.ES]: loginFormEs,
  [ELanguages.FR]: loginFormFr,
  [ELanguages.IT]: loginFormIt,
  [ELanguages.JP]: loginFormJp,
  [ELanguages.KO]: loginFormKo,
  [ELanguages.RU]: loginFormRu,
  [ELanguages.PT]: loginFormPt,
  [ELanguages.ZH]: loginFormZh,
}
