import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { SubscriberForm } from '../components/SubscriberForm/SubscriberForm'
import { useSubscriber, useUpdateSubscriber } from '../api/subscribers.queries'
import { useSubscribersTranslation } from '../i18n'
import { toSubscriberPayload } from '../model/subscriber.schema'
import type { SubscriberFormData } from '../model/subscriber.schema'
import type { Subscriber } from '../model/subscriber.types'

function toFormValues(sub: Subscriber): Partial<SubscriberFormData> {
  return {
    firstName: sub.firstName,
    lastName: sub.lastName,
    contactInformation: {
      email: sub.contactInformation.email,
      phoneNumber: sub.contactInformation.phoneNumber != null
        ? String(sub.contactInformation.phoneNumber)
        : '',
      address: sub.contactInformation.address ?? '',
    },
    personalInformation: {
      gender: sub.personalInformation.gender,
      dateOfBirth: sub.personalInformation.dateOfBirth
        ? sub.personalInformation.dateOfBirth.slice(0, 10)
        : '',
      profilePictureUrl: sub.personalInformation.profilePictureUrl ?? '',
    },
    status: sub.status,
  }
}

export const EditSubscriberPage = () => {
  const navigate = useNavigate()
  const { t, language } = useSubscribersTranslation()
  const { subscriberId } = useParams({ strict: false }) as { subscriberId: string }
  const { data: subscriber, isLoading } = useSubscriber(subscriberId)
  const updateSubscriber = useUpdateSubscriber(subscriberId)

  const handleUpdate = (data: SubscriberFormData) => {
    updateSubscriber.mutate(toSubscriberPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.subscribers(language) as never })
      },
      onError: onQueuedOr(() =>
        navigate({ to: navPaths.subscribers(language) as never })
      ),
    })
  }

  if (isLoading || !subscriber) {
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
      description={t.page.editDescription(`${subscriber.firstName} ${subscriber.lastName}`)}
    >
      <SubscriberForm
        mode="edit"
        initialValues={toFormValues(subscriber)}
        isSubmitting={updateSubscriber.isPending}
        submitError={updateSubscriber.error}
        onCancel={() => navigate({ to: navPaths.subscribers(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
