import { Button } from '@/shared/ui/atoms/Button'
import { LinkButton } from '@/shared/ui/atoms/LinkButton'
import type { PageHeaderProps } from './PageHeader.types'

export const PageHeader = ({
  title,
  description,
  actions,
  titleRef,
}: PageHeaderProps) => {
  const hasActions = actions && actions.length > 0

  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 ref={titleRef} className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-md mt-2 text-secondary">{description}</p>
        )}
      </div>

      {hasActions && (
        <div className="flex flex-wrap items-center gap-3 sm:shrink-0 sm:pt-1">
          {actions.map((action) =>
            action.type === 'button' ? (
              <Button
                key={action.label}
                variant={action.variant ?? 'primary'}
                size={action.size ?? 'medium'}
                icon={action.icon}
                loading={action.loading}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ) : (
              <LinkButton
                key={action.label}
                to={action.to as never}
                variant={action.variant ?? 'primary'}
                size={action.size ?? 'medium'}
                icon={action.icon}
              >
                {action.label}
              </LinkButton>
            )
          )}
        </div>
      )}
    </header>
  )
}
