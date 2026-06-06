interface PanelLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
}

export const PanelLayout = ({ left, right }: PanelLayoutProps) => (
  <div className="flex items-start gap-5">
    <div className="flex w-60 shrink-0 flex-col items-center gap-4 rounded-xl border border-(--border) bg-(--surface) p-6">
      {left}
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-(--border) bg-(--surface) p-6">
      {right}
    </div>
  </div>
)
