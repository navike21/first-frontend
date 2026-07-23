import { Modal, DetailField } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { useFormsTranslation } from '../../i18n'
import type { Form, FormSubmission } from '../../model/form.types'

interface FormSubmissionDetailModalProps {
  form: Form
  submission: FormSubmission | null
  onClose: () => void
}

export const FormSubmissionDetailModal = ({
  form,
  submission,
  onClose,
}: FormSubmissionDetailModalProps) => {
  const { t, language } = useFormsTranslation()

  return (
    <Modal
      isOpen={!!submission}
      onClose={onClose}
      size="lg"
      title={t.submissionDetail.title}
    >
      {submission && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailField
              label={t.submissionDetail.submittedAt}
              value={formatDate(submission.createdAt)}
            />
            <DetailField
              label={t.submissionDetail.ipAddress}
              value={submission.ipAddress}
            />
            <DetailField
              label={t.submissionDetail.userAgent}
              value={submission.userAgent}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {form.fields.map((field) => {
              const value = submission.data[field.fieldId ?? '']
              const label = field.label[language] || field.label.en
              return (
                <DetailField
                  key={field.fieldId}
                  label={label}
                  value={
                    value === undefined || value === null || value === ''
                      ? undefined
                      : String(value)
                  }
                />
              )
            })}
          </div>
        </div>
      )}
    </Modal>
  )
}
