import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CategoryForm } from '../components/CategoryForm'
import { useCreateCategory } from '../api/categories.queries'
import { useCategoriesTranslation } from '../i18n'
import { toCategoryPayload } from '../model/category.schema'
import type { CategoryFormData } from '../model/category.schema'

export const CreateCategoryPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCategoriesTranslation()
  const createCategory = useCreateCategory()

  const handleCreate = (data: CategoryFormData) => {
    createCategory.mutate(toCategoryPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.categories(language) as never })
      },
      onError: onQueuedOr(() =>
        navigate({ to: navPaths.categories(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <CategoryForm
        mode="create"
        isSubmitting={createCategory.isPending}
        submitError={createCategory.error}
        onCancel={() =>
          navigate({ to: navPaths.categories(language) as never })
        }
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
