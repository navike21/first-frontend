import type { ReactNode } from 'react'

export interface WizardStep {
  id: string
  label: string
  /** Marks the step as skippable (shown with an "optional" tag). */
  optional?: boolean
}

export interface WizardProps {
  steps: WizardStep[]
  /** Controlled current step id. */
  current: string
  /** Jump to a step (clicking the step header). */
  onStepChange: (id: string) => void
  /** Advance request — the parent validates the current step, then advances. */
  onNext: () => void
  onBack: () => void
  /** Optional cancel action shown on the far left of the footer. */
  onCancel?: () => void
  isSubmitting?: boolean
  backLabel: string
  nextLabel: string
  /** Submit label shown on the last step (e.g. "Create"/"Save"). */
  submitLabel: string
  cancelLabel?: string
  /** Suffix shown next to an optional step's label (e.g. "(optional)"). */
  optionalLabel?: string
  /** Current step content. */
  children: ReactNode
}
