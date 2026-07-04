import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { SubscriberForm } from '../components/SubscriberForm/SubscriberForm'
import { useRegisterSubscriber } from '../api/subscribers.queries'
import { useSubscribersTranslation } from '../i18n'
import { toSubscriberPayload } from '../model/subscriber.schema'
import type { SubscriberFormData } from '../model/subscriber.schema'

export const CreateSubscriberPage = () => {
  const navigate = useNavigate()
  const { t, language } = useSubscribersTranslation()
  const registerSubscriber = useRegisterSubscriber()

  const handleCreate = (data: SubscriberFormData) => {
    registerSubscriber.mutate(toSubscriberPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.subscribers(language) as never })
      },
      onError: onQueuedOr(() =>
        navigate({ to: navPaths.subscribers(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <SubscriberForm
        mode="create"
        isSubmitting={registerSubscriber.isPending}
        submitError={registerSubscriber.error}
        onCancel={() => navigate({ to: navPaths.subscribers(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
