import clsx from 'clsx'
import { useBrandColor, useSetColor, type BrandColor } from '@/shared/model'

type ColorConfig = { id: BrandColor; bg: string; ring: string; label: string }

const COLORS: ColorConfig[] = [
  { id: 'teal', bg: 'bg-[#0081a2]', ring: 'ring-[#0081a2]', label: 'Teal' },
  { id: 'sky', bg: 'bg-sky-500', ring: 'ring-sky-500', label: 'Sky' },
  { id: 'cyan', bg: 'bg-cyan-500', ring: 'ring-cyan-500', label: 'Cyan' },
  {
    id: 'indigo',
    bg: 'bg-indigo-600',
    ring: 'ring-indigo-600',
    label: 'Indigo',
  },
  {
    id: 'violet',
    bg: 'bg-violet-500',
    ring: 'ring-violet-500',
    label: 'Violet',
  },
  { id: 'pink', bg: 'bg-pink-500', ring: 'ring-pink-500', label: 'Pink' },
  { id: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500', label: 'Rose' },
  {
    id: 'orange',
    bg: 'bg-orange-500',
    ring: 'ring-orange-500',
    label: 'Orange',
  },
  { id: 'amber', bg: 'bg-amber-400', ring: 'ring-amber-400', label: 'Amber' },
  {
    id: 'emerald',
    bg: 'bg-emerald-500',
    ring: 'ring-emerald-500',
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
