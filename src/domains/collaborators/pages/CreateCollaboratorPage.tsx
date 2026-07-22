import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CollaboratorForm } from '../components/CollaboratorForm'
import { useCreateCollaborator } from '../api/collaborators.queries'
import { useCollaboratorsTranslation } from '../i18n'
import { toCollaboratorPayload } from '../model/collaborator.schema'
import type { CollaboratorFormData } from '../model/collaborator.schema'

export const CreateCollaboratorPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCollaboratorsTranslation()
  const createCollaborator = useCreateCollaborator()

  const handleCreate = (
    data: CollaboratorFormData,
    photo?: File | null,
    _removePhoto?: boolean,
    photoLibraryUrl?: string
  ) => {
    const base = toCollaboratorPayload(data)
    const payload = photoLibraryUrl ? { ...base, photoUrl: photoLibraryUrl } : base
    createCollaborator.mutate(
      { data: payload, photo },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          // 2xx with warnings = record saved but the image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.collaborators(language) as never })
        },
        // Offline: the collaborator is queued (without the photo). Soft
        // success — warn the photo was skipped and go back to the list.
        onError: onQueuedOr(() => {
          if (photo) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.collaborators(language) as never })
        }),
      }
    )
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <CollaboratorForm
        mode="create"
        isSubmitting={createCollaborator.isPending}
        submitError={createCollaborator.error}
        onCancel={() => navigate({ to: navPaths.collaborators(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
