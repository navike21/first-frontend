import { useTheme } from '@mui/material'
import {
  ContentIsoLogo,
  ContentLogo,
  RadarLogo,
  TContentLogoProps,
  Version,
} from './styles'
import { ESizes } from '@Enums/size'
import { Title } from '@Components/Title/Title'

type TLogoProps = {
  showRadar?: boolean
  size?: ESizes
  onlyIsoLogo?: boolean
  direction?: TContentLogoProps['direction']
}

export const Logo = ({
  showRadar = false,
  onlyIsoLogo = false,
  size = ESizes.MD,
  direction = 'row',
}: TLogoProps) => {
  const theme = useTheme()
  return (
    <ContentLogo direction={direction}>
      <ContentIsoLogo size={size}>
        {showRadar && <RadarLogo />}
        {/* <svg
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
      </svg> */}

        {/* <svg
        width={showRadar ? '65%' : '100%'}
        viewBox="0 0 674 674"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 337C0 178.137 0 98.7049 49.3525 49.3525C98.7049 0 178.137 0 337 0C495.863 0 575.294 0 624.648 49.3525C674 98.7049 674 178.137 674 337C674 495.863 674 575.294 624.648 624.648C575.294 674 495.863 674 337 674C178.137 674 98.7049 674 49.3525 624.648C0 575.294 0 495.863 0 337Z"
          fill={theme.palette.primary.main}
        />
        <path
          d="M249.103 317.825C248.401 317.825 247.7 317.821 247 317.813V216.872C247.699 216.89 248.4 216.899 249.103 216.899C292.08 216.899 326.919 182.069 326.919 139.102C326.919 138.399 326.91 137.699 326.891 137H427.857C427.866 137.7 427.87 138.401 427.87 139.103C427.87 237.808 347.833 317.825 249.103 317.825Z"
          fill={theme.palette.common.white}
        />
        <path
          d="M321.41 436.074V324.33C363.875 312.161 399.59 284.026 421.64 246.839H422.36V536.95C421.313 536.983 420.261 537 419.206 537C365.195 537 321.41 493.226 321.41 439.228C321.41 438.173 321.427 437.121 321.46 436.074H321.41Z"
          fill={theme.palette.common.white}
        />
      </svg> */}

        <svg
          width={showRadar ? '45%' : '65%'}
          viewBox="0 0 31 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 17.8433L30.9055 0L30.0866 12.6994L3.76597 27.8955L0 17.8433Z"
            fill={theme.palette.primary.main}
          />
          <path
            opacity="0.5"
            d="M3.76562 27.8951L25.5014 15.3459L24.6825 28.0453L7.5316 37.9473L3.76562 27.8951Z"
            fill={theme.palette.primary.main}
          />
          <path
            opacity="0.25"
            d="M7.5293 37.9478L20.0953 30.6927L19.2764 43.3922L11.2953 48L7.5293 37.9478Z"
            fill={theme.palette.primary.main}
          />
        </svg>
      </ContentIsoLogo>
      {!onlyIsoLogo && (
        <Title variant="h6">
          First <Version>v.1.0</Version>
        </Title>
      )}
    </ContentLogo>
  )
}
