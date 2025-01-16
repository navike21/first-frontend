import { Drawer } from '@Components/Drawer/Drawer'
import {
  ContentDrawerSettings,
  SectionDrawerPrimaryColor,
  SectionDrawerSettings,
} from '../styles/settingsStyles'
import { IconSwitch } from '@Components/IconSwitch/IconSwitch'
import { EThemeOption } from '@Enums/themeOption'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { CgCompress } from 'react-icons/cg'
import { FaCircleHalfStroke } from 'react-icons/fa6'
import { useDrawerSettings } from '../hooks/useDrawerSettings'
import { Title } from '@Components/Title/Title'
import { EColors } from '@Enums/color'
import { colors } from '@Themes/color'
import { Button } from '@Components/Button/Button'
import { Divider, Slider } from '@mui/material'

interface IDrawerSettingsProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const DrawerSettings = ({ open, setOpen }: IDrawerSettingsProps) => {
  const {
    colorIcons,
    compact,
    fontSize,
    principalSettings: {
      themeMode: { title: titleThemeMode },
      compact: { title: titleCompact },
      principalColor: { title: titlePrincipalColor },
      fontSize: { title: titleFontSize },
    },
    primaryColor,
    sizeIcon,
    themeMode,
    titleDrawer,
    handleChangeThemeMode,
    handleChangeCompact,
    handleChangePrimaryColor,
    handleDefaultValueSlider,
    handleValueTextSlider,
  } = useDrawerSettings()

  return (
    <Drawer
      titleDrawer={titleDrawer}
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
    >
      <ContentDrawerSettings>
        <SectionDrawerSettings>
          <IconSwitch
            title={titleThemeMode}
            icon={
              themeMode === EThemeOption.DARK ? (
                <MdDarkMode size={sizeIcon} color={colorIcons} />
              ) : (
                <MdLightMode size={sizeIcon} color={colorIcons} />
              )
            }
            onChange={handleChangeThemeMode}
            checked={themeMode === EThemeOption.DARK}
          />
          <IconSwitch
            title={titleCompact}
            icon={<CgCompress size={sizeIcon} color={colorIcons} />}
            onChange={handleChangeCompact}
            checked={compact}
          />
        </SectionDrawerSettings>
        <Divider />
        <Title variant="h6">{titlePrincipalColor}</Title>
        <SectionDrawerPrimaryColor>
          {Object.values(EColors).map((color) => (
            <Button
              key={color}
              color="primary"
              variant={color === primaryColor ? 'outlined' : 'text'}
              onClick={() => {
                handleChangePrimaryColor(color as EColors)
              }}
            >
              <FaCircleHalfStroke size={sizeIcon} color={colors[color].main} />
            </Button>
          ))}
        </SectionDrawerPrimaryColor>
        <Divider />
        <Title variant="h6">{titleFontSize}</Title>
        <Slider
          defaultValue={handleDefaultValueSlider()}
          step={2}
          marks={fontSize}
          onChange={handleValueTextSlider}
          min={12}
          max={20}
          size="medium"
          valueLabelDisplay="on"
          slotProps={{
            markLabel: {
              style: {
                color: colorIcons,
                alignItems: 'center',
                display: 'none',
              },
            },
          }}
        />
      </ContentDrawerSettings>
    </Drawer>
  )
}
