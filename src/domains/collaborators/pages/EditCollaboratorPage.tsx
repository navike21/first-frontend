import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CollaboratorForm } from '../components/CollaboratorForm'
import { useCollaborator, useUpdateCollaborator } from '../api/collaborators.queries'
import { useCollaboratorsTranslation } from '../i18n'
import { toCollaboratorPayload } from '../model/collaborator.schema'
import type { CollaboratorFormData } from '../model/collaborator.schema'
import type { Collaborator } from '../model/collaborator.types'

function toFormValues(collaborator: Collaborator): Partial<CollaboratorFormData> {
  return {
    name: collaborator.name,
    role: collaborator.role,
    bio: collaborator.bio,
    photoUrl: '',
    socialLinks: {
      linkedin: collaborator.socialLinks?.linkedin ?? '',
      twitter: collaborator.socialLinks?.twitter ?? '',
      github: collaborator.socialLinks?.github ?? '',
      website: collaborator.socialLinks?.website ?? '',
      instagram: collaborator.socialLinks?.instagram ?? '',
    },
    userId: collaborator.userId ?? '',
    order: collaborator.order,
    isActive: collaborator.isActive,
  }
}

export const EditCollaboratorPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCollaboratorsTranslation()
  const { collaboratorId } = useParams({ strict: false }) as { collaboratorId: string }
  const { data: collaborator, isLoading } = useCollaborator(collaboratorId)
  const updateCollaborator = useUpdateCollaborator(collaboratorId)

  const handleUpdate = (
    data: CollaboratorFormData,
    photo?: File | null,
    removePhoto?: boolean
  ) => {
    const payload = removePhoto
      ? { ...toCollaboratorPayload(data), photoUrl: '' }
      : toCollaboratorPayload(data)

    updateCollaborator.mutate(
      { data: payload, photo },
      {
        onSuccess: () => {
          notify.success(t.toasts.updated)
          navigate({ to: navPaths.collaborators(language) as never })
        },
        onError: onQueuedOr(() =>
          navigate({ to: navPaths.collaborators(language) as never })
        ),
      }
    )
  }

  if (isLoading || !collaborator) {
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
      description={t.page.editDescription(collaborator.name)}
    >
      <CollaboratorForm
        mode="edit"
        initialValues={toFormValues(collaborator)}
        currentPhotoUrl={collaborator.photoUrl}
        isSubmitting={updateCollaborator.isPending}
        submitError={updateCollaborator.error}
        onCancel={() => navigate({ to: navPaths.collaborators(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
