import { Checkbox } from '@/shared/ui'
import { SUPPORTED_LANGUAGES, NATIVE_LANGUAGE_NAMES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useSiteConfigTranslation } from '../../i18n'

export interface ContentLanguagesConfigPanelProps {
  value: Language[]
  onChange: (next: Language[]) => void
}

/** A negocio (no de First mismo) le pertenece este alcance: qué idiomas de
 * los soportados usa realmente para su contenido (Pages/Services/Portfolio/
 * Categories/Tags/Collaborators/Forms) — independiente del idioma de
 * interfaz de quien esté editando en First. Siempre queda al menos uno
 * seleccionado (el último checkbox marcado se deshabilita para no poder
 * desmarcarlo). */
export const ContentLanguagesConfigPanel = ({
  value,
  onChange,
}: ContentLanguagesConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  const toggle = (lang: Language) => {
    if (value.includes(lang)) {
      if (value.length === 1) return
      onChange(value.filter((l) => l !== lang))
    } else {
      onChange([...value, lang])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted text-xs">{t.languages.hint}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const checked = value.includes(lang)
          return (
            <Checkbox
              key={lang}
              label={`${NATIVE_LANGUAGE_NAMES[lang]} (${lang.toUpperCase()})`}
              checked={checked}
              disabled={checked && value.length === 1}
              onChange={() => toggle(lang)}
            />
          )
        })}
      </div>
      {value.length === 1 && (
        <p className="text-muted text-xs">{t.languages.minimumHint}</p>
      )}
    </div>
  )
}
