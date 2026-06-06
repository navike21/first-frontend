import clsx from 'clsx'

type AppLogoColor = 'white' | 'default'
type AppLogoSize = 'x-small' | 'small' | 'medium' | 'large'

interface AppLogoProps extends React.SVGProps<SVGSVGElement> {
  color?: AppLogoColor
  size?: AppLogoSize
}

const sizeClass: Record<AppLogoSize, string> = {
  'x-small': 'w-8',
  small: 'w-10',
  medium: 'w-14',
  large: 'w-18',
}

/** "F" lettermark for First / navike21 */
export const AppLogo = ({
  color = 'default',
  size = 'medium',
  ...props
}: AppLogoProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={clsx(
      {
        'fill-white': color === 'white',
        'fill-[#0f172a] dark:fill-slate-100': color === 'default',
      },
      sizeClass[size],
    )}
    {...props}
  >
    {/* F lettermark — three rectangles forming the letter */}
    <rect x="4" y="3" width="3" height="18" rx="1.5" />
    <rect x="4" y="3" width="14" height="3" rx="1.5" />
    <rect x="4" y="10.5" width="10" height="3" rx="1.5" />
  </svg>
)
