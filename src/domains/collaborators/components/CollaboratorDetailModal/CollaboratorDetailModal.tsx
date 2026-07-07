import { Modal, Avatar, Chip, DetailField } from '@/shared/ui'
import { useConfigData, labelFor } from '@/shared/api/config'
import { useCollaboratorsTranslation } from '../../i18n'
import { useUsersForCollaboratorPicker } from '../../api/collaborators.queries'
import type { Collaborator } from '../../model/collaborator.types'

interface CollaboratorDetailModalProps {
  collaborator: Collaborator | null
  onClose: () => void
}

interface UserPickerItem {
  id: string
  firstName: string
  lastName: string
  email: string
}

function linkedUserLabelFor(
  userId: string | undefined,
  users: UserPickerItem[] | undefined,
  noLinkedUserLabel: string,
): string {
  if (!userId) return noLinkedUserLabel
  const user = users?.find((u) => u.id === userId)
  if (!user) return userId
  return `${user.firstName} ${user.lastName} (${user.email})`
}

export const CollaboratorDetailModal = ({
  collaborator,
  onClose,
}: CollaboratorDetailModalProps) => {
  const { t, language } = useCollaboratorsTranslation()
  const { data: configData } = useConfigData(['collaboratorRoles', 'collaboratorLevels'], language)
  const { data: usersData } = useUsersForCollaboratorPicker()

  const linkedUserLabel = linkedUserLabelFor(collaborator?.userId, usersData, t.form.noLinkedUser)

  return (
    <Modal
      isOpen={!!collaborator}
      onClose={onClose}
      size="lg"
      title={t.table.viewCollaborator}
    >
      {collaborator && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar alt={collaborator.name} src={collaborator.photoUrl} name={collaborator.name} size="md" />
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">{collaborator.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">
                  {labelFor(configData?.collaboratorRoles, collaborator.role)}
                </span>
                <Chip size="x-small" variant={collaborator.isActive ? 'success' : 'default'}>
                  {collaborator.isActive ? t.status.active : t.status.inactive}
                </Chip>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {collaborator.level && (
              <DetailField
                label={t.form.level}
                value={labelFor(configData?.collaboratorLevels, collaborator.level)}
              />
            )}
            <DetailField
              label={t.form.bio}
              value={collaborator.bio[language] || collaborator.bio.en}
            />
            {collaborator.socialLinks?.linkedin && (
              <DetailField label={t.form.linkedin} value={collaborator.socialLinks.linkedin} />
            )}
            {collaborator.socialLinks?.twitter && (
              <DetailField label={t.form.twitter} value={collaborator.socialLinks.twitter} />
            )}
            {collaborator.socialLinks?.github && (
              <DetailField label={t.form.github} value={collaborator.socialLinks.github} />
            )}
            {collaborator.socialLinks?.website && (
              <DetailField label={t.form.website} value={collaborator.socialLinks.website} />
            )}
            {collaborator.socialLinks?.instagram && (
              <DetailField label={t.form.instagram} value={collaborator.socialLinks.instagram} />
            )}
            <DetailField label={t.form.sectionAccount} value={linkedUserLabel} />
          </div>
        </div>
      )}
    </Modal>
  )
}
