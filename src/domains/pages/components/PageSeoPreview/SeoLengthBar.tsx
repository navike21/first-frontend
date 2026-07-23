import clsx from 'clsx'
import type { SeoCheckStatus, SeoLengthMetric } from '../../model/page.seo'

const BAR_CLASS: Record<SeoCheckStatus, string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  bad: 'bg-red-500',
}

export interface SeoLengthBarProps {
  metric: SeoLengthMetric
  charsLabel: string
  label?: string
}

export const SeoLengthBar = ({
  metric,
  charsLabel,
  label,
}: SeoLengthBarProps) => {
  const pct = Math.min(100, Math.round((metric.length / metric.max) * 100))
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        {label ? (
          <span className="text-foreground text-xs font-medium">{label}</span>
        ) : (
          <span />
        )}
        <span className="text-muted text-xs">{charsLabel}</span>
      </div>
      <div className="bg-surface-subtle h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={clsx(
            'h-full rounded-full transition-[width]',
            BAR_CLASS[metric.status]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
