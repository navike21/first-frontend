import { type ReactNode } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { springTransition } from '@/shared/lib'

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
          'duration-fast ease-out-expo transition-colors',
          !isOpen && 'hover:bg-(--surface-subtle) hover:text-(--text-primary)',
          {
            'bg-primary-700/10 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium':
              isOpen,
            'text-(--text-secondary)': !isOpen,
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
            'duration-fast ease-spring transition-transform',
            {
              'text-primary-600 dark:text-primary-400 rotate-180': isOpen,
              'text-(--text-muted)': !isOpen,
            }
          )}
        />
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={springTransition}
        className="overflow-hidden"
      >
        <div
          className={clsx(
            'duration-normal ease-out-expo pt-1 pb-2 transition-transform',
            isOpen ? 'translate-y-0' : '-translate-y-2',
            contentClassName
          )}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
