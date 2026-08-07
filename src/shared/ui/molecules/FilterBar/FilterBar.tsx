import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent'
import { InputField } from '../InputField/InputField'
import { Select } from '../Select/Select'
import type { FilterBarProps } from './FilterBar.types'

/**
 * Search field + N `Select` filters in a responsive row (`flex-col` on
 * mobile, `sm:flex-row sm:items-end` from `sm:` up) — the generalized shape
 * of the search+status filter row already used by every list page
 * (Categories, Clients, Portfolio, …), which until now each hand-rolled the
 * same `flex flex-col gap-3 sm:flex-row sm:items-end` block inline for a
 * single filter. New list screens that need more than one filter at once
 * (e.g. Ecommerce Products: search + category + status + stock) should use
 * this instead of repeating the layout by hand.
 *
 * @example
 * <FilterBar
 *   search={{ value: search, onChange: setSearch, label: t.filters.searchLabel }}
 *   filters={[
 *     { id: 'status', label: t.filters.statusLabel, options: statusOptions, value: statusValue, onChange: setStatusValue },
 *   ]}
 *   lang={language}
 * />
 */
export const FilterBar = ({
  search,
  filters = [],
  lang,
  className,
}: FilterBarProps) => {
  return (
    <div
      className={clsx(
        'flex flex-col gap-3 sm:flex-row sm:items-end',
        className
      )}
    >
      {search && (
        <div className="flex-1">
          <InputField
            label={search.label}
            value={search.value}
            placeholder={search.placeholder}
            onChange={(e) => search.onChange(e.target.value)}
            leftSlot={
              <span className="text-muted px-3">
                <IconComponent icon="RiSearchLine" className="h-4 w-4" />
              </span>
            }
          />
        </div>
      )}
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={filter.widthClassName ?? 'w-full sm:w-52'}
        >
          <Select
            label={filter.label}
            options={filter.options}
            value={filter.value}
            lang={lang}
            onChange={(e) => filter.onChange(e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
