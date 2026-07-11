import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { PageContent, Spinner, Button, Modal } from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { navPaths } from '@/shared/router'
import { uploadEditorImage } from '@/shared/api/storage'
import { usePage, useReplaceSections } from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'
import {
  normalizeSections,
  createColumnsSection,
  createTextElement,
  createImageElement,
  insertSection,
  moveSection,
  removeSection,
  setSectionColumns,
  setResponsiveSettings,
  addElement,
  updateElement,
  removeElement,
  moveElementAcross,
  replaceImageUrl,
} from '../model/page.builder'
import type { BuilderSection } from '../model/page.types'
import { BuilderCanvas } from '../components/builder'

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

export const PageBuilderPage = () => {
  const { t, language } = usePagesTranslation()
  const { pageId } = useParams({ strict: false }) as { pageId: string }
  const { data: item, isLoading } = usePage(pageId)
  const replaceSections = useReplaceSections(pageId)

  const [draft, setDraft] = useState<BuilderSection[] | null>(null)
  const [syncedWith, setSyncedWith] = useState<unknown>(null)
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map())
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Adopta datos frescos del servidor durante el render (carga inicial y
  // refetch post-guardado), normalizados para que caché vieja o secciones de
  // otros tipos nunca rompan el builder.
  if (item && item !== syncedWith) {
    setSyncedWith(item)
    setDraft(normalizeSections(item.sections))
    setPendingFiles(new Map())
  }

  const serverNorm = item ? normalizeSections(item.sections) : null
  const dirty = !!draft && !!serverNorm && (!sameJson(draft, serverNorm) || pendingFiles.size > 0)

  const patch = (fn: (sections: BuilderSection[]) => BuilderSection[]) =>
    setDraft((d) => (d ? fn(d) : d))

  // Sin índice (clic en la paleta) añade al final; con índice (soltar sobre
  // el lienzo entre/antes de secciones existentes) se inserta ahí. Sin
  // columnas definidas: la sección nace "pendiente de elegir" y así se queda
  // hasta que el usuario elija explícitamente, aunque mientras tanto se
  // añadan más secciones (cada una rastrea su propio estado pendiente).
  const handleAddSection = (atIndex?: number) => {
    const section = createColumnsSection()
    patch((sections) => insertSection(sections, section, atIndex))
  }

  const handlePickFile = (elementId: string, file: File) => {
    const previewUrl = URL.createObjectURL(file)
    patch((sections) => replaceImageUrl(sections, elementId, previewUrl))
    setPendingFiles((map) => new Map(map).set(elementId, file))
  }

  const handleConfirmDeleteSection = () => {
    if (!deletingSectionId) return
    patch((sections) => removeSection(sections, deletingSectionId))
    setDeletingSectionId(null)
  }

  const handleSave = async () => {
    if (!draft) return
    setUploading(true)
    try {
      let sections = draft
      for (const [elementId, file] of pendingFiles) {
        const url = await uploadEditorImage(file)
        sections = replaceImageUrl(sections, elementId, url)
      }
      setDraft(sections)
      setPendingFiles(new Map())
      replaceSections.mutate(sections, { onSuccess: () => notify.success(t.builder.saved) })
    } catch {
      notify.error(t.builder.uploadError)
    } finally {
      setUploading(false)
    }
  }

  if (isLoading || !item || !draft) {
    return (
      <PageContent title={t.page.builderTitle} description={t.page.builderTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  const name = item.title[language] || item.title.en
  const saving = uploading || replaceSections.isPending

  return (
    <PageContent
      title={t.page.builderTitle}
      description={t.page.builderDescription(name)}
      actions={[
        {
          type: 'link',
          label: t.table.editItem,
          variant: 'outline',
          to: navPaths.pageEdit(item.id, language),
          size: 'small',
        },
      ]}
    >
      <div className="mb-4 flex items-center justify-end gap-3">
        {dirty && <span className="text-xs text-amber-500">{t.builder.unsaved}</span>}
        <Button
          variant="primary"
          size="small"
          disabled={!dirty}
          loading={saving}
          onClick={() => {
            void handleSave()
          }}
        >
          {t.builder.save}
        </Button>
      </div>

      <BuilderCanvas
        sections={draft}
        language={language}
        onAddSection={handleAddSection}
        onSectionMove={(activeId, overId) => patch((s) => moveSection(s, activeId, overId))}
        onChooseColumns={(sectionId, count) => patch((s) => setSectionColumns(s, sectionId, count))}
        onColumnsChange={(sectionId, count) => patch((s) => setSectionColumns(s, sectionId, count))}
        onResponsiveChange={(sectionId, responsivePatch) =>
          patch((s) => setResponsiveSettings(s, sectionId, responsivePatch))
        }
        onDeleteRequest={setDeletingSectionId}
        onAddText={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createTextElement()))}
        onAddImage={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createImageElement()))}
        onElementChange={(sectionId, columnId, elementId, elementPatch) =>
          patch((s) => updateElement(s, sectionId, columnId, elementId, elementPatch))
        }
        onElementDelete={(sectionId, columnId, elementId) =>
          patch((s) => removeElement(s, sectionId, columnId, elementId))
        }
        onElementMove={(elementId, source, target, overElementId) =>
          patch((s) => moveElementAcross(s, elementId, source, target, overElementId))
        }
        onPickFile={handlePickFile}
      />

      <Modal
        isOpen={!!deletingSectionId}
        onClose={() => setDeletingSectionId(null)}
        size="sm"
        title={t.builder.deleteSection}
        description={t.builder.deleteSectionConfirm}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingSectionId(null)}>
              {t.builder.cancel}
            </Button>
            <Button variant="primary" onClick={handleConfirmDeleteSection}>
              {t.builder.confirmDelete}
            </Button>
          </>
        }
      />
    </PageContent>
  )
}
