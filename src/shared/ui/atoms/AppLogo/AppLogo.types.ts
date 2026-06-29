import type { SVGProps } from 'react'

export type AppLogoColor = 'white' | 'default'
export type AppLogoSize = 'x-small' | 'small' | 'medium' | 'large'

export interface AppLogoProps extends SVGProps<SVGSVGElement> {
  color?: AppLogoColor
  size?: AppLogoSize
}
