import type { AppLogoColor, AppLogoSize } from '../../atoms/AppLogo/AppLogo.types'

export interface BrandMarkProps {
  size?: AppLogoSize
  color?: AppLogoColor
  /** Anima las barras del ícono ascendiendo al montar (ver AppLogo). Resérvalo
   * a momentos de entrada fría (login, error) — nunca a algo que se re-monte
   * en cada navegación interna, como el Header. */
  animateIn?: boolean
  /** Pulso en loop mientras hay una carga en curso en la app (ver AppLogo /
   * useGlobalLoading) — pensado para el logo del Header. */
  pulse?: boolean
  className?: string
}
