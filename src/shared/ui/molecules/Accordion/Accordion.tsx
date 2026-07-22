import clsx from 'clsx'
import { motion } from 'motion/react'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { springTransition } from '@/shared/lib'
import type { AccordionProps } from './Accordion.types'

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
          'rounded-lg text-sm font-semibold text-foreground',
          'duration-fast ease-out-expo transition-colors',
          // El manual mantiene el texto navy en ambos estados — solo cambia
          // el fondo (niebla cuando está abierto) y la rotación del chevron,
          // no hay resaltado azul.
          !isOpen && 'hover:bg-surface-subtle',
          { 'bg-surface-subtle': isOpen }
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        <IconComponent
          icon="RiArrowDownSLine"
          className={clsx(
            'h-4 w-4 text-secondary',
            'duration-fast ease-spring transition-transform',
            { 'rotate-180': isOpen }
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
