import clsx from 'clsx'
import { useBrandColor, useSetColor, type BrandColor } from '@/shared/model'

type ColorConfig = { id: BrandColor; bg: string; ring: string; label: string }

// Swatch shade matches the applied strong brand color (`--color-primary-700`,
// which maps to each theme's `-600`) so the picker preview equals what you get.
const COLORS: ColorConfig[] = [
  { id: 'teal', bg: 'bg-[#006d8d]', ring: 'ring-[#006d8d]', label: 'Teal' },
  { id: 'sky', bg: 'bg-sky-600', ring: 'ring-sky-600', label: 'Sky' },
  { id: 'cyan', bg: 'bg-cyan-600', ring: 'ring-cyan-600', label: 'Cyan' },
  {
    id: 'indigo',
    bg: 'bg-indigo-600',
    ring: 'ring-indigo-600',
    label: 'Indigo',
  },
  {
    id: 'violet',
    bg: 'bg-violet-600',
    ring: 'ring-violet-600',
    label: 'Violet',
  },
  { id: 'pink', bg: 'bg-pink-600', ring: 'ring-pink-600', label: 'Pink' },
  { id: 'rose', bg: 'bg-rose-600', ring: 'ring-rose-600', label: 'Rose' },
  {
    id: 'orange',
    bg: 'bg-orange-600',
    ring: 'ring-orange-600',
    label: 'Orange',
  },
  { id: 'amber', bg: 'bg-amber-600', ring: 'ring-amber-600', label: 'Amber' },
  {
    id: 'emerald',
    bg: 'bg-emerald-600',
    ring: 'ring-emerald-600',
    label: 'Emerald',
  },
]

export const ColorPicker = () => {
  const color = useBrandColor()
  const setColor = useSetColor()

  return (
    <div
      role="radiogroup"
      aria-label="Brand color"
      className="flex flex-wrap gap-2"
    >
      {COLORS.map(({ id, bg, ring, label }) => {
        const selected = color === id
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={() => setColor(id)}
            className={clsx(
              'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
              'duration-fast ease-out-expo transition-all',
              'focus-visible:ring-2 focus-visible:ring-(--border) focus-visible:ring-offset-1 focus-visible:outline-none',
              bg,
              selected && [ring, 'ring-2 ring-offset-2 ring-offset-(--surface)']
            )}
          >
            {selected && (
              <svg
                className="h-3.5 w-3.5 text-white drop-shadow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
