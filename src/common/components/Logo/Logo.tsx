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
