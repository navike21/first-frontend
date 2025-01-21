import { EGreen } from '@Enums/color'
import { EStatusType } from '@Enums/statusType'
import { EThemeOption } from '@Enums/themeOption'
import { Theme } from '@mui/material'

export const colorBadge = (theme: Theme) => ({
  [EStatusType.SUCCESS]:
    theme.palette.mode === EThemeOption.LIGHT
      ? EGreen.GREEN_600
      : EGreen.GREEN_500,
  [EStatusType.ERROR]: theme.palette.error.light,
  [EStatusType.INFO]: theme.palette.info.light,
  [EStatusType.WARNING]: theme.palette.warning.light,
  [EStatusType.DEFAULT]: theme.palette.grey[500],
})
