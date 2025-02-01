import { ELanguage } from '@Enums/language'

import brazil from '@Assets/svg/brazil.svg'
import china from '@Assets/svg/china.svg'
import france from '@Assets/svg/france.svg'
import germany from '@Assets/svg/germany.svg'
import italy from '@Assets/svg/italy.svg'
import japan from '@Assets/svg/japan.svg'
import korea from '@Assets/svg/korea.svg'
import rusia from '@Assets/svg/rusia.svg'
import spain from '@Assets/svg/spain.svg'
import usa from '@Assets/svg/usa.svg'

type TIconsFlag = {
  [key in ELanguage]: {
    icon: string
    text: string
  }
}

export const iconsFlag: TIconsFlag = {
  [ELanguage.DE]: {
    icon: germany,
    text: 'Deutsch',
  },
  [ELanguage.EN]: {
    icon: usa,
    text: 'English',
  },
  [ELanguage.ES]: {
    icon: spain,
    text: 'Español',
  },
  [ELanguage.FR]: {
    icon: france,
    text: 'Français',
  },
  [ELanguage.IT]: {
    icon: italy,
    text: 'Italiano',
  },
  [ELanguage.JP]: {
    icon: japan,
    text: '日本語',
  },
  [ELanguage.KO]: {
    icon: korea,
    text: '한국어',
  },
  [ELanguage.PT]: {
    icon: brazil,
    text: 'Português',
  },
  [ELanguage.RU]: {
    icon: rusia,
    text: 'Русский',
  },
  [ELanguage.ZH]: {
    icon: china,
    text: '中文',
  },
}
