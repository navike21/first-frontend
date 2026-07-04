import type { PanelLayoutProps } from './PanelLayout.types'

export const PanelLayout = ({ left, right }: PanelLayoutProps) => (
  <div className="flex flex-col items-stretch gap-5 md:flex-row md:items-start">
    <div className="flex w-full shrink-0 flex-col items-center gap-4 rounded-xl border border-border bg-surface p-6 md:w-60">
      {left}
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      {right}
    </div>
  </div>
)
