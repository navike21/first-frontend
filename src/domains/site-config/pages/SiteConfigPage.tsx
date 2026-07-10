import { useState } from 'react'
import { PageContent, Tabs, Button, Spinner, Can } from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { CAN } from '@/shared/lib/permissions'
import { useSiteConfigTranslation } from '../i18n'
import { useSiteConfig, useUpdateSiteConfig } from '../api/site-config.queries'
import type {
  SiteConfigData,
  SiteConfigUpdatePayload,
  HeaderConfig,
  FooterConfig,
  LayoutConfig,
} from '../model/site-config.types'
import { HeaderConfigPanel } from '../components/HeaderConfigPanel'
import { FooterConfigPanel } from '../components/FooterConfigPanel'
import { ContentConfigPanel } from '../components/ContentConfigPanel'

type TabId = 'header' | 'footer' | 'content'

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

export const SiteConfigPage = () => {
  const { t, language } = useSiteConfigTranslation()
  const { data: serverConfig, isLoading } = useSiteConfig()
  const updateConfig = useUpdateSiteConfig()

  const [activeTab, setActiveTab] = useState<TabId>('header')
  const [draft, setDraft] = useState<SiteConfigData | null>(null)
  const [syncedWith, setSyncedWith] = useState<SiteConfigData | null>(null)

  // Adopt fresh server data during render (initial load and post-save refetch).
  if (serverConfig && serverConfig !== syncedWith) {
    setSyncedWith(serverConfig)
    setDraft(structuredClone(serverConfig))
  }

  const patchHeader = (patch: Partial<HeaderConfig>) =>
    setDraft((d) => (d ? { ...d, header: { ...d.header, ...patch } } : d))
  const patchFooter = (patch: Partial<FooterConfig>) =>
    setDraft((d) => (d ? { ...d, footer: { ...d.footer, ...patch } } : d))
  const patchLayout = (patch: Partial<LayoutConfig>) =>
    setDraft((d) => (d ? { ...d, layout: { ...d.layout, ...patch } } : d))

  const dirtyHeader = !!draft && !!serverConfig && !sameJson(draft.header, serverConfig.header)
  const dirtyFooter = !!draft && !!serverConfig && !sameJson(draft.footer, serverConfig.footer)
  const dirtyLayout = !!draft && !!serverConfig && !sameJson(draft.layout, serverConfig.layout)
  const dirty = dirtyHeader || dirtyFooter || dirtyLayout

  const handleSave = () => {
    if (!draft) return
    const payload: SiteConfigUpdatePayload = {
      ...(dirtyHeader && { header: draft.header }),
      ...(dirtyFooter && { footer: draft.footer }),
      ...(dirtyLayout && { layout: draft.layout }),
    }
    updateConfig.mutate(payload, {
      onSuccess: () => notify.success(t.actions.saved),
    })
  }

  const tabs = [
    { id: 'header', label: t.tabs.header },
    { id: 'footer', label: t.tabs.footer },
    { id: 'content', label: t.tabs.content },
  ]

  if (isLoading || !draft) {
    return (
      <PageContent title={t.page.title} description={t.page.description}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent title={t.page.title} description={t.page.description}>
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
          instanceId="site-config"
          ariaLabel={t.page.title}
        />

        {activeTab === 'header' && (
          <HeaderConfigPanel value={draft.header} language={language} onChange={patchHeader} />
        )}
        {activeTab === 'footer' && (
          <FooterConfigPanel value={draft.footer} language={language} onChange={patchFooter} />
        )}
        {activeTab === 'content' && <ContentConfigPanel value={draft.layout} onChange={patchLayout} />}

        <Can anyOf={CAN.siteConfigUpdate}>
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            {dirty && <span className="text-xs text-amber-500">{t.actions.unsavedHint}</span>}
            <Button variant="primary" disabled={!dirty} loading={updateConfig.isPending} onClick={handleSave}>
              {t.actions.save}
            </Button>
          </div>
        </Can>
      </div>
    </PageContent>
  )
}
