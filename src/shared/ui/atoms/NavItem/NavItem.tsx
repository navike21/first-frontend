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
    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer',
    'text-sm font-medium transition-colors duration-fast ease-out-expo',
    isActive
      ? 'bg-slate-100 text-slate-900 font-semibold'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
    className
  )

  const content = (
    <>
      <IconComponent
        icon={icon}
        className={clsx('h-5 w-5 shrink-0', isActive ? 'text-slate-700' : 'text-slate-500')}
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
