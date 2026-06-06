import { type ReactNode } from 'react'
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
          'flex w-full cursor-pointer items-center justify-between px-3 py-2.5',
          'rounded-lg text-sm',
          'transition-colors duration-fast ease-out-expo',
          !isOpen && 'hover:bg-slate-50 hover:text-slate-900',
          {
            'bg-primary-50/10 font-medium text-primary-700': isOpen,
            'text-slate-600': !isOpen,
          }
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        <IconComponent
          icon="RiArrowDownSLine"
          className={clsx(
            'h-4 w-4',
            'transition-transform duration-fast ease-out-expo',
            {
              'text-primary-600 rotate-180': isOpen,
              'text-slate-400': !isOpen,
            }
          )}
        />
      </button>

      <div
        className={clsx(
          'grid',
          'transition-[grid-template-rows,opacity] duration-normal ease-out-expo',
          {
            'grid-rows-[1fr] opacity-100': isOpen,
            'grid-rows-[0fr] opacity-0': !isOpen,
          }
        )}
      >
        <div className={clsx('overflow-hidden pt-1 pb-2', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
