import clsx from 'clsx'
import { Button } from '../../atoms/Button/Button'
import type { WizardProps } from './Wizard.types'

/**
 * Controlled multi-step form shell: a clickable step header + a contextual
 * footer (Cancel · Back · Next/Submit). The parent owns the current step and
 * performs per-step validation in `onNext` before advancing, so the component
 * stays form-agnostic and reusable. The last step renders a `type="submit"`
 * button so it triggers the surrounding form.
 */
export const Wizard = ({
  steps,
  current,
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
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((step, i) => {
          const active = step.id === current
          const done = i < index
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onStepChange(step.id)}
                className={clsx(
                  'flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 text-sm',
                  'transition-colors',
                  active &&
                    'bg-primary-700/10 font-semibold text-primary-700 dark:text-primary-500',
                  !active && 'text-secondary hover:bg-surface-subtle'
                )}
              >
                <span
                  className={clsx(
                    'flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                    (active || done) && 'bg-primary-700 text-white',
                    !active && !done && 'bg-surface-subtle text-muted'
                  )}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span>
                  {step.label}
                  {step.optional && optionalLabel && (
                    <span className="ml-1 text-xs font-normal text-muted">
                      {optionalLabel}
                    </span>
                  )}
                </span>
              </button>
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
