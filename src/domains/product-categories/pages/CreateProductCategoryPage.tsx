import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ProductCategoryForm } from '../components/ProductCategoryForm'
import { useCreateProductCategory } from '../api/productCategories.queries'
import { useProductCategoriesTranslation } from '../i18n'
import { toProductCategoryPayload } from '../model/productCategory.schema'
import type { ProductCategoryFormData } from '../model/productCategory.schema'

export const CreateProductCategoryPage = () => {
  const navigate = useNavigate()
  const { t, language } = useProductCategoriesTranslation()
  const createCategory = useCreateProductCategory()

  const handleCreate = (data: ProductCategoryFormData) => {
    createCategory.mutate(toProductCategoryPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.productCategories(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.productCategories(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <ProductCategoryForm
        mode="create"
        isSubmitting={createCategory.isPending}
        submitError={createCategory.error}
        onCancel={() =>
          navigate({ to: navPaths.productCategories(language) as never })
        }
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
