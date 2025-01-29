import { Menu, MenuItem, MenuList, styled } from '@mui/material'

export const MenuListMUI = styled(MenuList)(() => ({
  position: 'relative',
}))

export const MenuMUI = styled(Menu)()

export const MenuItemMUI = styled(MenuItem)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1.5, 1.8),
  borderRadius: theme.spacing(1),
}))
