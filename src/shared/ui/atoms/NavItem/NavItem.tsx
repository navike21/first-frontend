import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { IconComponent } from '../IconComponent'
import type { NavItemProps } from './NavItem.types'

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
      'hover:bg-primary-700/5 hover:text-primary-700 dark:hover:bg-primary-950/20 dark:hover:text-primary-500',
    // Active — light: light brand tint bg + brand text (follows the active
    // color theme); dark: keep the existing dark highlight.
    isActive
      ? 'bg-primary-700/10 font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-500'
      : 'text-slate-500 dark:text-slate-300',
    className
  )

  const content = (
    <>
      <IconComponent
        icon={icon}
        className={clsx(
          'h-5 w-5 shrink-0',
          isActive
            ? 'text-primary-700 dark:text-primary-500'
            : 'group-hover:text-primary-700 dark:group-hover:text-primary-500'
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
