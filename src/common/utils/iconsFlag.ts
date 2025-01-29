import { ELanguages } from '@Enums/language'

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
  [key in ELanguages]: {
    icon: string
    text: string
  }
}

export const iconsFlag: TIconsFlag = {
  [ELanguages.DE]: {
    icon: germany,
    text: 'Deutsch',
  },
  [ELanguages.EN]: {
    icon: usa,
    text: 'English',
  },
  [ELanguages.ES]: {
    icon: spain,
    text: 'Español',
  },
  [ELanguages.FR]: {
    icon: france,
    text: 'Français',
  },
  [ELanguages.IT]: {
    icon: italy,
    text: 'Italiano',
  },
  [ELanguages.JP]: {
    icon: japan,
    text: '日本語',
  },
  [ELanguages.KO]: {
    icon: korea,
    text: '한국어',
  },
  [ELanguages.PT]: {
    icon: brazil,
    text: 'Português',
  },
  [ELanguages.RU]: {
    icon: rusia,
    text: 'Русский',
  },
  [ELanguages.ZH]: {
    icon: china,
    text: '中文',
  },
}
