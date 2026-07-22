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
  colores hex arbitrarios (de contenido, ej. HexColorInput del builder/forms).
  Es lo único de "elegir color" que queda: el color de la MARCA está bloqueado
  (ver la sección de marca abajo), no hay selector de tema.
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

## Marca / sistema de diseño (bloqueado al Manual de Marca First)

El color y las tipografías están **fijos a la marca** — no hay selector de tema
de color (se eliminó el `ColorPicker` + el `primaryColor` por usuario). Todo
vive en `src/app/styles/index.css`:
- **Color**: un único acento **Azul First `#4C86FF`** = `--color-primary-600`.
  Los CTAs sólidos (Button primary, etc.) usan `primary-600` con hover
  `primary-700` (#3E63B5); enlaces = `primary-700`. `primary-800` = #34456B,
  `950` = navy `#0B1220`. Neutros (tema claro): Niebla `#F3F5F9`
  (surface-subtle), Línea `#E3E8F0` (border), Pizarra `#5C6675` (text-secondary),
  Navy foreground.
- **Modo oscuro**: se conserva el toggle claro/oscuro, y el dark usa la
  **familia navy del manual** (surface `#131b2d`, sidebar/subtle `#0b1220` =
  Navy Base, border `#232e45`), no grises genéricos. El acento sigue siendo
  `#4C86FF`. (No confundir "claro/oscuro" con la selección de color, que ya no
  existe.)
- **Tipografía**: `--font-sans` = **IBM Plex Sans** (UI/cuerpo, heredado desde
  `html,body`), `--font-display` = **Space Grotesk** (tracking -0.02em),
  `--font-mono` = **IBM Plex Mono** (tokens/IDs). **Todo `h1`–`h6` toma Space
  Grotesk automáticamente** — hay una regla global en `index.css` (fuera de
  `@layer`, ver gotcha abajo) que lo aplica a cualquier heading tag sin que el
  componente haga nada. Un título que **no** es un heading semántico (un
  `<span>`/`<div>` usado como titular por layout) necesita la clase
  `font-display` explícita.
- **Insignia de marca**: `AppLogo` (`shared/ui/atoms`) y `public/favicon.svg`
  usan la insignia del manual — badge Navy Base + 3 barras ascendentes
  (Azul Profundo/Medio/First). Geometría exacta de los assets oficiales
  exportados por el usuario (`first-icon.svg`/`first-logo.svg`), no una
  aproximación. `AppLogo` colorea por clases (`fill-primary-950/800/700/600`
  o `fill-white`); `favicon.svg` lleva los hex fijos porque es un asset servido
  directo por el navegador (no pasa por Tailwind) — es la única excepción
  legítima a la regla de "sin hex sueltos" de abajo.
- **`BrandMark`** (`shared/ui/molecules`): el lockup ícono+wordmark ("First"
  en `font-display`) del manual, para donde hay espacio (Header, Login,
  páginas de error). Para espacios reducidos/avatares usa `AppLogo` a secas
  (el ícono solo) — el favicon ya cubre ese caso. `BrandMark` importa
  `AppLogo` por ruta relativa (no por el barrel), como toda composición
  dentro de `shared/ui`.
  - **Animación de entrada** (`animateIn`, default `false`): las 3 barras
    ascienden con stagger (~90ms) y un rebote sutil (mismo cubic-bezier que
    `--ease-spring-bounce`), vía `motion/react` (`motion.rect` animando
    `y`/`height` directamente). Respeta `prefers-reduced-motion` con
    `useReducedMotion()` (si está activo, renderiza las posiciones finales
    sin animar). **Reservada a momentos de "entrada fría"** — se monta una
    vez cuando el usuario recién llega (`LoginLayout`, `ForbiddenPage`,
    `NotFoundPage`). **Nunca** en `Header` u otro elemento que persista y se
    re-monte en cada navegación interna de la SPA — re-animar el logo en
    cada click sería ruido, no un detalle de marca.
  - **Pulso de carga** (`pulse`, default `false`): las mismas 3 barras
    laten en loop mientras hay una operación en curso en cualquier parte de
    la app — usado en el logo del `Header` vía `useHeader().isLoading`
    (`useGlobalLoading`, `shared/lib`). `useGlobalLoading` combina
    `useIsFetching`/`useIsMutating` de React Query + el estado de navegación
    de TanStack Router — como el `QueryClient` y el `Router` son únicos y
    globales, esto cubre guardar un formulario, construir una página o
    paginar una tabla sin que cada pantalla tenga que reportarlo, y trae un
    debounce de 150ms para no parpadear en cargas casi instantáneas (ej. una
    página ya en caché). A diferencia de `animateIn` (que anima los
    atributos `y`/`height`, un one-shot corto), `pulse` anima solo
    `transform: scaleY` (con `originY: 1`, ancladas a su propia base) —
    compositor puro, sin reflow de layout — porque puede sostenerse durante
    cargas largas y no debe competir por el hilo principal justo cuando la
    app ya está ocupada. Si ambas props están activas, `pulse` gana. También
    respeta `prefers-reduced-motion`.

### Regla dura: nada de valores arbitrarios de color/fuente

**Prohibido** en JSX/TSX: `text-[#...]`, `bg-[#...]`, `border-[#...]`,
`fill-[#...]`, `font-['...']` — cualquier valor de color o fuente entre
corchetes. Todo color/fuente **del sistema de diseño** se consume por **clase
con nombre**: utilidades `primary-*` o tokens semánticos (`text-foreground`,
`bg-surface`, `fill-primary-600`…) para color; `font-display`/`font-mono` (o
heredado) para fuente. Si falta un tono, se **agrega al CSS** (`@theme` /
`--color-*`), nunca inline. Así, **cambiar la tipografía o el color de todo el
sistema = editar solo `src/app/styles/index.css`**, sin tocar componentes.
Verificación rápida: `grep -rE "(text|bg|border|ring|fill)-\[#|font-\[" src`
debe devolver 0 coincidencias (fuera de tests).

Excepción legítima: `HexColorInput` (`shared/ui/molecules`) sí acepta hex
libre — es color de **contenido** elegido por el usuario (branding de un
cliente en el builder/forms), no del sistema de diseño de First. Esa regla
solo aplica al chrome de la app, no a datos de negocio.

**Gotcha real (ya resuelto, no reintroducir):** una regla de elemento
(`h1 { font-family: ... }`) dentro de `@layer base` **no se emite** en este
setup de Tailwind v4 — quedaba muerta en el código fuente sin dar error ni
warning. Y a la inversa: una regla **sin** `@layer` (top-level) tiene prioridad
de cascada sobre **cualquier** utilidad de Tailwind (que sí vive en un layer),
sin importar especificidad — por eso la regla global de headings vive
deliberadamente top-level. Si se agrega una regla de elemento nueva a
`index.css`, probarla en el navegador con `getComputedStyle` — un lint/build
en verde no garantiza que la regla realmente aplique.

## Auth: recuperar/restablecer contraseña

`domains/auth` tiene 3 páginas (`useAuthTranslation`, renombrado desde
`useLoginTranslation` ya que dejó de ser solo login): Login, `ForgotPasswordPage`
(pide el email, slug traducido por idioma) y `ResetPasswordPage` (desde el link
del correo, `/{lang}/reset-password?token=...`).

- **`reset-password` usa un slug FIJO** (igual en los 10 idiomas), a propósito
  fuera de `ROUTE_SLUGS` — lo genera el *backend* dentro de un email de un solo
  uso; sincronizar una traducción por idioma entre los dos repos para un link
  que casi nunca se ve como texto no vale el riesgo. Mismo precedente que
  `login` en `navigation.config.ts` (`NAV`/`SEGMENTS`, no `ROUTE_SLUGS`).
- `ResetPasswordLayout` lee el token con `useSearch({ strict: false })` (primer
  uso de `useSearch` en el código) — no puede usar `{ from: resetPasswordRoute.id }`
  porque la ruta importa el layout (ciclo), así que se castea el resultado a mano.
- El estado "enlace inválido" tiene dos disparadores que renderizan la misma
  vista: sin `token` en absoluto (nunca se llega a intentar el submit), o un
  submit real que responde 401 `INVALID_TOKEN`.

### Gotcha (ya resuelto, no reintroducir): `HttpError.code`/`.details` venían siempre `undefined`
El backend anida `code`/`details` bajo `error: {...}` en toda respuesta de error
(`helpers/responseStructure.ts::errorResponse`); `message` sí queda al nivel
superior. `shared/api/api.services.ts::parseErrorBody` leía `code`/`details`
del nivel superior (donde nunca estuvieron) — cualquier `error.code === 'X'`
en el frontend (`PagesTrashPage`, `serverFormErrors.ts`, y el nuevo
`useResetPassword`) fallaba en silencio contra el backend real, aunque el test
lo tapaba (mockeaba el JSON con la forma plana equivocada). Arreglado leyendo
`body.error?.code`/`body.error?.details`. Si un `.code===` nuevo "nunca dispara"
contra el backend real pese a verse bien en tests, sospechar del mock antes que
de la lógica.

### Gotcha (ya resuelto, no reintroducir): cambiar de idioma borraba los search params
`LanguageSwitcher` navega con `router.navigate({ to: newPath, replace: true })`
sin `search` — TanStack Router no preserva los query params por defecto, así
que cualquier `?foo=bar` se perdía al cambiar de idioma. Invisible hasta ahora
porque `reset-password` es el primer uso real de search params en la app.
Arreglado con `search: true` (preserva tal cual). Si se agrega una página con
search params propios, probar el selector de idioma sobre ella explícitamente.

## Documentación relacionada
- `first-backend/CLAUDE.md` — convenciones del backend.
- `README.md` — qué es el proyecto y cómo levantarlo.
