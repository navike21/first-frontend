import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { IconComponent } from '../IconComponent'
import type { IconName } from '@/shared/types/icons'

export interface NavItemProps {
  icon: IconName
  label: string
  /** If provided, renders as a router Link; otherwise renders as a button */
  to?: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export const NavItem = ({
  icon,
  label,
  to,
  isActive,
  onClick,
  className,
}: NavItemProps) => {
  const baseClass = clsx(
    'group flex w-full cursor-pointer items-center gap-3 px-3 py-2.5',
    'rounded-lg text-sm font-medium',
    'transition-colors duration-fast ease-out-expo',
    // Inactive hover — light: subtle brand tint + brand text; dark: keep.
    !isActive &&
      'hover:bg-(--color-primary-700)/5 hover:text-(--color-primary-700) dark:hover:bg-(--color-primary-950)/20 dark:hover:text-white',
    // Active — light: light brand tint bg + brand text (follows the active
    // color theme); dark: keep the existing dark highlight.
    isActive
      ? 'bg-(--color-primary-700)/10 font-semibold text-(--color-primary-700) dark:bg-(--color-primary-950)/40 dark:text-white'
      : 'text-(--text-secondary)',
    className
  )

  const content = (
    <>
      <IconComponent
        icon={icon}
        className={clsx(
          'h-5 w-5 shrink-0',
          isActive
            ? 'text-(--color-primary-700) dark:text-(--color-primary-300)'
            : 'text-(--text-secondary) group-hover:text-(--color-primary-700) dark:group-hover:text-white'
        )}
      />
      <span>{label}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={baseClass}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(baseClass, 'text-left')}
    >
      {content}
    </button>
  )
}
