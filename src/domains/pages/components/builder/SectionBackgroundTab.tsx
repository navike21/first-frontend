import { useState } from 'react'
import { MediaLibraryModal, Select } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import type {
  BackgroundBreakpoint,
  BackgroundConfig,
  BackgroundFileSlot,
  BackgroundImage,
  BackgroundVideo,
  SectionBackground,
} from '../../model/page.types'
import { BackgroundImageFields } from './BackgroundImageFields'
import { BackgroundVideoFields } from './BackgroundVideoFields'

export interface SectionBackgroundTabProps {
  background: SectionBackground
  onChange: (breakpoint: BackgroundBreakpoint, config: BackgroundConfig) => void
  onPickFile: (breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot, file: File) => void
  onPickLibraryFile: (breakpoint: BackgroundBreakpoint, slot: BackgroundFileSlot, file: StorageFile) => void
}

const BREAKPOINT_ICONS: Record<BackgroundBreakpoint, IconName> = {
  desktop: 'RiComputerLine',
  tablet: 'RiTabletLine',
  mobile: 'RiSmartphoneLine',
}

const defaultImage = (): BackgroundImage => ({ type: 'image', position: 'center', fullScreen: false, parallax: false })
const defaultVideo = (): BackgroundVideo => ({ type: 'video', sourceKind: 'upload', files: [], parallax: false })

/** Un solo panel compartido (no un bloque por breakpoint): el selector decide
 * QUÉ config se edita, evitando triplicar cada campo futuro por desktop/
 * tablet/móvil. */
export const SectionBackgroundTab = ({ background, onChange, onPickFile, onPickLibraryFile }: SectionBackgroundTabProps) => {
  const { t } = usePagesTranslation()
  const [breakpoint, setBreakpoint] = useState<BackgroundBreakpoint>('desktop')
  const [libraryFor, setLibraryFor] = useState<{ slot: BackgroundFileSlot; kind: 'image' | 'video' } | null>(null)

  const config: BackgroundConfig = background[breakpoint] ?? { type: 'none' }

  const breakpointOptions = [
    { value: 'desktop', label: t.builder.background.breakpointDesktop, icon: BREAKPOINT_ICONS.desktop },
    { value: 'tablet', label: t.builder.background.breakpointTablet, icon: BREAKPOINT_ICONS.tablet },
    { value: 'mobile', label: t.builder.background.breakpointMobile, icon: BREAKPOINT_ICONS.mobile },
  ]

  const typeOptions = [
    { value: 'none', label: t.builder.background.typeNone },
    { value: 'image', label: t.builder.background.typeImage },
    { value: 'video', label: t.builder.background.typeVideo },
  ]

  const handleTypeChange = (type: string) => {
    if (type === 'image') onChange(breakpoint, defaultImage())
    else if (type === 'video') onChange(breakpoint, defaultVideo())
    else onChange(breakpoint, { type: 'none' })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Select
          label={t.builder.background.breakpointLabel}
          options={breakpointOptions}
          value={breakpoint}
          onChange={(e) => setBreakpoint(e.target.value as BackgroundBreakpoint)}
        />
        <Select
          label={t.builder.background.typeLabel}
          options={typeOptions}
          value={config.type}
          onChange={(e) => handleTypeChange(e.target.value)}
        />
      </div>

      {config.type === 'image' && (
        <BackgroundImageFields
          config={config}
          onChange={(patch) => onChange(breakpoint, { ...config, ...patch })}
          onPickFile={(file) => onPickFile(breakpoint, 'image', file)}
          onOpenLibrary={() => setLibraryFor({ slot: 'image', kind: 'image' })}
        />
      )}

      {config.type === 'video' && (
        <BackgroundVideoFields
          config={config}
          onChange={(patch) => onChange(breakpoint, { ...config, ...patch })}
          onPickFile={(slot, file) => onPickFile(breakpoint, slot, file)}
          onOpenLibrary={(slot) => setLibraryFor({ slot, kind: 'video' })}
        />
      )}

      {libraryFor && (
        <MediaLibraryModal
          isOpen
          onClose={() => setLibraryFor(null)}
          kind={libraryFor.kind}
          onSelect={(file) => onPickLibraryFile(breakpoint, libraryFor.slot, file)}
          texts={{
            titleImage: t.builder.mediaLibrary.titleImage,
            titleVideo: t.builder.mediaLibrary.titleVideo,
            searchPlaceholder: t.builder.mediaLibrary.searchPlaceholder,
            empty: t.builder.mediaLibrary.empty,
            selectLabel: t.builder.mediaLibrary.selectLabel,
            prevPage: t.builder.mediaLibrary.prevPage,
            nextPage: t.builder.mediaLibrary.nextPage,
          }}
        />
      )}
    </div>
  )
}
