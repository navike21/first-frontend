import type { DetailFieldProps } from './DetailField.types'

export const DetailField = ({ label, value }: DetailFieldProps) => {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <span className="text-foreground text-sm">{value}</span>
    </div>
  )
}
