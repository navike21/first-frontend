import { useTheme } from '@mui/material'
import { ContentLogo, RadarLogo } from './styles'
import { ESizes } from '@Enums/size'

type TLogoProps = {
  showRadar?: boolean
  size?: ESizes
}

export const Logo = ({ showRadar = false, size = ESizes.MD }: TLogoProps) => {
  const theme = useTheme()
  return (
    <ContentLogo size={size}>
      {showRadar && <RadarLogo />}
      <svg
        width={showRadar ? '65%' : '100%'}
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id=":r34:-1"
            x1="152"
            y1="167.79"
            x2="65.523"
            y2="259.624"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={theme.palette.primary.dark}></stop>
            <stop offset="1" stopColor={theme.palette.primary.main}></stop>
          </linearGradient>
          <linearGradient
            id=":r34:-2"
            x1="86"
            y1="128"
            x2="86"
            y2="384"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={theme.palette.primary.light}></stop>
            <stop offset="1" stopColor={theme.palette.primary.main}></stop>
          </linearGradient>
          <linearGradient
            id=":r34:-3"
            x1="402"
            y1="288"
            x2="402"
            y2="384"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={theme.palette.primary.light}></stop>
            <stop offset="1" stopColor={theme.palette.primary.main}></stop>
          </linearGradient>
        </defs>
        <path
          fill="url(#:r34:-1)"
          d="M86.352 246.358C137.511 214.183 161.836 245.017 183.168 285.573C165.515 317.716 153.837 337.331 148.132 344.418C137.373 357.788 125.636 367.911 111.202 373.752C80.856 388.014 43.132 388.681 14 371.048L86.352 246.358Z"
        ></path>
        <path
          fill="url(#:r34:-2)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M444.31 229.726C398.04 148.77 350.21 72.498 295.267 184.382C287.751 198.766 282.272 226.719 270 226.719V226.577C257.728 226.577 252.251 198.624 244.735 184.24C189.79 72.356 141.96 148.628 95.689 229.584C92.207 235.69 88.862 241.516 86 246.58C192.038 179.453 183.11 382.247 270 383.858V384C356.891 382.389 347.962 179.595 454 246.72C451.139 241.658 447.794 235.832 444.31 229.726Z"
        ></path>
      </svg>
    </ContentLogo>
  )
}
