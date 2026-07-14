import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { FormFieldType } from './form.types'
import type { FormFormField, FormFormLocalized } from './form.schema'

export function emptyLocalized(): FormFormLocalized {
  return Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as unknown as FormFormLocalized
}

/** Sensible per-type defaults for a newly-added field — select/radio start with
 * 2 empty options since the backend requires at least 2 for those types.
 * `fieldId` is assigned client-side immediately (not left for the backend) so
 * dnd-kit's `useSortable` has a stable id to key on from the moment a field is
 * added, before the form is ever saved — same precedent as the page builder's
 * `addItem` (`id: crypto.randomUUID()`). The backend keeps this id as-is
 * rather than generating its own (see `assignFieldIds`). */
export function createField(type: FormFieldType): FormFormField {
  const base: FormFormField = {
    fieldId: crypto.randomUUID(),
    type,
    label: emptyLocalized(),
    placeholder: emptyLocalized(),
    required: true,
    options: [],
  }

  if (type === 'select' || type === 'radio') {
    return {
      ...base,
      options: [
        { value: '', label: emptyLocalized() },
        { value: '', label: emptyLocalized() },
      ],
    }
  }

  return base
}

/** Called when a field's type changes in the editor — drops type-specific data
 * (e.g. `options`) that no longer applies, so it doesn't linger unused. */
export function resetFieldForType(field: FormFormField, type: FormFieldType): FormFormField {
  const isChoiceType = type === 'select' || type === 'radio'
  let options: FormFormField['options'] = []
  if (isChoiceType) {
    options = field.options.length >= 2 ? field.options : createField(type).options
  }
  return { ...field, type, options }
}

export function emptyOption(): { value: string; label: FormFormLocalized } {
  return { value: '', label: emptyLocalized() }
}
