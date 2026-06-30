import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import type { BreadcrumbItem, BreadcrumbsProps } from './Breadcrumbs.types'

const BreadcrumbLink = ({ item }: { readonly item: BreadcrumbItem }) => (
  <Link
    to={item.href ?? '/'}
    className={clsx(
      'flex items-center gap-1',
      'text-secondary',
      'transition-colors',
      'hover:text-foreground'
    )}
  >
    {item.icon && <IconComponent icon={item.icon} className="h-4 w-4" />}
    {item.label}
  </Link>
)

const BreadcrumbCurrent = ({ item }: { readonly item: BreadcrumbItem }) => (
  <span className="flex items-center gap-1 font-medium text-foreground">
    {item.icon && <IconComponent icon={item.icon} className="h-4 w-4" />}
    {item.label}
  </span>
)

export const Breadcrumbs = ({ items }: Readonly<BreadcrumbsProps>) => {
  if (items.length === 0) return null

  return (
    <nav aria-label="breadcrumb" data-testid="breadcrumbs">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li
              key={item.href ?? item.label}
              className="flex items-center gap-1.5"
            >
              {index > 0 && (
                <IconComponent
                  icon="RiArrowRightSLine"
                  className="h-4 w-4 text-muted"
                />
              )}
              {isLast ? (
                <BreadcrumbCurrent item={item} />
              ) : (
                <BreadcrumbLink item={item} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
