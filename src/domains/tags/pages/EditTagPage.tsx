import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { TagForm } from '../components/TagForm'
import { useTag, useUpdateTag } from '../api/tags.queries'
import { useTagsTranslation } from '../i18n'
import { toTagPayload } from '../model/tag.schema'
import type { TagFormData } from '../model/tag.schema'
import type { Tag } from '../model/tag.types'

function toFormValues(tag: Tag): Partial<TagFormData> {
  return {
    name: tag.name,
    slug: tag.slug,
    order: tag.order,
    isActive: tag.isActive,
  }
}

export const EditTagPage = () => {
  const navigate = useNavigate()
  const { t, language } = useTagsTranslation()
  const { tagId } = useParams({ strict: false }) as { tagId: string }
  const { data: tag, isLoading } = useTag(tagId)
  const updateTag = useUpdateTag(tagId)

  const handleUpdate = (data: TagFormData) => {
    updateTag.mutate(toTagPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.tags(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.tags(language) as never })
      ),
    })
  }

  if (isLoading || !tag) {
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
      description={t.page.editDescription(tag.name[language] || tag.name.en)}
    >
      <TagForm
        mode="edit"
        initialValues={toFormValues(tag)}
        isSubmitting={updateTag.isPending}
        submitError={updateTag.error}
        onCancel={() => navigate({ to: navPaths.tags(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
