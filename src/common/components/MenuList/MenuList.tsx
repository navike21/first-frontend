import { ListItemIcon, ListItemText } from '@mui/material'
import { uuid } from '@Utils/uuid'
import { MenuItemMUI, MenuListMUI } from './styles'
import { ReactNode } from 'react'

export interface IItemMenu {
  icon?: ReactNode
  label: string
  onClick?: () => void
}

export interface IMenuListProps {
  items: IItemMenu[]
}

export const MenuList = ({ items }: IMenuListProps) => (
  <MenuListMUI>
    {items.map(({ icon, label, onClick }) => (
      <MenuItemMUI key={uuid()} onClick={onClick}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{label}</ListItemText>
      </MenuItemMUI>
    ))}
  </MenuListMUI>
)
