import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import type { TabsProps } from './Tabs.types'

/**
 * Controlled, accessible tab bar. Renders only the tablist; the caller renders
 * the active panel based on `activeId`.
 */
export const Tabs = ({
  tabs,
  activeId,
  onChange,
  className,
  ariaLabel,
}: TabsProps) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        'flex items-center gap-1 border-b border-(--border)',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 -mb-px',
              'border-b-2 text-sm font-medium',
              'duration-fast ease-out-expo transition-colors',
              'cursor-pointer',
              isActive
                ? 'border-(--color-primary-600) text-(--text-primary)'
                : 'border-transparent text-(--text-secondary) hover:border-(--border) hover:text-(--text-primary)'
            )}
          >
            {tab.icon && <IconComponent icon={tab.icon} className="h-4 w-4" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
