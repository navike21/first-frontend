import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ProductForm } from '../components/ProductForm'
import {
  useProduct,
  useUpdateProduct,
  useCurrencyForProductPicker,
} from '../api/products.queries'
import { useProductTranslation } from '../i18n'
import { toProductPayload, fromMoney } from '../model/product.schema'
import type { ProductFormData, GalleryOrderToken } from '../model/product.schema'
import type { Product } from '../model/product.types'

function toFormValues(item: Product): Partial<ProductFormData> {
  return {
    slug: item.slug,
    name: item.name,
    shortDescription: item.shortDescription ?? undefined,
    description: item.description ?? undefined,
    sku: item.sku ?? '',
    price: fromMoney(item.price),
    compareAtPrice: item.compareAtPrice
      ? fromMoney(item.compareAtPrice)
      : undefined,
    categoryIds: item.categoryIds,
    tagIds: item.tagIds,
    status: item.status,
    seoMetaTitle: item.seo?.metaTitle ?? undefined,
    seoMetaDescription: item.seo?.metaDescription ?? undefined,
    seoKeywords: item.seo?.keywords ?? undefined,
    seoOgImage: item.seo?.ogImage ?? '',
    hasVariants: item.hasVariants,
    variantOptions: item.variantOptions.map((o) => ({
      name: o.name,
      valuesText: o.values.join(', '),
    })),
    variants: item.variants.map((v) => ({
      id: v.id,
      sku: v.sku ?? '',
      optionValues: v.optionValues,
      price: fromMoney(v.price),
      compareAtPrice: v.compareAtPrice ? fromMoney(v.compareAtPrice) : undefined,
      imageUrl: v.imageUrl ?? '',
    })),
  }
}

export const EditProductPage = () => {
  const navigate = useNavigate()
  const { t, language } = useProductTranslation()
  const { productId } = useParams({ strict: false }) as { productId: string }
  const { data: item, isLoading } = useProduct(productId)
  const { data: currency = 'USD' } = useCurrencyForProductPicker()
  const updateProduct = useUpdateProduct(item?.id ?? '')

  const handleUpdate = (
    data: ProductFormData,
    galleryFiles: File[],
    galleryOrder: GalleryOrderToken[]
  ) => {
    updateProduct.mutate(
      {
        data: toProductPayload(data, currency),
        galleryFiles,
        galleryOrder,
      },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.updated)
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

  if (isLoading || !item) {
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
      description={t.page.editDescription(item.name[language] || item.name.en)}
    >
      <ProductForm
        mode="edit"
        productId={item.id}
        currency={currency}
        initialValues={toFormValues(item)}
        initialGalleryUrls={item.gallery}
        isSubmitting={updateProduct.isPending}
        submitError={updateProduct.error}
        onCancel={() => navigate({ to: navPaths.products(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
