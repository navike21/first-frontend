import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CouponForm } from '../components/CouponForm'
import { useCreateCoupon, useCurrencyForCouponPicker } from '../api/coupons.queries'
import { useCouponsTranslation } from '../i18n'
import { toCouponPayload } from '../model/coupon.schema'
import type { CouponFormData } from '../model/coupon.schema'

export const CreateCouponPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCouponsTranslation()
  const { data: currency = 'USD' } = useCurrencyForCouponPicker()
  const createCoupon = useCreateCoupon()

  const handleCreate = (data: CouponFormData) => {
    createCoupon.mutate(toCouponPayload(data, currency), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.coupons(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.coupons(language) as never })
      ),
    })
  }

  return (
    <PageContent title={t.page.createTitle} description={t.page.createDescription}>
      <CouponForm
        mode="create"
        currency={currency}
        isSubmitting={createCoupon.isPending}
        submitError={createCoupon.error}
        onCancel={() => navigate({ to: navPaths.coupons(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
