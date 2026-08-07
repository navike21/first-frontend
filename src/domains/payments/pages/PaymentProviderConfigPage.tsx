import { PageContent, Spinner } from '@/shared/ui'
import { useProviderConfigs } from '../api/providerConfig.queries'
import { usePaymentsTranslation } from '../i18n'
import { PaymentProviderConfigCard } from '../components/PaymentProviderConfigCard'

export const PaymentProviderConfigPage = () => {
  const { t } = usePaymentsTranslation()
  const { data: configs, isLoading } = useProviderConfigs()

  if (isLoading) {
    return (
      <PageContent title={t.page.providersTitle} description={t.page.providersDescription}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent title={t.page.providersTitle} description={t.page.providersDescription}>
      <div className="flex flex-col gap-6">
        {(configs ?? []).map((config) => (
          <PaymentProviderConfigCard key={config.provider} config={config} />
        ))}
      </div>
    </PageContent>
  )
}
