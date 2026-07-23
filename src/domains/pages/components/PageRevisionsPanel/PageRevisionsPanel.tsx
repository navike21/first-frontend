import { useState } from 'react'
import {
  Avatar,
  Button,
  IconButton,
  Modal,
  SectionLabel,
  Spinner,
  Tooltip,
} from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { usePagesTranslation } from '../../i18n'
import {
  usePageRevisions,
  useRestorePageRevision,
  useUsersForPagePicker,
} from '../../api/pages.queries'
import { PageRevisionCompareModal } from '../PageRevisionCompareModal'
import type { PageRevision } from '../../model/page.types'

interface PageRevisionsPanelProps {
  pageId: string
}

export const PageRevisionsPanel = ({ pageId }: PageRevisionsPanelProps) => {
  const { t, language } = usePagesTranslation()
  const { data: revisions, isLoading } = usePageRevisions(pageId)
  // The newest revision is always the snapshot of the last save — i.e. the
  // current version — so it is not restorable and is hidden from the history.
  const pastRevisions = (revisions ?? []).slice(1)
  const { data: usersData } = useUsersForPagePicker()
  const restoreRevision = useRestorePageRevision(pageId)
  const [restoring, setRestoring] = useState<PageRevision | null>(null)
  const [previewing, setPreviewing] = useState<PageRevision | null>(null)

  const userOf = (id: string | undefined) =>
    id ? usersData?.find((u) => u.id === id) : undefined
  const userName = (id: string | undefined) => {
    const user = userOf(id)
    return user ? `${user.firstName} ${user.lastName}` : t.form.unknownUser
  }

  const handleConfirmRestore = () => {
    if (!restoring) return
    restoreRevision.mutate(restoring.id, {
      onSuccess: () => {
        notify.success(t.revisions.restored)
        setRestoring(null)
      },
      onError: onQueuedOr(() => setRestoring(null)),
    })
  }

  return (
    <div className="border-border bg-surface flex flex-col gap-3 rounded-xl border p-6">
      <SectionLabel>{t.revisions.title}</SectionLabel>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner variant="gradient" size="medium" />
        </div>
      )}

      {!isLoading && pastRevisions.length === 0 && (
        <p className="text-secondary text-sm">{t.revisions.empty}</p>
      )}

      {!isLoading && pastRevisions.length > 0 && (
        <ul className="divide-border flex flex-col divide-y">
          {pastRevisions.map((revision) => {
            const date = new Date(revision.createdAt).toLocaleString(language)
            const author = userOf(revision.createdBy)
            const authorName = userName(revision.createdBy)
            return (
              <li
                key={revision.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Tooltip
                    heading={t.revisions.by(authorName)}
                    position="top"
                    size="small"
                  >
                    <Avatar
                      size="sm"
                      name={authorName}
                      {...(author?.profilePictureUrl && {
                        src: author.profilePictureUrl,
                      })}
                    />
                  </Tooltip>
                  <p className="text-foreground truncate text-sm font-medium">
                    {t.revisions.restoredAt(date)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Tooltip
                    heading={t.revisions.preview}
                    position="top"
                    size="small"
                  >
                    <IconButton
                      icon="RiEyeLine"
                      variant="text"
                      size="small"
                      aria-label={t.revisions.preview}
                      onClick={() => setPreviewing(revision)}
                    />
                  </Tooltip>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setRestoring(revision)}
                  >
                    {t.revisions.restore}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <PageRevisionCompareModal
        pageId={pageId}
        revision={previewing}
        onClose={() => setPreviewing(null)}
        onRestore={(revision) => {
          setRestoring(revision)
          setPreviewing(null)
        }}
      />

      <Modal
        isOpen={!!restoring}
        onClose={() => setRestoring(null)}
        size="sm"
        title={t.revisions.restoreTitle}
        description={
          restoring
            ? t.revisions.restoreDescription(
                new Date(restoring.createdAt).toLocaleString(language)
              )
            : undefined
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRestoring(null)}
              disabled={restoreRevision.isPending}
            >
              {t.revisions.cancel}
            </Button>
            <Button
              variant="primary"
              loading={restoreRevision.isPending}
              onClick={handleConfirmRestore}
            >
              {t.revisions.confirmRestore}
            </Button>
          </>
        }
      />
    </div>
  )
}
