import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { FormEditor } from '../components/FormEditor'
import { useForm as useFormQuery, useUpdateForm } from '../api/forms.queries'
import { useFormsTranslation } from '../i18n'
import { toFormPayload } from '../model/form.schema'
import { emptyLocalized } from '../model/form.builder'
import type { FormFormData } from '../model/form.schema'
import type { Form } from '../model/form.types'

function toFormValues(form: Form): Partial<FormFormData> {
  return {
    title: { ...emptyLocalized(), ...form.title },
    description: { ...emptyLocalized(), ...form.description },
    successMessage: { ...emptyLocalized(), ...form.successMessage },
    status: form.status,
    notificationEmails: form.notificationEmails.join(', '),
    fields: form.fields.map((field) => ({
      fieldId: field.fieldId,
      type: field.type,
      label: { ...emptyLocalized(), ...field.label },
      placeholder: { ...emptyLocalized(), ...field.placeholder },
      required: field.required,
      options: (field.options ?? []).map((option) => ({
        value: option.value,
        label: { ...emptyLocalized(), ...option.label },
      })),
      maxLength: field.maxLength,
    })),
  }
}

export const EditFormPage = () => {
  const navigate = useNavigate()
  const { t, language } = useFormsTranslation()
  const { formId } = useParams({ strict: false }) as { formId: string }
  const { data: form, isLoading } = useFormQuery(formId)
  const updateForm = useUpdateForm(formId)

  const handleUpdate = (data: FormFormData) => {
    updateForm.mutate(toFormPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.forms(language) as never })
      },
      onError: onQueuedOr(() =>
        navigate({ to: navPaths.forms(language) as never })
      ),
    })
  }

  if (isLoading || !form) {
    return (
      <PageContent title={t.page.editTitle} description={t.page.editTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent
      title={t.page.editTitle}
      description={t.page.editDescription(
        form.title[language] || form.title.en
      )}
    >
      <FormEditor
        mode="edit"
        initialValues={toFormValues(form)}
        isSubmitting={updateForm.isPending}
        submitError={updateForm.error}
        onCancel={() => navigate({ to: navPaths.forms(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
