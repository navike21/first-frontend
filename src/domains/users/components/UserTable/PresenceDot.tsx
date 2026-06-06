import clsx from 'clsx'
import type { User } from '../../model/user.types'

const presenceColor: Record<User['presenceStatus'], string> = {
  available: 'bg-emerald-400',
  busy: 'bg-red-400',
  away: 'bg-amber-400',
  offline: 'bg-slate-300',
}

interface PresenceDotProps {
  status: User['presenceStatus']
  label: string
}

export const PresenceDot = ({ status, label }: PresenceDotProps) => (
  <div className="flex items-center gap-1.5">
    <span className={clsx('h-2 w-2 rounded-full', presenceColor[status])} />
    <span className="text-xs text-slate-500">{label}</span>
  </div>
)
