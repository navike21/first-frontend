import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { TagForm } from '../components/TagForm'
import { useCreateTag } from '../api/tags.queries'
import { useTagsTranslation } from '../i18n'
import { toTagPayload } from '../model/tag.schema'
import type { TagFormData } from '../model/tag.schema'

export const CreateTagPage = () => {
  const navigate = useNavigate()
  const { t, language } = useTagsTranslation()
  const createTag = useCreateTag()

  const handleCreate = (data: TagFormData) => {
    createTag.mutate(toTagPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.tags(language) as never })
      },
      onError: onQueuedOr(() =>
        navigate({ to: navPaths.tags(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <TagForm
        mode="create"
        isSubmitting={createTag.isPending}
        submitError={createTag.error}
        onCancel={() => navigate({ to: navPaths.tags(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
