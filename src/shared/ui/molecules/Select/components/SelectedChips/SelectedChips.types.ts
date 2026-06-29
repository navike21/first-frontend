import type { SelectOptionItem } from '../../Select.types'

export interface SelectedChipsProps {
  values: string[]
  options: SelectOptionItem[]
  disabled: boolean
  onDeselect: (val: string) => void
}
