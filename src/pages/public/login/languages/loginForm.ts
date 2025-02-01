import { ELanguage } from '@Enums/language'
import { loginFormDe } from './loginFormLanguages/loginFormDe'
import { loginFormEn } from './loginFormLanguages/loginFormEn'
import { loginFormEs } from './loginFormLanguages/loginFormEs'
import { loginFormFr } from './loginFormLanguages/loginFormFr'
import { loginFormIt } from './loginFormLanguages/loginFormIt'
import { loginFormJp } from './loginFormLanguages/loginFormJp'
import { loginFormKo } from './loginFormLanguages/loginFormKo'
import { loginFormRu } from './loginFormLanguages/loginFormRu'
import { loginFormPt } from './loginFormLanguages/loginFormPt'
import { loginFormZh } from './loginFormLanguages/loginFormZh'

export const loginForm = {
  [ELanguage.DE]: loginFormDe,
  [ELanguage.EN]: loginFormEn,
  [ELanguage.ES]: loginFormEs,
  [ELanguage.FR]: loginFormFr,
  [ELanguage.IT]: loginFormIt,
  [ELanguage.JP]: loginFormJp,
  [ELanguage.KO]: loginFormKo,
  [ELanguage.RU]: loginFormRu,
  [ELanguage.PT]: loginFormPt,
  [ELanguage.ZH]: loginFormZh,
}
