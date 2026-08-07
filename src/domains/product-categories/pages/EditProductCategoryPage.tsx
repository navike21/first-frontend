import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ProductCategoryForm } from '../components/ProductCategoryForm'
import {
  useProductCategory,
  useUpdateProductCategory,
} from '../api/productCategories.queries'
import { useProductCategoriesTranslation } from '../i18n'
import { toProductCategoryPayload } from '../model/productCategory.schema'
import type { ProductCategoryFormData } from '../model/productCategory.schema'
import type { ProductCategory } from '../model/productCategory.types'

function toFormValues(
  category: ProductCategory
): Partial<ProductCategoryFormData> {
  return {
    name: category.name,
    slug: category.slug,
    parentId: category.parentId ?? '',
    order: category.order,
    isActive: category.isActive,
  }
}

export const EditProductCategoryPage = () => {
  const navigate = useNavigate()
  const { t, language } = useProductCategoriesTranslation()
  const { categoryId } = useParams({ strict: false }) as { categoryId: string }
  const { data: category, isLoading } = useProductCategory(categoryId)
  const updateCategory = useUpdateProductCategory(categoryId)

  const handleUpdate = (data: ProductCategoryFormData) => {
    updateCategory.mutate(toProductCategoryPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.productCategories(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.productCategories(language) as never })
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
      <ProductCategoryForm
        mode="edit"
        categoryId={category.id}
        initialValues={toFormValues(category)}
        isSubmitting={updateCategory.isPending}
        submitError={updateCategory.error}
        onCancel={() =>
          navigate({ to: navPaths.productCategories(language) as never })
        }
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
