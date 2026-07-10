import { useParams } from '@tanstack/react-router'
import { PageContent, Spinner, LinkButton, IconComponent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { usePage } from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'

export const PageBuilderPage = () => {
  const { t, language } = usePagesTranslation()
  const { pageId } = useParams({ strict: false }) as { pageId: string }
  const { data: item, isLoading } = usePage(pageId)

  if (isLoading || !item) {
    return (
      <PageContent title={t.page.builderTitle} description={t.page.builderTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  const name = item.title[language] || item.title.en

  return (
    <PageContent title={t.page.builderTitle} description={t.page.builderDescription(name)}>
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <IconComponent icon="RiLayout4Line" className="h-10 w-10 text-muted" />
        <p className="text-base font-semibold text-foreground">{t.page.builderComingSoon}</p>
        <p className="max-w-md text-sm leading-relaxed text-secondary">{t.page.builderComingSoonHint}</p>
        <LinkButton to={navPaths.pageEdit(item.id, language)} variant="outline" size="small">
          {t.table.editItem}
        </LinkButton>
      </div>
    </PageContent>
  )
}
