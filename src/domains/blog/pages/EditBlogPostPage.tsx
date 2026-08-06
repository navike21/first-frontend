import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { BlogPostForm } from '../components/BlogPostForm/BlogPostForm'
import { usePostById, useUpdatePost } from '../api/blog.queries'
import { useBlogTranslation } from '../i18n'
import { toBlogPostPayload } from '../model/blog.schema'
import type { BlogFormData } from '../model/blog.schema'
import type { Post } from '../model/blog.types'
import type { BlogImageFiles } from '../api/blog.api'

function toLocalDateTimeInput(iso: string | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toFormValues(item: Post): Partial<BlogFormData> {
  return {
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt ?? undefined,
    content: item.content,
    categoryIds: item.categoryIds,
    tagIds: item.tagIds,
    authorId: item.authorId ?? '',
    seoMetaTitle: item.seo?.metaTitle ?? undefined,
    seoMetaDescription: item.seo?.metaDescription ?? undefined,
    seoKeywords: item.seo?.keywords ?? undefined,
    seoOgImage: item.seo?.ogImage ?? '',
    status: item.status,
    scheduledAt: toLocalDateTimeInput(item.scheduledAt),
  }
}

export const EditBlogPostPage = () => {
  const navigate = useNavigate()
  const { t, language } = useBlogTranslation()
  const { postId } = useParams({ strict: false }) as { postId: string }
  const { data: item, isLoading } = usePostById(postId)
  const updatePost = useUpdatePost(item?.id ?? '')

  const handleUpdate = (
    data: BlogFormData,
    files: BlogImageFiles,
    removeCover?: boolean,
    coverLibraryUrl?: string
  ) => {
    updatePost.mutate(
      {
        data: toBlogPostPayload(data),
        files,
        removeCover,
        coverLibraryUrl,
      },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.updated)
          // 2xx with warnings = record saved but an image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.blog(language) as never })
        },
        // Offline: the edit is queued (without its images). Soft success —
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

  if (isLoading || !item) {
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
      description={t.page.editDescription(
        item.title[language] || item.title.en
      )}
    >
      <BlogPostForm
        mode="edit"
        initialValues={toFormValues(item)}
        initialCoverUrl={item.coverImageUrl}
        isSubmitting={updatePost.isPending}
        submitError={updatePost.error}
        onCancel={() => navigate({ to: navPaths.blog(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
