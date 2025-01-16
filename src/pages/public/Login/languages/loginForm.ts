import { ELanguages } from '@Enums/language'
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
