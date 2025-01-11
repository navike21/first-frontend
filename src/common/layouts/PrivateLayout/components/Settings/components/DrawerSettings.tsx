import { Drawer } from '@Components/Drawer/Drawer'
import {
  ContentDrawerSettings,
  SectionDrawerSettings,
} from '../styles/settingsStyles'
import { IconSwitch } from '@Components/IconSwitch/IconSwitch'
import { EThemeOption } from '@Enums/themeOption'
import { MdLightMode } from 'react-icons/md'
import { MdDarkMode } from 'react-icons/md'
import { CgCompress } from 'react-icons/cg'
import { useDrawerSettings } from '../hooks/useDrawerSettings'
import { ChangeEvent } from 'react'

interface IDrawerSettingsProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const DrawerSettings = ({ open, setOpen }: IDrawerSettingsProps) => {
  const {
    colorIcons,
    sizeIcon,
    themeMode,
    titleDrawer,
    principalSettings: {
      themeMode: { title: titleThemeMode },
      compact: { title: titleCompact },
    },
    setThemeMode,
  } = useDrawerSettings()

  const handleChangeThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.checked ? EThemeOption.DARK : EThemeOption.LIGHT)
  }

  return (
    <Drawer
      title={titleDrawer}
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
          />
        </SectionDrawerSettings>
      </ContentDrawerSettings>
    </Drawer>
  )
}
