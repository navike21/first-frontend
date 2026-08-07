import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ShippingRuleForm } from '../components/ShippingRuleForm'
import {
  useCreateShippingRule,
  useCurrencyForShippingPicker,
} from '../api/shippingRules.queries'
import { useShippingTranslation } from '../i18n'
import { toShippingRulePayload } from '../model/shippingRule.schema'
import type { ShippingRuleFormData } from '../model/shippingRule.schema'

export const CreateShippingRulePage = () => {
  const navigate = useNavigate()
  const { t, language } = useShippingTranslation()
  const { data: currency = 'USD' } = useCurrencyForShippingPicker()
  const createRule = useCreateShippingRule()

  const handleCreate = (data: ShippingRuleFormData) => {
    createRule.mutate(toShippingRulePayload(data, currency), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.shippingRules(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.shippingRules(language) as never })
      ),
    })
  }

  return (
    <PageContent title={t.page.createTitle} description={t.page.createDescription}>
      <ShippingRuleForm
        mode="create"
        currency={currency}
        isSubmitting={createRule.isPending}
        submitError={createRule.error}
        onCancel={() => navigate({ to: navPaths.shippingRules(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
