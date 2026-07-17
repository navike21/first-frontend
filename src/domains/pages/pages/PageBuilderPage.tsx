import { useMemo, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { PageContent, Spinner, Button, Modal } from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { captureVideoFrame } from '@/shared/lib/captureVideoFrame'
import { navPaths } from '@/shared/router'
import { uploadEditorImage, resolveRichTextImages, directUploadVideo, attachVideoCoverWithRetry } from '@/shared/api/storage'
import type { StorageFile } from '@/shared/api/storage'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePage, useReplaceSections } from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'
import {
  normalizeSections,
  createColumnsSection,
  createTextElement,
  createImageElement,
  createSliderElement,
  createButtonElement,
  createGalleryElement,
  createAccordionElement,
  createTestimonialsElement,
  createStatsElement,
  createVideoElement,
  createMapElement,
  insertSection,
  moveSection,
  removeSection,
  setSectionColumns,
  setResponsiveSettings,
  setSectionBackground,
  setBackgroundImageUrl,
  setBackgroundVideoFile,
  addElement,
  updateElement,
  removeElement,
  moveElementAcross,
  replaceImageUrl,
  replaceSliderSlideUrl,
  replaceGalleryImageUrl,
  replaceTestimonialAvatarUrl,
  setVideoFile,
  resolveSectionsRichTextImages,
} from '../model/page.builder'
import { computeTranslationProgress } from '../model/pageTranslationProgress'
import type { BackgroundBreakpoint, BackgroundConfig, BackgroundFileSlot, BuilderSection } from '../model/page.types'
import { BuilderCanvas, PageTranslationProgress } from '../components/builder'

interface PendingBackgroundFile {
  sectionId: string
  breakpoint: BackgroundBreakpoint
  slot: BackgroundFileSlot
  file: File
}

interface PendingSliderFile {
  elementId: string
  file: File
  kind: 'image' | 'video'
}

interface PendingGalleryFile {
  elementId: string
  file: File
}

interface PendingTestimonialAvatarFile {
  elementId: string
  file: File
}

interface PendingVideoFile {
  elementId: string
  file: File
}

const backgroundFileKey = (sectionId: string, breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot) =>
  `${sectionId}:${breakpoint}:${slot}`

const mimeTypeForSlot = (slot: BackgroundFileSlot): string =>
  slot === 'video-webm' ? 'video/webm' : 'video/mp4'

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

async function uploadPendingFiles(sections: BuilderSection[], pendingFiles: Map<string, File>): Promise<BuilderSection[]> {
  let next = sections
  for (const [elementId, file] of pendingFiles) {
    const url = await uploadEditorImage(file)
    next = replaceImageUrl(next, elementId, url)
  }
  return next
}

async function uploadPendingBackgroundFiles(
  sections: BuilderSection[],
  pendingBackgroundFiles: Map<string, PendingBackgroundFile>,
): Promise<BuilderSection[]> {
  let next = sections
  for (const { sectionId, breakpoint, slot, file } of pendingBackgroundFiles.values()) {
    if (slot === 'image') {
      const url = await uploadEditorImage(file)
      next = setBackgroundImageUrl(next, sectionId, breakpoint, url)
    } else {
      // Sin miniatura: el fondo de sección ya se previsualiza con un
      // <video controls> real (un solo slot, no una grilla) — no hace
      // falta evitarle la carga del archivo.
      const { url, mimeType } = await directUploadVideo(file, crypto.randomUUID())
      next = setBackgroundVideoFile(next, sectionId, breakpoint, { url, mimeType })
    }
  }
  return next
}

async function uploadPendingSliderFiles(
  sections: BuilderSection[],
  pendingSliderFiles: Map<string, PendingSliderFile>,
): Promise<BuilderSection[]> {
  let next = sections
  for (const [blobUrl, { elementId, file, kind }] of pendingSliderFiles) {
    if (kind === 'image') {
      const url = await uploadEditorImage(file)
      next = replaceSliderSlideUrl(next, elementId, blobUrl, url)
    } else {
      const id = crypto.randomUUID()
      const { url } = await directUploadVideo(file, id)
      const cover = await captureVideoFrame(file)
      const posterUrl = cover ? await attachVideoCoverWithRetry(id, cover) : undefined
      next = replaceSliderSlideUrl(next, elementId, blobUrl, url, posterUrl)
    }
  }
  return next
}

async function uploadPendingGalleryFiles(
  sections: BuilderSection[],
  pendingGalleryFiles: Map<string, PendingGalleryFile>,
): Promise<BuilderSection[]> {
  let next = sections
  for (const [blobUrl, { elementId, file }] of pendingGalleryFiles) {
    const url = await uploadEditorImage(file)
    next = replaceGalleryImageUrl(next, elementId, blobUrl, url)
  }
  return next
}

async function uploadPendingTestimonialAvatarFiles(
  sections: BuilderSection[],
  pendingTestimonialAvatarFiles: Map<string, PendingTestimonialAvatarFile>,
): Promise<BuilderSection[]> {
  let next = sections
  for (const [blobUrl, { elementId, file }] of pendingTestimonialAvatarFiles) {
    const url = await uploadEditorImage(file)
    next = replaceTestimonialAvatarUrl(next, elementId, blobUrl, url)
  }
  return next
}

async function uploadPendingVideoFiles(
  sections: BuilderSection[],
  pendingVideoFiles: Map<string, PendingVideoFile>,
): Promise<BuilderSection[]> {
  let next = sections
  for (const { elementId, file } of pendingVideoFiles.values()) {
    // Mismo camino que el video del slider: subida directa a blob (salta el
    // límite de body de la función) + poster capturado de un frame.
    const id = crypto.randomUUID()
    const { url } = await directUploadVideo(file, id)
    const cover = await captureVideoFrame(file)
    const posterUrl = cover ? await attachVideoCoverWithRetry(id, cover) : undefined
    next = setVideoFile(next, elementId, url, posterUrl)
  }
  return next
}

export const PageBuilderPage = () => {
  const { t, language } = usePagesTranslation()
  const { pageId } = useParams({ strict: false }) as { pageId: string }
  const { data: item, isLoading } = usePage(pageId)
  const replaceSections = useReplaceSections(pageId)

  const [draft, setDraft] = useState<BuilderSection[] | null>(null)
  const [syncedWith, setSyncedWith] = useState<unknown>(null)
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map())
  const [pendingBackgroundFiles, setPendingBackgroundFiles] = useState<Map<string, PendingBackgroundFile>>(new Map())
  const [pendingSliderFiles, setPendingSliderFiles] = useState<Map<string, PendingSliderFile>>(new Map())
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<Map<string, PendingGalleryFile>>(new Map())
  const [pendingTestimonialAvatarFiles, setPendingTestimonialAvatarFiles] = useState<
    Map<string, PendingTestimonialAvatarFile>
  >(new Map())
  const [pendingVideoFiles, setPendingVideoFiles] = useState<Map<string, PendingVideoFile>>(new Map())
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [reviewLanguage, setReviewLanguage] = useState<Language>(language)

  const progress = useMemo(() => computeTranslationProgress(draft ?? [], SUPPORTED_LANGUAGES), [draft])

  // Adopta datos frescos del servidor durante el render (carga inicial y
  // refetch post-guardado), normalizados para que caché vieja o secciones de
  // otros tipos nunca rompan el builder.
  if (item && item !== syncedWith) {
    setSyncedWith(item)
    setDraft(normalizeSections(item.sections))
    setPendingFiles(new Map())
    setPendingBackgroundFiles(new Map())
    setPendingSliderFiles(new Map())
    setPendingGalleryFiles(new Map())
    setPendingTestimonialAvatarFiles(new Map())
    setPendingVideoFiles(new Map())
  }

  const serverNorm = item ? normalizeSections(item.sections) : null
  const dirty =
    !!draft &&
    !!serverNorm &&
    (!sameJson(draft, serverNorm) ||
      pendingFiles.size > 0 ||
      pendingBackgroundFiles.size > 0 ||
      pendingSliderFiles.size > 0 ||
      pendingGalleryFiles.size > 0 ||
      pendingTestimonialAvatarFiles.size > 0 ||
      pendingVideoFiles.size > 0)

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

  // Ya tiene URL real (viene de la biblioteca): se aplica directo, sin subida
  // diferida; limpia cualquier archivo pendiente que hubiera quedado de un
  // pick anterior para este mismo elemento (mutuamente excluyentes).
  const handleSelectImageLibrary = (elementId: string, file: StorageFile) => {
    patch((sections) => replaceImageUrl(sections, elementId, file.original.url))
    setPendingFiles((map) => {
      if (!map.has(elementId)) return map
      const next = new Map(map)
      next.delete(elementId)
      return next
    })
  }

  // A diferencia de handlePickFile, la inserción optimista de la diapositiva
  // en `slides` ya ocurre dentro de SliderElementCard (necesita controlar el
  // orden dentro de su propio array); acá solo se registra la subida
  // pendiente, indexada por esa misma blob url para poder reemplazarla más
  // tarde sin tocar el resto de las diapositivas.
  const handlePickSliderFile = (elementId: string, url: string, file: File, kind: 'image' | 'video') => {
    setPendingSliderFiles((map) => new Map(map).set(url, { elementId, file, kind }))
  }

  // Si no se quita la pendiente al borrar la diapositiva, handleSave la sigue
  // subiendo igual en cada guardado (huérfana: ya no está en ningún `slides`).
  const handleRemoveSliderFile = (url: string) => {
    setPendingSliderFiles((map) => {
      if (!map.has(url)) return map
      const next = new Map(map)
      next.delete(url)
      return next
    })
  }

  // Mismo patrón que handlePickSliderFile: GalleryElementCard ya inserta la
  // blob preview en `images`, acá solo se registra la subida pendiente.
  const handlePickGalleryFile = (elementId: string, url: string, file: File) => {
    setPendingGalleryFiles((map) => new Map(map).set(url, { elementId, file }))
  }

  const handleRemoveGalleryFile = (url: string) => {
    setPendingGalleryFiles((map) => {
      if (!map.has(url)) return map
      const next = new Map(map)
      next.delete(url)
      return next
    })
  }

  // Mismo patrón que handlePickGalleryFile: TestimonialsElementCard ya
  // inserta la blob preview en items[i].avatarUrl, acá solo se registra la
  // subida pendiente.
  const handlePickTestimonialAvatarFile = (elementId: string, url: string, file: File) => {
    setPendingTestimonialAvatarFiles((map) => new Map(map).set(url, { elementId, file }))
  }

  const handleRemoveTestimonialAvatarFile = (url: string) => {
    setPendingTestimonialAvatarFiles((map) => {
      if (!map.has(url)) return map
      const next = new Map(map)
      next.delete(url)
      return next
    })
  }

  // El VideoElementCard ya fijó la blob preview en element.fileUrl; acá solo se
  // registra la subida pendiente (mismo patrón diferido que el slider).
  const handlePickVideoFile = (elementId: string, url: string, file: File) => {
    setPendingVideoFiles((map) => new Map(map).set(url, { elementId, file }))
  }

  const handleRemoveVideoFile = (url: string) => {
    setPendingVideoFiles((map) => {
      if (!map.has(url)) return map
      const next = new Map(map)
      next.delete(url)
      return next
    })
  }

  // Borrar el elemento entero también debe limpiar sus subidas pendientes
  // (mismo motivo que handleRemoveSliderFile) para texto/imagen/slider/
  // galería/testimonios.
  const handleElementDelete = (sectionId: string, columnId: string, elementId: string) => {
    patch((s) => removeElement(s, sectionId, columnId, elementId))
    setPendingFiles((map) => {
      if (!map.has(elementId)) return map
      const next = new Map(map)
      next.delete(elementId)
      return next
    })
    setPendingSliderFiles((map) => {
      const next = new Map(map)
      let changed = false
      for (const [url, entry] of map) {
        if (entry.elementId === elementId) {
          next.delete(url)
          changed = true
        }
      }
      return changed ? next : map
    })
    setPendingGalleryFiles((map) => {
      const next = new Map(map)
      let changed = false
      for (const [url, entry] of map) {
        if (entry.elementId === elementId) {
          next.delete(url)
          changed = true
        }
      }
      return changed ? next : map
    })
    setPendingTestimonialAvatarFiles((map) => {
      const next = new Map(map)
      let changed = false
      for (const [url, entry] of map) {
        if (entry.elementId === elementId) {
          next.delete(url)
          changed = true
        }
      }
      return changed ? next : map
    })
    setPendingVideoFiles((map) => {
      const next = new Map(map)
      let changed = false
      for (const [url, entry] of map) {
        if (entry.elementId === elementId) {
          next.delete(url)
          changed = true
        }
      }
      return changed ? next : map
    })
  }

  const handleBackgroundChange = (sectionId: string, breakpoint: BackgroundBreakpoint, config: BackgroundConfig) =>
    patch((sections) => setSectionBackground(sections, sectionId, breakpoint, config))

  // Preview optimista inmediato (blob local); el archivo real solo se sube
  // al guardar (mismo patrón diferido que las imágenes de elementos).
  const handlePickBackgroundFile = (
    sectionId: string,
    breakpoint: BackgroundBreakpoint,
    slot: BackgroundFileSlot,
    file: File,
  ) => {
    const previewUrl = URL.createObjectURL(file)
    patch((sections) =>
      slot === 'image'
        ? setBackgroundImageUrl(sections, sectionId, breakpoint, previewUrl)
        : setBackgroundVideoFile(sections, sectionId, breakpoint, { url: previewUrl, mimeType: mimeTypeForSlot(slot) }),
    )
    setPendingBackgroundFiles((map) => new Map(map).set(backgroundFileKey(sectionId, breakpoint, slot), {
      sectionId,
      breakpoint,
      slot,
      file,
    }))
  }

  // Ya tiene URL real (viene de la biblioteca): se aplica directo, sin pasar
  // por la subida diferida.
  const handlePickLibraryFile = (
    sectionId: string,
    breakpoint: BackgroundBreakpoint,
    slot: BackgroundFileSlot,
    file: StorageFile,
  ) => {
    patch((sections) =>
      slot === 'image'
        ? setBackgroundImageUrl(sections, sectionId, breakpoint, file.original.url)
        : setBackgroundVideoFile(sections, sectionId, breakpoint, { url: file.original.url, mimeType: file.mimeType }),
    )
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
      sections = await uploadPendingFiles(sections, pendingFiles)
      sections = await uploadPendingBackgroundFiles(sections, pendingBackgroundFiles)
      sections = await uploadPendingSliderFiles(sections, pendingSliderFiles)
      sections = await uploadPendingGalleryFiles(sections, pendingGalleryFiles)
      sections = await uploadPendingTestimonialAvatarFiles(sections, pendingTestimonialAvatarFiles)
      sections = await uploadPendingVideoFiles(sections, pendingVideoFiles)
      sections = await resolveSectionsRichTextImages(sections, (html) => resolveRichTextImages(html, uploadEditorImage))
      setDraft(sections)
      setPendingFiles(new Map())
      setPendingBackgroundFiles(new Map())
      setPendingSliderFiles(new Map())
      setPendingGalleryFiles(new Map())
      setPendingTestimonialAvatarFiles(new Map())
      setPendingVideoFiles(new Map())
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
      <div className="mb-4">
        <PageTranslationProgress
          progress={progress}
          reviewLanguage={reviewLanguage}
          onReviewLanguageChange={setReviewLanguage}
          nativeLanguage={language}
        />
      </div>

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
        language={reviewLanguage}
        onAddSection={handleAddSection}
        onSectionMove={(activeId, overId) => patch((s) => moveSection(s, activeId, overId))}
        onChooseColumns={(sectionId, count) => patch((s) => setSectionColumns(s, sectionId, count))}
        onColumnsChange={(sectionId, count) => patch((s) => setSectionColumns(s, sectionId, count))}
        onResponsiveChange={(sectionId, responsivePatch) =>
          patch((s) => setResponsiveSettings(s, sectionId, responsivePatch))
        }
        onBackgroundChange={handleBackgroundChange}
        onPickBackgroundFile={handlePickBackgroundFile}
        onPickLibraryFile={handlePickLibraryFile}
        onDeleteRequest={setDeletingSectionId}
        onAddText={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createTextElement()))}
        onAddImage={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createImageElement()))}
        onAddSlider={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createSliderElement()))}
        onAddButton={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createButtonElement()))}
        onAddGallery={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createGalleryElement()))}
        onAddAccordion={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createAccordionElement()))}
        onAddTestimonials={(sectionId, columnId) =>
          patch((s) => addElement(s, sectionId, columnId, createTestimonialsElement()))
        }
        onAddStats={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createStatsElement()))}
        onAddVideo={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createVideoElement()))}
        onAddMap={(sectionId, columnId) => patch((s) => addElement(s, sectionId, columnId, createMapElement()))}
        onElementChange={(sectionId, columnId, elementId, elementPatch) =>
          patch((s) => updateElement(s, sectionId, columnId, elementId, elementPatch))
        }
        onElementDelete={handleElementDelete}
        onElementMove={(elementId, source, target, overElementId) =>
          patch((s) => moveElementAcross(s, elementId, source, target, overElementId))
        }
        onPickFile={handlePickFile}
        onSelectImageLibrary={handleSelectImageLibrary}
        onPickSliderFile={handlePickSliderFile}
        onRemoveSliderFile={handleRemoveSliderFile}
        onPickGalleryFile={handlePickGalleryFile}
        onRemoveGalleryFile={handleRemoveGalleryFile}
        onPickTestimonialAvatarFile={handlePickTestimonialAvatarFile}
        onRemoveTestimonialAvatarFile={handleRemoveTestimonialAvatarFile}
        onPickVideoFile={handlePickVideoFile}
        onRemoveVideoFile={handleRemoveVideoFile}
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
