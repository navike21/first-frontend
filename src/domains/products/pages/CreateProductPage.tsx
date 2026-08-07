import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ProductForm } from '../components/ProductForm'
import { useCreateProduct, useCurrencyForProductPicker } from '../api/products.queries'
import { useProductTranslation } from '../i18n'
import { toProductPayload } from '../model/product.schema'
import type { ProductFormData, GalleryOrderToken } from '../model/product.schema'

export const CreateProductPage = () => {
  const navigate = useNavigate()
  const { t, language } = useProductTranslation()
  const { data: currency = 'USD' } = useCurrencyForProductPicker()
  const createProduct = useCreateProduct()

  const handleCreate = (
    data: ProductFormData,
    galleryFiles: File[],
    _galleryOrder: GalleryOrderToken[],
    existingGalleryUrls: string[]
  ) => {
    createProduct.mutate(
      {
        data: { ...toProductPayload(data, currency), gallery: existingGalleryUrls },
        galleryFiles,
      },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.products(language) as never })
        },
        onError: onQueuedOrFieldErrors(() => {
          if (galleryFiles.length) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.products(language) as never })
        }),
      }
    )
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <ProductForm
        mode="create"
        currency={currency}
        isSubmitting={createProduct.isPending}
        submitError={createProduct.error}
        onCancel={() => navigate({ to: navPaths.products(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
