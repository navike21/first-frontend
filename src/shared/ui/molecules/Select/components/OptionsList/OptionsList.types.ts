import type { SelectOptionItem } from '../../Select.types'

export interface OptionsListProps {
  options: SelectOptionItem[]
  selectedValues: string[]
  multiple: boolean
  onSelect: (val: string) => void
  onFocusIndex: (idx: number) => void
}
