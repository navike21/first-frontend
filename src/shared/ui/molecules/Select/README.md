# 🎛️ Select

Componente de selección accesible, compuesto y completamente tipado. Soporta modo simple, múltiple con chips, búsqueda inline, slots de contenido personalizado y traducción automática por idioma.

---

## 📦 Importación

```tsx
import { Select } from '@Components/molecules'
```

---

## ✨ Características

| Feature                        | Descripción                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| 🌐 i18n automático             | Prop `lang` traduce todos los textos internos del componente           |
| ✏️ Override puntual            | Prop `texts` permite personalizar uno o todos los textos manualmente   |
| 🔍 Búsqueda inline             | Prop `search` activa un input de filtro dentro del dropdown            |
| 🏷️ Modo múltiple               | Prop `multiple` permite selección múltiple con chips                   |
| 🖼️ Slots de contenido          | `leftSlot` y `rightSlot` para íconos o elementos adicionales           |
| ⌨️ Accesibilidad               | Navegación completa por teclado, roles WAI-ARIA, `aria-label` dinámico |
| 🎭 Variantes de estado         | `default` · `success` · `error` · `warning` con íconos y colores       |
| 🔗 Integración con formularios | Forwardea `ref` al `<select>` nativo, compatible con RHF               |
| 🪄 Portal de dropdown          | El dropdown se renderiza fuera del árbol DOM para evitar clipping      |
| ♿ SSR safe                    | Flag de montado previene mismatch de hidratación en Next.js App Router |

---

## 🧩 Props

### Generales

| Prop           | Tipo                                             | Default       | Descripción                                           |
| -------------- | ------------------------------------------------ | ------------- | ----------------------------------------------------- |
| `options`      | `SelectOptionItem[]`                             | **requerido** | Array de opciones a mostrar                           |
| `label`        | `ReactNode`                                      | —             | Etiqueta visible sobre el campo                       |
| `placeholder`  | `string`                                         | —             | Texto cuando no hay ninguna opción seleccionada       |
| `variant`      | `'default' \| 'success' \| 'error' \| 'warning'` | `'default'`   | Estado visual del campo                               |
| `disabled`     | `boolean`                                        | `false`       | Deshabilita el selector completo                      |
| `loading`      | `boolean`                                        | `false`       | Muestra spinner y bloquea interacciones               |
| `multiple`     | `boolean`                                        | `false`       | Activa selección múltiple con chips                   |
| `search`       | `boolean`                                        | `false`       | Activa el input de búsqueda/filtrado                  |
| `defaultValue` | `string \| string[]`                             | —             | Valor inicial (no controlado)                         |
| `value`        | `string \| string[]`                             | —             | Valor controlado externamente                         |
| `helperText`   | `ReactNode`                                      | —             | Texto auxiliar debajo del campo                       |
| `errorMessage` | `ReactNode`                                      | —             | Mensaje de error (visible solo con `variant="error"`) |
| `leftSlot`     | `ReactNode`                                      | —             | Contenido en el lado izquierdo del trigger            |
| `rightSlot`    | `ReactNode`                                      | —             | Contenido en el lado derecho del trigger              |
| `className`    | `string`                                         | —             | Clase CSS para el contenedor exterior                 |
| `classInput`   | `string`                                         | —             | Clase CSS para el área de input visible               |
| `id`           | `string`                                         | auto-generado | ID del campo nativo (para `htmlFor` externo)          |

### 🌐 Internacionalización

| Prop    | Tipo                   | Default | Descripción                                                      |
| ------- | ---------------------- | ------- | ---------------------------------------------------------------- |
| `lang`  | `Language`             | —       | Establece el idioma de todos los textos internos automáticamente |
| `texts` | `Partial<SelectTexts>` | —       | Override manual de uno o más textos internos                     |

#### Prioridad de resolución de textos

```
DEFAULT_SELECT_TEXTS → SELECT_TEXTS_BY_LANG[lang] → texts
```

1. Se parte de los defaults en inglés.
2. Si se pasa `lang`, se aplica el preset completo del idioma.
3. Si se pasa `texts`, sobreescribe solo las claves especificadas.

#### Idiomas soportados (`lang`)

| Código | Idioma    |
| ------ | --------- |
| `es`   | Español   |
| `en`   | English   |
| `de`   | Deutsch   |
| `fr`   | Français  |
| `it`   | Italiano  |
| `ja`   | 日本語    |
| `ko`   | 한국어    |
| `pt`   | Português |
| `zh`   | 中文      |
| `ru`   | Русский   |

#### Claves de `SelectTexts`

| Clave                   | Descripción                                   | Default (en)         |
| ----------------------- | --------------------------------------------- | -------------------- |
| `noOptionsFound`        | Texto cuando la búsqueda no arroja resultados | `'No options found'` |
| `searchPlaceholder`     | Placeholder del input de búsqueda             | `'Search...'`        |
| `searchAriaLabel`       | `aria-label` del input de búsqueda            | `'Search options'`   |
| `openOptionsAriaLabel`  | `aria-label` del botón de abrir dropdown      | `'Open options'`     |
| `closeOptionsAriaLabel` | `aria-label` del botón de cerrar dropdown     | `'Close options'`    |

> 💡 **Nota:** El `placeholder` principal del Select (texto cuando no hay selección) se pasa directamente como prop `placeholder` y es independiente de `texts`.

---

## 🔤 `SelectOptionItem`

```ts
interface SelectOptionItem {
  label: string // Texto visible
  value: string // Valor interno
  disabled?: boolean // Deshabilita la opción
  icon?: IconName // Ícono de la librería de íconos del proyecto
  content?: ReactNode // Contenido visual personalizado (avatar, badge, etc.)
}
```

---

## 📖 Ejemplos de uso

### Básico

```tsx
<Select
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]}
  placeholder="Select an option"
/>
```

### Con label y helper text

```tsx
<Select
  label="Category"
  options={categoryOptions}
  placeholder="Select a category"
  helperText="Choose the most relevant one."
/>
```

### Con búsqueda y muchas opciones

```tsx
<Select
  label="Country"
  options={countryOptions}
  search
  placeholder="Select a country"
/>
```

### Modo múltiple

```tsx
<Select label="Tags" options={tagOptions} multiple placeholder="Select tags" />
```

### Variante de error

```tsx
<Select
  label="Required field"
  options={options}
  variant="error"
  errorMessage="Please select an option."
  placeholder="Select..."
/>
```

### 🌐 Autotraducción por idioma

```tsx
// Todos los textos internos se traducen automáticamente
<Select options={countryOptions} search lang="es" />
<Select options={countryOptions} search lang="zh" />
<Select options={countryOptions} search lang="ja" />
```

### 🌐 Override puntual sobre un preset de idioma

```tsx
// El idioma base es español, pero el mensaje de vacío es personalizado
<Select
  options={countryOptions}
  search
  lang="es"
  texts={{ noOptionsFound: 'País no encontrado' }}
/>
```

### 🌐 Override total manual (sin lang)

```tsx
// Sin lang: solo se sobreescriben las claves pasadas, el resto usa defaults en inglés
<Select
  options={options}
  search
  texts={{
    searchPlaceholder: 'Filtrar...',
    noOptionsFound: 'Sin resultados'
  }}
/>
```

### Controlado con React Hook Form

```tsx
const { register } = useForm()

<Select
  label="Role"
  options={roleOptions}
  placeholder="Select role"
  {...register('role')}
/>
```

### Con slots y íconos

```tsx
<Select
  label="Navigate to"
  options={navigationOptions}
  leftSlot={
    <IconComponent icon="RiCompassLine" className="size-5 text-slate-500" />
  }
  rightSlot={
    <IconComponent icon="RiArrowRightSLine" className="size-5 text-slate-400" />
  }
/>
```

---

## ⌨️ Navegación por teclado

| Tecla             | Acción                                                                   |
| ----------------- | ------------------------------------------------------------------------ |
| `Enter` / `Space` | Abre o cierra el dropdown                                                |
| `ArrowDown`       | Mueve el foco a la siguiente opción habilitada (wrap al llegar al final) |
| `ArrowUp`         | Mueve el foco a la opción anterior habilitada (wrap al llegar al inicio) |
| `Escape`          | Cierra el dropdown                                                       |
| `Tab`             | Cierra el dropdown y mueve el foco al siguiente elemento                 |

---

## ♿ Accesibilidad

- El trigger usa `role="combobox"` con `aria-expanded`, `aria-haspopup` y `aria-controls`.
- El dropdown usa `role="listbox"` con `aria-multiselectable` en modo múltiple.
- Cada opción usa `role="option"` con `aria-selected` y `aria-disabled`.
- El `<select>` nativo se mantiene oculto (`sr-only`) para compatibilidad con lectores de pantalla y formularios.
- Los `aria-label` del botón de caret y del input de búsqueda son configurables vía `lang` o `texts`.

---

## 🏗️ Arquitectura interna

```
Select/
├── index.tsx                    # Componente principal (forwardRef, provider de textos)
├── Select.types.ts              # Tipos: SelectProps, SelectOptionItem, SelectTexts, SelectVariant
├── Select.texts.ts              # Contexto de textos + diccionario por idioma
├── Select.hooks.ts              # Hook principal de estado (open/close, filtrado, selección, ...)
├── Select.test.tsx              # Tests unitarios
├── Select.stories.tsx           # Storybook
├── components/
│   ├── OptionsList/             # Lista de opciones del dropdown
│   ├── SelectedChips/           # Chips de selección múltiple
│   ├── SelectDropdownPortal/    # Portal del dropdown (escapa overflow/clip)
│   ├── SelectInputArea/         # Área visual del trigger + portal
│   ├── SelectFooter/            # Helper text y mensaje de error
│   └── TriggerDisplay/          # Display de opción seleccionada o placeholder
├── constants/
│   └── variantIconMap.ts        # Mapa de íconos por variante
└── helper/
    └── getInputAreaClass.ts     # Helper puro de Tailwind para el input
```

---

## 🧪 Tests

Los tests cubren:

- ✅ Render con opciones, label y placeholder
- ✅ Abrir/cerrar dropdown (click, teclado, blur externo)
- ✅ Selección simple y múltiple
- ✅ Opciones deshabilitadas
- ✅ Búsqueda y filtrado
- ✅ Navegación por teclado (ArrowUp/Down, Enter, Escape, wrap)
- ✅ Dropdown posición `top` / `bottom` según espacio disponible
- ✅ Ref forwarding (object ref y callback ref)
- ✅ Modo controlado y no controlado
- ✅ Slots izquier/derecho
- ✅ `lang` aplica preset de idioma automáticamente
- ✅ `texts` sobreescribe claves sobre el preset de `lang`
- ✅ Fallback a defaults en inglés sin props de i18n

Ejecutar tests:

```bash
pnpm test src/libs/components/molecules/Select/Select.test.tsx
```

---

## 📝 Notas

- El `placeholder` del campo principal y el `searchPlaceholder` (input de búsqueda) son **independientes**. El primero va en la prop `placeholder` del Select; el segundo va en `texts.searchPlaceholder` o se traduce automáticamente con `lang`.
- El dropdown se renderiza vía `createPortal` en `document.body` para escapar de contenedores con `overflow:hidden` o `clip`.
- El `<select>` nativo se mantiene en el DOM oculto (`sr-only`) para integrarse con formularios HTML y RHF sin setup adicional.
