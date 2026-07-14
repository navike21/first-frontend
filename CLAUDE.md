# first-frontend — guía para Claude

SPA React + TypeScript + Vite, arquitectura **domain-sliced**
(`src/domains/<dominio>/{api,components,i18n,model,pages}` +
`src/shared/{ui,lib,api,types,model,router}`). Es el frontend de **First**:
plataforma multipropósito (CRM + CMS). Es el par de `first-backend`
(DDD modular), que tiene su propio `CLAUDE.md`.

## Comandos
- `pnpm typecheck` — `tsc -b`. `pnpm lint` — eslint. `pnpm lint:sonar` —
  eslint-plugin-sonarjs (cognitive complexity ≤15 y otros code smells).
  Los tres deben quedar en 0 antes de cerrar cualquier cambio.
- `pnpm vitest run` — suite completa.
- `pnpm build` — vite build.

## Regla crítica: reutilización de componentes

**Ningún componente potencialmente reutilizable se define dentro de un
`domains/*`.** Antes de escribir un componente o función nueva:

1. Revisa `src/shared/ui/index.ts` (componentes UI) y `src/shared/lib/index.ts`
   (funciones utilitarias puras) — puede que ya exista.
2. Si no existe pero el mismo patrón visual/lógico aparece o aparecerá en
   más de un formulario/módulo, créalo en `shared/ui` (o `shared/lib` si es
   una función pura sin JSX) y expórtalo desde el barrel correspondiente.
   No lo dupliques "por ahora" en el dominio con la idea de extraerlo después.
3. Dentro de `shared/ui`, los componentes se importan entre sí por **ruta
   relativa** (`../../atoms/IconButton`, `../Tooltip`), nunca vía el barrel
   `@/shared/ui` — ese barrel es solo para consumidores fuera de `shared/ui`.

Ejemplos canónicos de este patrón (creados para eliminar duplicación real
entre 6+ formularios de negocio):
- `LangSidebar` / `LangTabs` (`shared/ui/molecules`) — selector de idioma
  para formularios con campos traducibles (sidebar con badge+nombre vs.
  fila compacta de chips). `LangBadge` (`shared/ui/atoms`) es el badge de
  código de idioma en sí, usado tanto dentro de `LangSidebar` como suelto
  junto a labels de campos individuales.
- `HexColorInput` (`shared/ui/molecules`) — swatch + input de texto para
  colores hex arbitrarios. No confundir con `ColorPicker` (paleta fija de
  swatches de marca/tema).
- `SortableItemActions` (`shared/ui/molecules`) — fila de
  drag-handle + botón eliminar para items reordenables con `useSortable`
  (dnd-kit). No usar para overlays sobre thumbnails (ver `GalleryPicker.Tile`,
  patrón visual distinto).
- `langDotClass` (`shared/lib`) — color del punto de estado (error/completo/
  vacío) de un idioma.

## Regla crítica: campos numéricos

**Todo campo numérico usa `InputNumber` (`shared/ui/molecules`), nunca
`InputField` con `inputMode="numeric"`/`"decimal"` ni saneo manual con
regex.** `InputNumber` bloquea caracteres no numéricos a nivel de tecleo
(vía `sanitizeNumeric`) y expone `decimals`, `allowNegative`, `mask` (formato
fijo tipo `"### ### ###"` para teléfonos) y `thousandSeparator`.

Es **no controlado** (`defaultValue`, sin prop `value` externa). Si un campo
necesita corregir/clampear el valor externamente (ej. min/max al hacer blur)
y reflejarlo visualmente, usa un contador de versión como `key` para forzar
remount **solo cuando el clamp corrige algo** — no en cada tecla, o se pierde
la posición del cursor mientras se escribe. Ver `ContentConfigPanel.tsx`
(`boxedMaxWidth`) para el patrón completo.

No apliques `InputNumber` a campos que parecen numéricos pero no lo son
(ancho/alto en px o %, "valor" de estadística tipo "500+", número de
documento alfanumérico) — esos siguen usando `InputField` plano.

## Documentación relacionada
- `first-backend/CLAUDE.md` — convenciones del backend.
- `README.md` — qué es el proyecto y cómo levantarlo.
