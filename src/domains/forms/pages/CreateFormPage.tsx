import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { FormEditor } from '../components/FormEditor'
import { useCreateForm } from '../api/forms.queries'
import { useFormsTranslation } from '../i18n'
import { toFormPayload } from '../model/form.schema'
import type { FormFormData } from '../model/form.schema'

export const CreateFormPage = () => {
  const navigate = useNavigate()
  const { t, language } = useFormsTranslation()
  const createForm = useCreateForm()

  const handleCreate = (data: FormFormData) => {
    createForm.mutate(toFormPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.forms(language) as never })
      },
      onError: onQueuedOr(() =>
        navigate({ to: navPaths.forms(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <FormEditor
        mode="create"
        isSubmitting={createForm.isPending}
        submitError={createForm.error}
        onCancel={() => navigate({ to: navPaths.forms(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
