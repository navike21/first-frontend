import type { SVGProps } from 'react'

export type AppLogoColor = 'white' | 'default'
export type AppLogoSize = 'x-small' | 'small' | 'medium' | 'large'

export interface AppLogoProps extends SVGProps<SVGSVGElement> {
  color?: AppLogoColor
  size?: AppLogoSize
  /** Anima las 3 barras ascendiendo al montar (ver Manual de Marca: "las tres
   * barras ascendentes... marcan el objetivo... llegar primero"). Pensado
   * para momentos de entrada fría (login, error) — no lo actives en algo que
   * se re-monte en cada navegación interna. Respeta prefers-reduced-motion. */
  animateIn?: boolean
}
