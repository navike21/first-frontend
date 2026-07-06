interface SectionDividerProps {
  label?: string
}

export const SectionDivider = ({ label }: SectionDividerProps) => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-border" />
    {label && (
      <span className="text-[11px] font-medium tracking-wide text-muted uppercase">
        {label}
      </span>
    )}
    <div className="h-px flex-1 bg-border" />
  </div>
)
