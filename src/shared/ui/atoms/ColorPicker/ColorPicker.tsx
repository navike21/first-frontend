import clsx from 'clsx'
import { useBrandColor, useSetColor, type BrandColor } from '@/shared/model'

type ColorConfig = { id: BrandColor; bg: string; ring: string; label: string }

const COLORS: ColorConfig[] = [
  { id: 'teal',    bg: 'bg-[#0081a2]',  ring: 'ring-[#0081a2]',  label: 'Teal'    },
  { id: 'violet',  bg: 'bg-violet-500',  ring: 'ring-violet-500',  label: 'Violet'  },
  { id: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500', label: 'Emerald' },
  { id: 'rose',    bg: 'bg-rose-500',    ring: 'ring-rose-500',    label: 'Rose'    },
  { id: 'amber',   bg: 'bg-amber-400',   ring: 'ring-amber-400',   label: 'Amber'   },
]

export const ColorPicker = () => {
  const color = useBrandColor()
  const setColor = useSetColor()

  return (
    <div role="radiogroup" aria-label="Brand color" className="flex items-center gap-2">
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
              'transition-all duration-fast ease-out-expo',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-(--border)',
              bg,
              selected && [ring, 'ring-2 ring-offset-2 ring-offset-(--surface)'],
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
