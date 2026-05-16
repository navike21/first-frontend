import type { ReactNode } from 'react'
import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'

export interface AccordionProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  icon?: ReactNode
  isOpen: boolean
  title: ReactNode

  onToggle: () => void
}

export const Accordion = ({
  children,
  className,
  contentClassName,
  icon,
  isOpen,
  title,

  onToggle,
}: AccordionProps) => {
  return (
    <div className={clsx('w-full', className)}>
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
          {
            'bg-primary-50/10 text-primary-700 font-medium': isOpen,
            'text-slate-600 hover:bg-slate-50 hover:text-slate-900': !isOpen,
          },
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        <IconComponent
          icon="RiArrowDownSLine"
          className={clsx('h-4 w-4 transition-transform duration-300', {
            'text-primary-600 rotate-180': isOpen,
            'text-slate-400': !isOpen,
          })}
        />
      </button>

      <div
        className={clsx('grid transition-all duration-300 ease-in-out', {
          'grid-rows-[1fr] opacity-100': isOpen,
          'grid-rows-[0fr] opacity-0': !isOpen,
        })}
      >
        <div className={clsx('overflow-hidden pt-1 pb-2', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
