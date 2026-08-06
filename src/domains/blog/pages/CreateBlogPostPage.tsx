import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { BlogPostForm } from '../components/BlogPostForm/BlogPostForm'
import { useCreatePost } from '../api/blog.queries'
import { useBlogTranslation } from '../i18n'
import { toBlogPostPayload } from '../model/blog.schema'
import type { BlogFormData } from '../model/blog.schema'
import type { BlogImageFiles } from '../api/blog.api'

export const CreateBlogPostPage = () => {
  const navigate = useNavigate()
  const { t, language } = useBlogTranslation()
  const createPost = useCreatePost()

  const handleCreate = (
    data: BlogFormData,
    files: BlogImageFiles,
    _removeCover?: boolean,
    coverLibraryUrl?: string
  ) => {
    createPost.mutate(
      { data: toBlogPostPayload(data), files, coverLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          // 2xx with warnings = record saved but an image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.blog(language) as never })
        },
        // Offline: the post is queued (without its images). Soft success —
        // warn the images were skipped and go back to the list.
        onError: onQueuedOrFieldErrors(() => {
          if (files.cover || files.ogImage) {
            notify.warning(t.toasts.offlinePhotoSkipped)
          }
          navigate({ to: navPaths.blog(language) as never })
        }),
      }
    )
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <BlogPostForm
        mode="create"
        isSubmitting={createPost.isPending}
        submitError={createPost.error}
        onCancel={() => navigate({ to: navPaths.blog(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
