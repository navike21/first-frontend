import { usePagesTranslation } from '../../i18n'

export interface SeoSocialPreviewsProps {
  title: string
  description: string
  imageUrl: string
  path: string
}

interface CardImageProps {
  imageUrl: string
  aspectClass: string
  alt: string
  noImageLabel: string
}

const CardImage = ({ imageUrl, aspectClass, alt, noImageLabel }: CardImageProps) =>
  imageUrl ? (
    <img src={imageUrl} alt={alt} className={`${aspectClass} w-full object-cover`} />
  ) : (
    <div className={`${aspectClass} flex w-full items-center justify-center bg-surface-subtle text-xs text-muted`}>
      {noImageLabel}
    </div>
  )

// Cards mirror each network's real desktop rendering: Facebook link cards are
// ~500 px wide (1.91:1 image), LinkedIn ~552 px (1.91:1), X ~516 px (2:1) and
// Google snippets cap at ~600 px.
export const SeoSocialPreviews = ({ title, description, imageUrl, path }: SeoSocialPreviewsProps) => {
  const { t } = usePagesTranslation()
  const host = window.location.host
  const shownTitle = title || '—'
  const shownDescription = description || '—'
  const crumbs = [host, ...path.split('/').filter(Boolean)].join(' › ')

  return (
    <div className="flex flex-col gap-4">
      {/* Google SERP — max ~600px, 20px title */}
      <div className="flex w-full max-w-[600px] flex-col gap-0.5 rounded-lg border border-border p-4">
        <span className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted">{t.seo.previewGoogle}</span>
        <p className="truncate text-xs text-secondary">{crumbs}</p>
        <p className="line-clamp-1 text-xl leading-snug text-blue-700 dark:text-blue-400">{shownTitle}</p>
        <p className="line-clamp-2 text-sm text-secondary">{shownDescription}</p>
      </div>

      {/* Facebook link card — ~500px, 1.91:1 image, grey footer */}
      <div className="flex w-full max-w-[500px] flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{t.seo.previewFacebook}</span>
        <div className="overflow-hidden border border-border">
          <CardImage
            imageUrl={imageUrl}
            aspectClass="aspect-[1.91/1]"
            alt={t.seo.previewFacebook}
            noImageLabel={t.seo.noImage}
          />
          <div className="bg-surface-subtle px-3 py-2">
            <p className="truncate text-xs uppercase text-muted">{host}</p>
            <p className="line-clamp-1 text-[15px] font-semibold text-foreground">{shownTitle}</p>
            <p className="line-clamp-1 text-sm text-secondary">{shownDescription}</p>
          </div>
        </div>
      </div>

      {/* LinkedIn card — ~552px, 1.91:1 image, title + domain */}
      <div className="flex w-full max-w-[552px] flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{t.seo.previewLinkedIn}</span>
        <div className="overflow-hidden rounded-sm border border-border shadow-sm">
          <CardImage
            imageUrl={imageUrl}
            aspectClass="aspect-[1.91/1]"
            alt={t.seo.previewLinkedIn}
            noImageLabel={t.seo.noImage}
          />
          <div className="bg-surface px-3 py-2">
            <p className="line-clamp-2 text-sm font-semibold text-foreground">{shownTitle}</p>
            <p className="mt-0.5 truncate text-xs text-muted">{host}</p>
          </div>
        </div>
      </div>

      {/* X (Twitter) card — ~516px, 2:1 image, rounded */}
      <div className="flex w-full max-w-[516px] flex-col gap-1">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted">{t.seo.previewX}</span>
        <div className="overflow-hidden rounded-2xl border border-border">
          <CardImage imageUrl={imageUrl} aspectClass="aspect-[2/1]" alt={t.seo.previewX} noImageLabel={t.seo.noImage} />
          <div className="px-3 py-2">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{shownTitle}</p>
            <p className="line-clamp-1 text-xs text-secondary">{shownDescription}</p>
            <p className="truncate text-xs text-muted">{host}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
