import { ListItemIcon, ListItemText, MenuProps } from '@mui/material'
import { uuid } from '@Utils/uuid'
import { MenuItemMUI, MenuListMUI, MenuMUI } from './styles'
import { ReactNode } from 'react'

export interface IItemMenu {
  icon?: ReactNode
  label: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

export interface IMenuProps extends MenuProps {
  open: boolean
  onClose: () => void
}

interface IMenuListProps {
  items: IItemMenu[]
  menuSelectable?: IMenuProps
}

export const MenuList = ({ items, menuSelectable }: IMenuListProps) => {
  const itemsMenu = items.map(
    ({ disabled, icon, label, selected, onClick }) => (
      <MenuItemMUI
        key={uuid()}
        onClick={onClick}
        selected={selected}
        disabled={disabled}
        aria-disabled={disabled}
        aria-selected={selected}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{label}</ListItemText>
      </MenuItemMUI>
    )
  )

  if (menuSelectable) {
    const { open, onClose, ...props } = menuSelectable
    return (
      <MenuMUI {...props} open={open} onClose={onClose}>
        {itemsMenu}
      </MenuMUI>
    )
  }

  return <MenuListMUI>{itemsMenu}</MenuListMUI>
}
