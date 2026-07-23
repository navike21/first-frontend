interface SectionDividerProps {
  label?: string
}

export const SectionDivider = ({ label }: SectionDividerProps) => (
  <div className="flex items-center gap-3">
    <div className="bg-border-control h-px flex-1" />
    {label && (
      <span className="text-muted text-[11px] font-medium tracking-wide uppercase">
        {label}
      </span>
    )}
    <div className="bg-border-control h-px flex-1" />
  </div>
)
