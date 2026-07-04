import type { DetailFieldProps } from './DetailField.types'

export const DetailField = ({ label, value }: DetailFieldProps) => {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}
