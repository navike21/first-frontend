import PE from 'country-flag-icons/react/3x2/PE'
import AR from 'country-flag-icons/react/3x2/AR'
import BO from 'country-flag-icons/react/3x2/BO'
import BR from 'country-flag-icons/react/3x2/BR'
import CL from 'country-flag-icons/react/3x2/CL'
import CO from 'country-flag-icons/react/3x2/CO'
import EC from 'country-flag-icons/react/3x2/EC'
import PY from 'country-flag-icons/react/3x2/PY'
import UY from 'country-flag-icons/react/3x2/UY'
import VE from 'country-flag-icons/react/3x2/VE'
import ES from 'country-flag-icons/react/3x2/ES'
import US from 'country-flag-icons/react/3x2/US'
import DE from 'country-flag-icons/react/3x2/DE'
import FR from 'country-flag-icons/react/3x2/FR'
import PT from 'country-flag-icons/react/3x2/PT'
import IT from 'country-flag-icons/react/3x2/IT'
import JP from 'country-flag-icons/react/3x2/JP'
import KR from 'country-flag-icons/react/3x2/KR'
import CN from 'country-flag-icons/react/3x2/CN'
import RU from 'country-flag-icons/react/3x2/RU'

/** A country-flag-icons React component (its own prop type, to avoid a
 * cross-package React type clash). */
export type FlagIcon = typeof PE

/** Flags for the supported countries (matches the geo `countries` dataset). */
export const COUNTRY_FLAGS: Record<string, FlagIcon> = {
  PE,
  AR,
  BO,
  BR,
  CL,
  CO,
  EC,
  PY,
  UY,
  VE,
  ES,
  US,
  DE,
  FR,
  PT,
  IT,
  JP,
  KR,
  CN,
  RU,
}
