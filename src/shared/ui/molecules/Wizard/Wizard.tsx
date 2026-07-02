import clsx from 'clsx'
import { Button } from '../../atoms/Button/Button'
import type { WizardProps, WizardStep } from './Wizard.types'

type StepState = 'completed' | 'active' | 'upcoming' | 'error'

const CIRCLE_BY_STATE: Record<StepState, string> = {
  completed: 'border-primary-600 bg-primary-600 text-white',
  active: 'border-primary-600 bg-surface',
  upcoming: 'border-border bg-surface',
  error: 'border-red-500 bg-red-500 text-white',
}

const TITLE_BY_STATE: Record<StepState, string> = {
  completed: 'text-foreground',
  active: 'text-primary-600',
  upcoming: 'text-muted',
  error: 'text-red-500',
}

function stepStateAt(
  step: WizardStep,
  index: number,
  current: number,
  reached: number
): StepState {
  if (step.error) return 'error'
  if (index === current) return 'active'
  if (index <= reached) return 'completed'
  return 'upcoming'
}

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3.5"
    aria-hidden
  >
    <path d="m5 13 4 4L19 7" />
  </svg>
)

const WarnIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
    className="size-4"
    aria-hidden
  >
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
)

/**
 * Controlled multi-step form shell with a restrictive stepper: the user can
 * only go **back** to completed steps by clicking them (or "Back"); advancing
 * happens through "Next" (the parent validates the current step first). Field
 * values persist because step panels stay mounted (hidden), so navigating back
 * and forth keeps the data. The last step renders the form submit button.
 */
export const Wizard = ({
  steps,
  current,
  reachedIndex,
  onStepChange,
  onNext,
  onBack,
  onCancel,
  isSubmitting,
  backLabel,
  nextLabel,
  submitLabel,
  cancelLabel,
  optionalLabel,
  children,
}: WizardProps) => {
  const index = steps.findIndex((s) => s.id === current)
  const isFirst = index <= 0
  const isLast = index === steps.length - 1

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex items-start">
        {steps.map((step, i) => {
          const state = stepStateAt(step, i, index, reachedIndex)
          const clickable = i <= reachedIndex && i !== index
          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 flex-col items-center text-center"
            >
              <div className="flex w-full items-center">
                <span
                  className={clsx(
                    'h-0.5 flex-1',
                    i === 0 && 'invisible',
                    i <= reachedIndex ? 'bg-primary-600' : 'bg-border'
                  )}
                />
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => onStepChange(step.id)}
                  aria-current={state === 'active' ? 'step' : undefined}
                  className={clsx(
                    'flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                    'transition-colors',
                    CIRCLE_BY_STATE[state],
                    clickable && 'cursor-pointer'
                  )}
                >
                  {state === 'completed' && <CheckIcon />}
                  {state === 'error' && <WarnIcon />}
                  {state === 'active' && (
                    <span className="size-2.5 rounded-full bg-primary-600" />
                  )}
                </button>
                <span
                  className={clsx(
                    'h-0.5 flex-1',
                    i === steps.length - 1 && 'invisible',
                    i < reachedIndex ? 'bg-primary-600' : 'bg-border'
                  )}
                />
              </div>
              <span
                className={clsx(
                  'mt-2 px-1 text-sm font-medium',
                  TITLE_BY_STATE[state]
                )}
              >
                {step.label}
                {step.optional && optionalLabel && (
                  <span className="ml-1 text-xs font-normal text-muted">
                    {optionalLabel}
                  </span>
                )}
              </span>
              {step.description && (
                <span className="px-1 text-xs text-muted">
                  {step.description}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      {children}

      <div className="flex items-center justify-between gap-2">
        <div>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isFirst && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
            >
              {backLabel}
            </Button>
          )}
          {isLast ? (
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {submitLabel}
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={onNext}>
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
