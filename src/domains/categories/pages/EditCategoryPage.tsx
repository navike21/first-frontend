import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CategoryForm } from '../components/CategoryForm'
import { useCategory, useUpdateCategory } from '../api/categories.queries'
import { useCategoriesTranslation } from '../i18n'
import { toCategoryPayload } from '../model/category.schema'
import type { CategoryFormData } from '../model/category.schema'
import type { Category } from '../model/category.types'

function toFormValues(category: Category): Partial<CategoryFormData> {
  return {
    name: category.name,
    slug: category.slug,
    parentId: category.parentId ?? '',
    order: category.order,
    isActive: category.isActive,
  }
}

export const EditCategoryPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCategoriesTranslation()
  const { categoryId } = useParams({ strict: false }) as { categoryId: string }
  const { data: category, isLoading } = useCategory(categoryId)
  const updateCategory = useUpdateCategory(categoryId)

  const handleUpdate = (data: CategoryFormData) => {
    updateCategory.mutate(toCategoryPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.categories(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.categories(language) as never })
      ),
    })
  }

  if (isLoading || !category) {
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
        category.name[language] || category.name.en
      )}
    >
      <CategoryForm
        mode="edit"
        categoryId={category.id}
        initialValues={toFormValues(category)}
        isSubmitting={updateCategory.isPending}
        submitError={updateCategory.error}
        onCancel={() =>
          navigate({ to: navPaths.categories(language) as never })
        }
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
