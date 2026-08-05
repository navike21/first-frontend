import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { Spinner } from '../../atoms/Spinner/Spinner'

export interface TranslateSuggestButtonProps {
  label: string
  loading?: boolean
  onClick: () => void
}

/** The AI-translate trigger — First's one AI-powered differentiator, so it
 * reads as a "smart" chip (soft-primary pill, same accent language as
 * `LangBadge`) rather than a plain text link that disappears next to the
 * language tabs. Deliberately its own markup (not the shared `Button`
 * atom): the pill shape/soft-tint background doesn't map onto any existing
 * `ButtonVariant`, and forcing it through one would mean fighting that
 * variant's own color classes instead of just stating the ones we want. */
export const TranslateSuggestButton = ({
  label,
  loading = false,
  onClick,
}: TranslateSuggestButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    aria-busy={loading}
    className={clsx(
      'bg-primary-700/10 text-primary-600 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
      loading
        ? 'cursor-wait opacity-70'
        : 'hover:bg-primary-700/15 cursor-pointer'
    )}
  >
    {loading ? (
      <Spinner size="small" />
    ) : (
      <IconComponent icon="RiTranslateAi2" className="h-3.5 w-3.5" />
    )}
    {label}
  </button>
)
