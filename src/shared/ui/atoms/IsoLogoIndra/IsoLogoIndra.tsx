import clsx from 'clsx'

type color = 'white' | 'default'
type size = 'x-small' | 'small' | 'medium' | 'large'

interface IsoLogoProps extends React.SVGProps<SVGSVGElement> {
  color?: color
  size?: size
}

export const IsoLogoIndra = ({
  color = 'default',
  size = 'medium',
  ...props
}: IsoLogoProps) => {
  return (
    <svg
      viewBox="0 0 27 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        {
          'fill-white': color === 'white',
          'fill-[#002532]': color === 'default',
        },
        {
          'w-8': size === 'x-small',
          'w-10': size === 'small',
          'w-14': size === 'medium',
          'w-18': size === 'large',
        }
      )}
      {...props}
    >
      <path
        d="M0 14.2363L0.796217 14.4469C0.796217 14.4469 10.5354 11.4817 13.5 11.2796C16.4644 11.4817 26.204 14.4469 26.204 14.4469L27 14.2363C27 14.2363 18.5298 8.42203 13.5 8.30896C8.47021 8.42203 0 14.2363 0 14.2363Z"
        fill="inherit"
      />
      <path
        d="M27 0.210665L26.204 0C26.204 0 16.4644 2.96519 13.5002 3.1673C10.5356 2.96519 0.796013 0 0.796013 0L0 0.210665C0 0.210665 8.47021 6.02492 13.5002 6.13799C18.5298 6.02492 27 0.210665 27 0.210665Z"
        fill="inherit"
      />
    </svg>
  )
}
