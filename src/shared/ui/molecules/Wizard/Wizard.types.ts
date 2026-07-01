import type { ReactNode } from 'react'

export interface WizardStep {
  id: string
  /** Step title. */
  label: string
  /** Optional sub-caption shown under the title. */
  description?: string
  /** Marks the step as skippable (shown with an "optional" tag). */
  optional?: boolean
  /** Renders the step in the error state (red). Computed by the parent. */
  error?: boolean
}

export interface WizardProps {
  steps: WizardStep[]
  /** Controlled current step id. */
  current: string
  /**
   * Go back to an already-completed step. Forward navigation is restricted:
   * the header only invokes this for previous steps — advancing must go through
   * `onNext` (which validates the current step).
   */
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
