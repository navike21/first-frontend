/* Shared UI components barrel.
   Export reusable, domain-agnostic components from this folder. */

// Atoms
export { Switch, type SwitchProps, type SwitchSize } from './atoms/Switch'
export {
  Avatar,
  type AvatarProps,
  type AvatarSize,
  type AvatarStatus,
} from './atoms/Avatar'
export { Button, type ButtonProps } from './atoms/Button'
export { Can, type CanProps } from './atoms/Can'
export { Card, type CardProps } from './atoms/Card'
export {
  IconButton,
  type IconButtonProps,
  type IconButtonShape,
  type IconButtonVariant,
  type IconButtonSize,
} from './atoms/IconButton'
export { Chip, type ChipProps } from './atoms/Chip'
export { HelperText, type HelperTextProps } from './atoms/HelperText'
export { IconComponent, type IconProps } from './atoms/IconComponent'
export { AppLogo } from './atoms/AppLogo'
export { Label, type LabelProps } from './atoms/Label'
export { NavItem, type NavItemProps } from './atoms/NavItem'
export { LinkButton, type LinkButtonProps } from './atoms/LinkButton'
export { Spinner, type SpinnerProps } from './atoms/Spinner'
export { Skeleton, type SkeletonProps } from './atoms/Skeleton'
export { ThemeToggle } from './atoms/ThemeToggle'
export { ColorPicker } from './atoms/ColorPicker'
export { FadeCollapse, type FadeCollapseProps } from './atoms/FadeCollapse'

// Molecules
export { Accordion, type AccordionProps } from './molecules/Accordion'
export { Checkbox, type CheckboxProps } from './molecules/Checkbox'
export { Drawer, type DrawerProps } from './molecules/Drawer'
export { FeatureCard, type FeatureCardProps } from './molecules/FeatureCard'
export {
  InputField,
  type InputFieldProps,
  type TypeInput,
  type variantInput,
} from './molecules/InputField'
export {
  InputNumber,
  type InputNumberProps,
} from './molecules/InputNumber'
export { RadioOption, type RadioOptionProps } from './molecules/RadioOption'
export {
  Tooltip,
  type TooltipProps,
  type TooltipPosition,
  type TooltipVariant,
  type TooltipSize,
} from './molecules/Tooltip'
export {
  Breadcrumbs,
  type BreadcrumbItem,
  type BreadcrumbsProps,
} from './molecules/Breadcrumbs'
export {
  Select,
  Option,
  type OptionProps,
  type SelectProps,
  type SelectOptionItem,
  type SelectVariant,
  type SelectTexts,
} from './molecules/Select'
export { Modal, type ModalProps, type ModalSize } from './molecules/Modal'
export {
  DataTable,
  type DataTableProps,
  type DataTableColumn,
  type DataTablePagination,
} from './molecules/DataTable'
export { Tabs, type TabsProps, type TabItem } from './molecules/Tabs'
export { PhotoPicker, type PhotoPickerProps } from './molecules/PhotoPicker'
export {
  LanguageSwitcher,
  type LanguageSwitcherProps,
} from './molecules/LanguageSwitcher'
export {
  PageHeader,
  type PageHeaderProps,
  type PageHeaderAction,
  type PageHeaderButtonAction,
  type PageHeaderLinkAction,
} from './molecules/PageHeader'

export {
  InputDate,
  type InputDateProps,
  type DatePickerMode,
  type InputDateVariant,
  type InputDateTexts,
  type InputRegisterLike,
} from './molecules/InputDate'

// Layouts
export { InputLayout, type InputLayoutProps } from './layouts/InputLayout'
export { ToggleLayout, type ToggleLayoutProps } from './layouts/ToggleLayout'
