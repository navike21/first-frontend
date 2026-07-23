import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface LayoutVariantOption<V extends string> {
  value: V
  label: string
  wireframe: ReactNode
}

export interface LayoutVariantPickerProps<V extends string> {
  label: string
  options: LayoutVariantOption<V>[]
  value: V
  onChange: (value: V) => void
}

export function LayoutVariantPicker<V extends string>({
  label,
  options,
  value,
  onChange,
}: LayoutVariantPickerProps<V>) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-muted text-xs font-semibold tracking-wide uppercase">
        {label}
      </span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={clsx(
                'flex cursor-pointer flex-col gap-2 rounded-xl border p-3 text-left',
                'transition-colors',
                active
                  ? 'border-primary-600 bg-primary-700/10 ring-primary-700/20 ring-1'
                  : 'border-border bg-surface hover:border-primary-600/40'
              )}
            >
              {option.wireframe}
              <span
                className={clsx(
                  'text-xs font-medium',
                  active ? 'text-primary-600' : 'text-secondary'
                )}
              >
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
