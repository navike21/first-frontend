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

## Ambientes (development / test / production)

Tres ambientes, cada uno con su propio backend (base de datos separada) —
desarrollo local **nunca** toca datos de producción:

| Ambiente | Frontend | Backend (`VITE_API_BASE_URL`) | Cuándo |
|---|---|---|---|
| **Development** | Local (`pnpm dev`, `localhost:5176`) — sin backend local | `https://first-backend-git-test-navike21.vercel.app` | Día a día. Un solo proceso — el backend corre en Vercel (ambiente Test), no en la laptop |
| **Test** | `https://first-frontend-git-test-navike21.vercel.app` | `https://first-backend-git-test-navike21.vercel.app` | Staging persistente — verificar una feature completa (front+back) antes de mergear |
| **Production** | `https://first-frontend-rose.vercel.app` | `https://first-backend-alpha.vercel.app` | Usuarios reales |

**La rama `test` (en ambos repos) es infraestructura, no una rama de
feature** (ver `TEST_BRANCH.md`) — existe solo para que Vercel tenga un
branch estable donde desplegar Test. Tiene un PR permanentemente abierto
contra `main` (PR #59 — **nunca mergear ni cerrar**) porque el proyecto
**solo auto-despliega ramas con un PR asociado** (confirmado en vivo: un
`git push` de `test` sin PR no generó ningún deployment; abrir el PR sí lo
disparó de inmediato). Para traer los cambios de `main` a Test:
`git checkout test && git merge main && git push`.

Las URLs `-git-test-` quedan detrás del SSO de Vercel (protección de
deployment por defecto para cualquier alias que no sea el dominio de
producción, igual que cualquier otro Preview) — accesibles para el equipo
logueado en Vercel, no público; esto es esperado, no un bug.

### Gotcha real (ya resuelto, no reintroducir): `.env` local apuntaba a producción con URL absoluta, sin CORS
`VITE_API_BASE_URL` local traía la URL de **producción** en texto plano,
contradiciendo el propio comentario del archivo ("dejar vacío en local — el
proxy de Vite reenvía"). Como el valor SÍ estaba seteado, el navegador
llamaba directo (cross-origin) a producción en vez de pasar por el proxy —
y `WHITELISTED_DOMAINS` de Production (Vercel) solo lista los dominios de
Vercel desplegados, nunca `localhost` — así que el navegador bloqueaba la
petición por CORS, mostrando "Failed to fetch" sin ninguna pista de la
razón real. Confirmado pidiendo el valor real de `WHITELISTED_DOMAINS` de
Production vía `vercel env pull`.

Arreglado con el ambiente de **Test** de arriba: `.env` local ahora apunta
`VITE_API_BASE_URL`/`VITE_SOCKET_URL` al backend de test (nunca producción),
y ese backend tiene `WHITELISTED_DOMAINS` (scope Preview, rama `test`)
seteado explícitamente para incluir `http://localhost:5176` — confirmado
en vivo con `curl -H "Origin: http://localhost:5176"` devolviendo
`Access-Control-Allow-Origin: http://localhost:5176`. El proxy de
`vite.config.ts` (`/api` → ahora el backend de test, no producción) queda
como respaldo de seguridad por si `VITE_API_BASE_URL` alguna vez se deja
vacío por error — así ese error nunca termina mutando datos reales.

## Deploy (Vercel)
Producción: `first-frontend-rose.vercel.app` (proyecto
`prj_EKV3QfROHvQAUxsDvS0DWJ2OTp4H`, team `team_HlO61rBCXDgQTkK5byfxEoEk`).
Auto-deploy por rama vía GitHub (`main`→Production, `test`→ambiente de test
persistente, cualquier otra rama con PR abierto→Preview efímero). **El alias
de producción no siempre sigue al deploy nuevo tras un merge** (visto en el
merge de PR #55 y de nuevo en el de PR #58 — el deploy se construyó y quedó
`READY`/`target: production`, pero `first-frontend-rose.vercel.app` seguía
apuntando al anterior) — mismo síntoma ya documentado como recurrente en
`first-backend/CLAUDE.md`; conviene verificar tras cada merge
(`get_deployment` comparando `githubCommitSha` contra `git rev-parse main`,
o `curl` simple) y corregir con `vercel alias set <url-del-deploy-nuevo>
first-frontend-rose.vercel.app --scope navike21` si no coincide. El mismo
comando aplica para re-apuntar `first-frontend-git-test-navike21.vercel.app`
tras un deploy manual a Test.
- `pnpm vitest run` — suite completa.
- `pnpm build` — vite build.

### Gotcha real (ya resuelto, no reintroducir): el service worker (PWA) podía dejar a un usuario varios deploys atrás sin avisar
`vite-plugin-pwa` con `registerType: 'autoUpdate'` **no activa la nueva
service worker por su cuenta** — se verificó leyendo el código generado
(`node_modules/vite-plugin-pwa/dist/client/build/react.js`): en modo `auto`
el cliente nunca llama a `messageSkipWaiting()` (esa llamada está detrás de
un `if (!auto)`), y la propia `sw.js` generada solo hace `self.skipWaiting()`
al **recibir** ese mensaje, nunca por su cuenta. Sin nadie que mande el
mensaje, una service worker nueva se queda en estado `waiting` indefinidamente
— el comportamiento "seguro" de Workbox por defecto es esperar a que **se
cierren todas las pestañas** de ese origen antes de activarla, para no
cambiar de versión bajo un usuario con la app abierta. En una pestaña de
celular que rara vez se cierra del todo, esto significa que un usuario puede
quedar **varios deploys atrás indefinidamente**, sin ningún error visible —
solo contenido/comportamiento desactualizado. Confirmado en vivo: un fix ya
desplegado (`<html lang>`, ver sección de i18n) no se aplicó pese a dos
recargas completas de la página — la nueva service worker estaba `waiting`,
y solo se activó al mandarle el mensaje `SKIP_WAITING` a mano desde la
consola. Además, el registro solo revisa si hay una versión nueva **una
vez** (al registrarse) — una pestaña abierta por un rato nunca se entera de
deploys posteriores sin un chequeo repetido.

Arreglado en dos partes:
- `vite.config.ts`: `registerType` pasó de `'autoUpdate'` a `'prompt'` — el
  modo que sí conecta `messageSkipWaiting()` cuando el código de la app lo
  pide explícitamente (`auto=false` habilita esa rama).
- `app/main.tsx`: `registerSW({ onNeedRefresh() { updateSW(true) } })`
  fuerza la actualización **en cuanto se detecta** una versión nueva (en vez
  de mostrarle un prompt al usuario o esperar a que cierre todas las
  pestañas), y `onRegisteredSW` arranca un `setInterval` de 60s llamando
  `registration.update()` para que una pestaña de larga vida sí vuelva a
  revisar por su cuenta.

Si se toca este mecanismo de nuevo, verificar en vivo con
`navigator.serviceWorker.getRegistrations()` (mirar `.waiting` además de
`.active`) — un `pnpm build` o `pnpm test` en verde no revisan que la nueva
versión realmente tome control.

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
  **`--color-primary-hover`** (#3E6FE0 — token propio, **no** `primary-700`);
  `primary-700` (#3E63B5) queda reservado para hover de **texto/enlaces**
  (variant `ghost`, links). `primary-800` = #34456B, `950` = navy `#0B1220`.
  Neutros (tema claro): Niebla `#F3F5F9` (surface-subtle), Línea `#E3E8F0`
  (border), Pizarra `#5C6675` (text-secondary), Navy foreground.
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

## Alineación de átomos al Design System de First (botones, inputs, selectores)

Fase 1 de una alineación pixel-a-pixel de `shared/ui` contra "First Design
System.dc.html" (documento claude.ai/design del usuario). Cubre Botones,
Inputs (`InputLayout`→`InputField`/`InputNumber`, `TextArea`, `InputDate`) y
Selectores (`Select`, `Checkbox`, `RadioOption`, `Switch`) + los tokens de
color/radio de los que dependen. **Fuera de esta fase** (no tocado todavía,
posible fase 2): rework visual de Cards/Chips/Tabs/Tooltip/Accordion/Avatar/
Badge/Progress/Steppers, y un componente nuevo de Segmented Control (el
Design System lo documenta pero no existe hoy en el código).

- **Radios con nombre** (`@theme` en `index.css`, Tailwind v4 conecta
  `--radius-*` a `rounded-*` automáticamente): `--radius-control` (8px —
  botones, inputs, select-search), `--radius-select` (10px — trigger y panel
  del `Select`, valor propio del manual, distinto de 8 y 12), `--radius-checkbox`
  (5px). El radio de Card (12px) ya coincidía vía `rounded-xl`, sin cambio.
- **Color danger** (`--color-danger-50/200/600` = #FBE7E7/#F3D2D2/#D64545):
  reemplaza los `red-500`/`emerald-500`/`yellow-500` genéricos de Tailwind que
  usaban `InputLayout`/`TextArea`/`InputDate`/`Select`/`Checkbox`/`RadioOption`/
  `HelperText` para su estado `error` — antes ningún error en la app usaba el
  rojo de marca.
- **Semánticos claro/oscuro nuevos** en `:root`/`.dark`: `--surface-input`
  (fondo de input/select, dark `#111A2C` — distinto de `surface-subtle`),
  `--surface-panel` (fondo del panel abierto del Select, dark `#151F35`),
  `--surface-hover-row` (fila hover/seleccionada del Select, dark `#1B2540` —
  coincide con `surface-raised`, es intencional), `--border-control` (borde
  de controles, dark `#2A3650` — **distinto** de `--border` genérico que en
  dark es `#232E45`, el borde de card), `--border-hover` (borde en hover,
  `#B9C2D0` en claro; el valor dark es inferido — el manual no documenta ese
  estado para oscuro).
- **Taxonomía de `ButtonVariant`** (`shared/types/buttonVariants.ts`, fuente
  única para `Button`/`IconButton`/`LinkButton`) rehecha para calzar 1:1 con
  los 4 botones del manual: `primary` | `secondary` | `ghost` | `text` |
  `destructive`.
  - `secondary` **cambió de apariencia**: antes era un botón con anillo azul
    (`ring-primary-700`); ahora es blanco/neutro (`bg-surface`,
    `border-control`, texto `text-foreground`) — así es como el manual lo
    define ("Vista previa"/"Cancelar"). Todo call-site existente de
    `secondary` (~15 archivos) hereda el look correcto automáticamente.
  - `ghost` es **nuevo** (transparente, texto `primary-700`, hover
    `surface-subtle`) — el GHOST del manual. Aún sin consumidores reales en
    este pase (el caso de uso obvio, los links "¿Olvidaste tu contraseña?"/
    "← Volver a inicio de sesión", vive en la feature de auth todavía sin
    mergear); adoptarlo ahí cuando esa rama se integre.
  - `error` se **renombró a `destructive`** (mecánico, el type-checker marca
    cada call-site) y cambió de rojo sólido a blanco/borde-danger-200/texto-
    danger-600 con hover danger-50 — el DESTRUCTIVE del manual. Se verificó
    que el 100% de los usos reales eran acciones de purgar/eliminar antes de
    hacer el rename.
  - `outline`/`warning`/`information` se **retiraron** del type: `outline`
    (2 call-sites reales) se consolidó en `secondary` (mismo uso semántico,
    "volver"/"vista previa"); `warning`/`information` no tenían ningún uso
    real fuera de tests/stories.
  - `text` **no se tocó** — sigue siendo el patrón establecido para botones
    de ícono sin fondo en tablas (50+ archivos), un caso de uso propio que el
    Design System no cubre; redefinirlo hubiera tenido un blast radius fuera
    de alcance.
  - Tamaños (`sizeClasses`) pasaron de padding vertical a **altura fija**
    (SM=32px/MD=40px/LG=48px, paddings y tamaños de fuente exactos del
    manual) — antes los botones eran notablemente más grandes que el diseño.
- **Checkbox**: el estado marcado antes NO rellenaba la caja (dejaba
  `bg-surface` y solo espesaba un `ring-10`, una utilidad de Tailwind que ni
  siquiera existe — bug silencioso, nunca se vio el efecto) — ahora rellena
  `bg-primary-600` con el check blanco encima, como el manual.
- **RadioOption**: el ring "marcado" usaba `primary-700` (el tono reservado
  para hover de texto/enlaces) en vez de `primary-600` (el acento real) —
  corregido. También su tamaño pasó de 20px (`h-5 w-5`) a 18px exacto, como
  Checkbox.
- **Botones sin sombra**: verificado con un grep de `box-shadow` sobre la
  sección Botones completa del manual → **0 coincidencias**. `Button`/
  `IconButton`/`LinkButton` tenían `shadow-md shadow-black/30` +
  `hover:shadow-lg` en todo variant "sólido" (era código pre-existente, no
  del manual) — se retiró por completo (`variantHasShadow` ya no existe).
- **Glow de foco** (`--shadow-focus-ring: 0 0 0 3px rgba(76,134,255,0.18)`,
  token nuevo en `@theme`): es un halo, no una sombra de elevación — verificado
  contra las 3 apariciones idénticas en Inputs/Selectores (input, checkbox,
  radio, switch). Reemplaza el `focus-within:shadow-sm` genérico que tenían
  `InputLayout`/`TextArea` (no aplicaba a `InputDate`, que no tenía ningún
  glow de foco — se agregó ahí también). `Checkbox`/`RadioOption`/`Switch`
  también lo llevan en `focus-visible`.
  - **Gotcha (ya resuelto, no reintroducir):** `focus-within:ring-primary-600`
    y `hover:ring-border-hover` son dos pseudo-clases de **igual
    especificidad** sobre la misma propiedad (`ring-color`) — sin ayuda, gana
    la que Tailwind emite después en la hoja de estilos (orden no
    determinista para el autor), y en la práctica el hover pisaba el foco
    (un input enfocado con el mouse encima quedaba con el ring gris, no
    azul — confirmado con `getComputedStyle` en vivo). Arreglado con el
    modificador `!important` de Tailwind v4 (sufijo `!`, ej.
    `focus-within:ring-primary-600!`) en `InputLayout`/`TextArea`/`InputDate`.
    Los casos de `has-[input:checked]:ring-primary-600` (Checkbox/RadioOption/
    Switch) no tenían este problema — `:has()` ya suma especificidad extra
    sobre `:hover` sola, gana sin necesitar `!`. Si se agrega un nuevo estado
    con prioridad sobre hover, verificar con `getComputedStyle` en el
    navegador (hover **y** foco simultáneos, ej. click con el mouse quieto
    sobre el campo) — un lint/build en verde no lo detecta.
- **Panel del Select — sombra por tema** (`--shadow-panel-down`/`-up`,
  indirección a `--panel-shadow-down`/`-up` en `:root`/`.dark`, mismo patrón
  que `--color-surface`/`--surface`): el manual usa un rgba **distinto** en
  oscuro (`rgba(0,0,0,0.35)` vs `rgba(11,18,32,0.14)` en claro) — la primera
  versión de este cambio dejó el valor de claro fijo para ambos temas.
- **`Select` — ícono de error** (`constants/variantIconMap.ts`): también
  usaba `text-red-500`, en un archivo aparte de `getInputAreaClass.ts` — se
  pasó por alto en la primera pasada de esta alineación; corregido a
  `text-danger-600`.

**Segunda ronda de hallazgos** (tras un pedido explícito de re-verificar a
fondo — la primera pasada de arriba, aunque correcta, no fue exhaustiva):

- **`--text-muted` tenía los valores de claro/oscuro invertidos**: el token
  ya existía antes de esta alineación, pero con `#8A97B3` en `:root` — ese
  es en realidad el valor que el manual usa para **oscuro** (confirmado:
  aparece siempre dentro de las cajas "DARK" de Inputs/Selectores, nunca en
  las de "LIGHT"). El valor de claro real es `#9AA4B5` (el de los labels de
  estado — "Inactivo"/"Hover"/etc. — y el placeholder). Corregido: claro
  `#9AA4B5`, oscuro `#8A97B3`.
- **Botones — `disabled` no era un color plano**: el manual solo tiene **un**
  swatch de Disabled (no uno por variant), y reemplaza el color por completo
  (`bg:#E3E8F0`, `texto:#9AA4B5`, sin borde) — el código hacía
  `opacity-50` sobre el color del variant (un botón primary disabled se veía
  azul desteñido, no gris). `Button`/`IconButton` ahora reemplazan el color
  del variant por completo cuando `disabled` (`variant !== 'text'`; `text`
  queda con el `opacity-50` viejo por estar fuera del alcance del Design
  System).
- **Botones — `loading` atenuaba solo el texto**: el manual pone
  `opacity:0.85` en el botón **entero** (spinner incluido); el código
  aplicaba `opacity-70` solo al `<div>` del texto, dejando el spinner al
  100%. Corregido: la opacidad ahora vive en el botón raíz.
- **`secondary` en dark no es un relleno sólido**: verificado en la franja
  LIGHT/DARK de Botones — "Cancelar" en oscuro es
  `background:transparent`, no un `bg-surface` navy. `variantColorClasses.secondary`
  ahora lleva `dark:bg-transparent`.
- **Gotcha de foco (ya resuelto, no reintroducir) — Checkbox/RadioOption/
  Switch**: estos tres tienen un `<button>` puramente decorativo (pinta la
  caja/círculo/track) envolviendo un `<input>` real con `opacity-0` que es
  el que de verdad recibe clicks/foco/cambia `checked`. Antes el botón NO
  tenía `tabIndex={-1}`, así que era focusable por su cuenta — con Tab caían
  **dos** tab-stops por cada control (el botón decorativo vacío, después el
  input real), y `focus-visible:shadow-focus-ring` estaba puesto en el botón
  (que nunca es el elemento realmente enfocado — ver abajo), así que el glow
  de foco **nunca se veía** en la práctica. Arreglado con dos cambios juntos:
  `tabIndex={-1}` en el botón decorativo (un solo tab-stop, el del input) +
  `has-[input:focus-visible]:shadow-focus-ring` en vez de `focus-visible:`
  directo (detecta el foco del input anidado, no el del wrapper). Verificado
  en vivo con `document.activeElement`/`getComputedStyle` tras un `Tab` real
  — clave: un click de mouse SÍ mueve el foco real al input pero
  correctamente **no** dispara `:focus-visible` (eso es el comportamiento
  esperado del navegador, no un bug); solo un `Tab` de teclado lo hace. Si
  se toca este patrón de nuevo, probar con Tab real, no con `.click()` ni
  con un click de mouse simulado — ninguno de los dos prueba `:focus-visible`.

## `UserMenu` (`shared/ui/molecules`) — reemplaza al `ProfileDrawer`

El manual documenta el "Menú de usuario" como un **dropdown compacto**
(trigger tipo pill: avatar 28px + nombre + chevron que rota 180° al abrir),
no como un drawer de panel completo. `ProfileDrawer.tsx` (y su test) se
**eliminaron** — `Header.tsx` ahora usa `UserMenu` directamente.

- **Contenido del panel** (230px, `rounded-xl`, `bg-surface-panel`,
  `ring-border-control`, sombra propia `shadow-menu-panel`): header con
  nombre+email, "Mi perfil" (link real vía `Link` de `@tanstack/react-router`
  — `profileHref` es una prop, el molecule no importa `navPaths` directo para
  no acoplar `shared/ui` al router de la app), "Preferencias", el **toggle de
  tema** (antes vivía en `SettingsDrawer`, ver abajo), separador, "Cerrar
  sesión" (rojo, mismo `danger-600`).
- **`SettingsDrawer` perdió su sección de Modo/tema** — ahora solo tiene el
  selector de idioma. El toggle de tema se movió a `UserMenu` (decisión
  explícita del usuario: el manual solo muestra tema adentro del menú, no
  idioma). El ícono de engranaje del header sigue abriendo `SettingsDrawer`
  tal cual (ahora solo-idioma); "Preferencias" en `UserMenu` abre lo mismo
  (dos entradas al mismo lugar, redundancia intencional y de bajo riesgo).
- **`useHeader.ts` perdió `isProfileOpen`/`toggleProfile`/`closeProfile`** —
  `UserMenu` maneja su propio estado abierto/cerrado internamente (mismo
  patrón que `ActionMenu`: portal + posición calculada + click-afuera/Escape/
  scroll/resize para cerrar), no hace falta que `Header` lo controle.
- **`Avatar` ganó el tamaño `xs` (28px = `size-7`)** — no existía un tamaño
  tan chico en la escala previa (`sm`=32/`md`=48/`lg`=64); es aditivo, no
  cambia ningún consumidor existente.
- **Sin "rol" bajo el nombre**: el mockup muestra "Administrador" como
  subtítulo, pero `AuthUser` no expone un campo de rol/grupo legible (solo
  `permissions: string[]`) — se omitió esa línea en vez de inventar un dato
  que no existe. Si se agrega un campo de rol al backend, agregarlo acá.
- **Tokens nuevos, mismo patrón de indirección que `--color-surface`**:
  `--shadow-trigger-active` (glow del trigger abierto, 0.14 de opacidad —
  **distinto** de `--shadow-focus-ring`, que es 0.18, no reusar uno por otro),
  `--shadow-menu-panel` (con `--menu-panel-shadow` por tema: 28px/0.12 en
  claro, 28px/0.35 en oscuro — valores propios, no coinciden con los del
  panel del Select). `bg-surface-panel`/`ring-border-control`/
  `bg-surface-hover-row` del Select se **reutilizan tal cual** para el panel
  y las filas del menú — coinciden exacto con la evidencia del manual.
- **`--color-danger-600` pasó a variar por tema** (antes era constante):
  el manual muestra "Cerrar sesión" en `#F19A9A` en dark, más claro que el
  `#D64545` de claro — mismo patrón que `--text-primary`/`--text-secondary`.
  `--color-danger-50`/`200` (fondo/borde del botón destructivo) siguen
  constantes — no hay evidencia de un valor de dark distinto para esos.

## Segunda alineación al Design System — barrido completo del sidebar

El usuario pidió re-verificar **absolutamente todo** contra un nuevo archivo
autoritativo ("First Design System (Standalone).html", un bundler JS que solo
se puede inspeccionar renderizado en un navegador real — no es HTML plano
grepeable), en el orden del sidebar del propio manual. Se recorrieron los ~30
átomos/moléculas/plantillas restantes (Acordeón, Adjuntar archivos, Avatar,
Cards, Chips ya cubiertos en una ronda previa; esta ronda cubrió desde List
hasta Librería de íconos). Extracción vía `getComputedStyle` en vivo
(`javascript_tool`), nunca `outerHTML` crudo (bloqueado por el filtro de
seguridad de la herramienta).

- **`ActionMenu`** (dropdown de "Menú de opciones"): mismo patrón que
  `UserMenu` — radio 12px (era 8px/`rounded-lg`), `bg-surface-panel`/
  `ring-border-control`/`shadow-menu-panel` (era `bg-surface`/`ring-border`/
  `shadow-lg` genérico), hover `bg-surface-hover-row` (era `surface-subtle`),
  ítem danger `text-danger-600`/`hover:bg-surface-hover-row` (era
  `text-red-500`/`hover:bg-red-500/10`).
- **`SectionDivider`**: `bg-border` → `bg-border-control` (el manual muestra
  el separador con el borde de **controles**, no el de card — distinto en
  oscuro: `#2A3650` vs `#232E45`).
- **`RichTextArea`** ("Textarea enriquecido"): radio 10px (`rounded-select`,
  era `rounded-lg`=8px — este control es más grande que un input plano, no
  comparte el radio de 8px de los controles normales); contenedor
  `bg-surface-input`/`border-control`/`hover:border-hover`/
  `focus-within:border-primary-600! focus-within:shadow-focus-ring` (mismo
  patrón que `TextArea`, antes tenía su propio `ring`/`border-red-400` ad
  hoc); toda divisoria de toolbar (`Divider`, barras de contexto de tabla/
  código/link, footer de conteo) pasó de `border-border` a `border-control`;
  todo `text-red-500` de error pasó a `text-danger-600`.
- **`Tooltip`**: el manual muestra el tooltip con superficie **invertida a
  propósito** — en tema claro es navy+texto blanco, en oscuro se invierte a
  niebla+texto navy (confirmado en el comparativo LIGHT/DARK: el bg oscuro
  del tooltip es literalmente el `--surface-subtle` del tema **claro**, y
  viceversa — busca máximo contraste contra el fondo de la app, no sigue
  `--surface`/`--foreground` directo). Tokens nuevos `--color-tooltip-bg`/
  `-text` con esa indirección invertida. Radio corregido a 6px (`rounded-md`,
  era `rounded-lg`=8px — no hay token con nombre para 6px, se usa el
  `rounded-md` de Tailwind tal cual). El variant `dark` ya no usa
  `bg-gray-950`/`text-slate-300` genéricos.
- **`Wizard`**: el paso **activo** (no solo el completado) va con círculo
  **relleno** `bg-primary-600`+número en blanco — antes mostraba solo un
  punto decorativo (`size-2.5 rounded-full`) sin el número. El paso
  **upcoming** tampoco renderizaba su número en absoluto (bug: el JSX no
  tenía ninguna rama para ese estado). Corregido: `active`/`upcoming` ahora
  renderizan `{i + 1}`. Conectores y borde del paso `upcoming` pasaron de
  `border-border`/`bg-border` a `border-control`/`bg-border-control`. Error
  de `red-500` a `danger-600`.
- **`Spinner`**: el variant `gradient` (usado en botones `secondary`/`ghost`/
  `destructive`, todos de fondo claro) tenía un degradado cian→índigo
  (`#17CADD`→`#332eb9ff`) totalmente ajeno a la marca — el manual muestra un
  arco **primary-600 sólido** sobre un track gris. Corregido `default`/
  `gradient` a `var(--color-primary-600)` en ambos "stops" (ya no es un
  degradado real, solo mantiene la estructura por si hiciera falta a
  futuro) y el track de `fill-slate-200 dark:fill-slate-700` a
  `fill-border-control`. El variant `white` (para el botón `primary`, ya
  relleno de azul) no se tocó — no tiene evidencia en el manual y necesita
  contraste blanco sobre fondo azul.
- **`Tabs`**: borde del contenedor a `border-control` (era `border-border`);
  se quitó el tinte `hover:bg-slate-50/60 dark:hover:bg-slate-800/20` — el
  manual muestra que el hover **solo** oscurece el texto a `text-foreground`,
  sin cambiar el fondo.
- **`Breadcrumbs`**: el ícono separador usaba `text-muted`; el manual lo
  muestra más apagado, `text-disabled`. El layout "vertical" que documenta
  el manual no tiene consumidor real, no se construyó.
- **`Toasts y notificaciones` (sonner)**: el bg/texto de cada severidad
  coincide **exacto** con los tokens de Chip ya existentes (verificado
  pixel a pixel: éxito `#E4F3EC`/`#1F7A54`, error `#FBE7E7`, warning
  `#FBEFDD`, info `#E8F0FF`, y sus pares oscuros). El borde (Chip no lleva
  borde, Toast sí) y la sombra son nuevos: `--color-toast-*-border` +
  `--shadow-toast` (`0 10px 24px rgba(11,18,32,0.1)` en claro, `none` en
  oscuro — el manual no muestra sombra sobre fondo oscuro). Se inyectan en
  `<Toaster toastOptions={{ style: toastStyle }}>` (`app/providers/index.tsx`)
  sobreescribiendo las variables CSS que sonner expone (`--success-bg`, etc.)
  — el `style` inline gana siempre por especificidad sobre las reglas
  `[data-sonner-toaster][data-sonner-theme=...]` de la librería, sin
  importar el orden de carga del CSS. También se sincronizó `theme={theme}`
  (antes fijo en claro, ignoraba el tema real de la app). Verificado en vivo
  contra un toast real disparado en la app — coincide exacto.
- **`Drawer`**: la sombra caía hacia abajo (`shadow-xl` genérico) en vez de
  hacia el costado del contenido — el manual muestra offset-x **negativo**
  para un drawer anclado a la derecha (la sombra "cuelga" hacia la
  izquierda, no hacia abajo). Nuevos tokens `--shadow-drawer-left`/`-right`
  (uno por `placement`). También se quitó el borde de canto
  (`border-l`/`border-r border-border`) — el manual no muestra ninguno,
  border-width 0 confirmado en la extracción; la sombra sola marca el borde.
- **`Modal`**: radio 12px (era `rounded-2xl`=16px); sombra dedicada
  `--shadow-modal` (`0 20px 50px rgba(0,0,0,0.35)`, **constante en ambos
  temas** — a diferencia de las demás sombras de este documento, esta no
  necesita indirección `:root`/`.dark` porque se proyecta sobre el backdrop
  oscuro semitransparente, que es casi negro en cualquier tema de la app).
- **`DataTable`**: quitado `shadow-sm` de la card mobile y del wrapper
  desktop (ninguna card del manual lleva sombra, mismo hallazgo que `Card`);
  `divide-slate-100 dark:divide-slate-700` (genérico) → `divide-border-control`;
  fila hover/seleccionada de `bg-surface-subtle` a `bg-surface-hover-row`
  (mismo criterio que `Select`/`ActionMenu` — fila interactiva, no bloque
  recessed estático).

**Gaps identificados — "componente nuevo", no construidos especulativamente**
(mismo criterio que Segmented Control en la fase 1; requieren una decisión de
alcance con el usuario antes de construirse):
- **Badge** (contador/punto/pill de notificación — solo existe `LangBadge`,
  mucho más específico).
- **Carrusel** — no existe ningún componente de carrusel.
- **Progress** (barra lineal y circular) — no existe.
- **Slider** — no existe, y no se usa en ningún dominio hoy.
- **Stepper numérico** (input de cantidad con botones −/+) — no existe;
  distinto del `Wizard` (que sí existe y es el stepper de *progreso*, ya
  alineado arriba).
- **Barra de búsqueda global** (trigger `⌘K` tipo command-palette) — no
  existe ninguna función de búsqueda global en la app; los buscadores por
  página ya usan `InputField` (ya alineado en fase 1).
- **Paginación numerada con elipsis** — el manual documenta un control de
  páginas (`1 2 3 … 8`); `DataTable` implementa en su lugar un patrón
  prev/next + "página / total" mucho más simple (`shared/ui/molecules/
  DataTable/DataTable.tsx`), ya con colores/tokens correctos pero de forma
  distinta. Reconstruir el control numerado es un cambio de lógica real
  (calcular qué páginas mostrar, elipsis), no solo de estilo — pendiente de
  decisión.

**Decisión explícita del usuario — Sidebar NO pasa a navy permanente**: el
sitio del Design System (y su diagrama de "Comportamiento del layout del
dashboard") usa un sidebar siempre oscuro (`#0B1220`) independiente del tema
claro/oscuro de la app. Se le preguntó al usuario si esto debía adoptarse en
el `Sidebar` real de First (cambio grande, afecta toda la app) — decidió
**dejarlo como está** (sigue el tema claro/oscuro normal, blanco en modo
claro). No re-litigar esto sin un pedido explícito nuevo.

## Mensajes de error transparentes (backend → usuario)

El usuario pidió que los mensajes de error dejen de ser genéricos/técnicos y
expliquen **por qué** falló una acción (ej. "no puedo subir una imagen, pero
no me dice el por qué"), usando la razón específica que el backend ya manda.
Esto tocó dos casos distintos — éxito-con-warnings y error real — con
mecanismos separados.

- **Caso "éxito con warnings"** (mutación 2xx pero algo no bloqueante falló,
  ej. el registro se guardó pero la imagen no se subió): el envelope
  `ApiResponse<T>` (`shared/api/types.ts`) trae `warnings?: ApiWarning[]`.
  Patrón establecido en `onSuccess`:
  ```ts
  onSuccess: (res) => {
    notify.success(t.toasts.updated)
    if (res?.warnings?.length) {
      notify.warning(res.warnings.map((w) => w.message).join(' '))
    }
    navigate(...)
  },
  onError: onQueuedOr(() => {
    if (avatar) notify.warning(t.toasts.offlinePhotoSkipped)
    navigate(...)
  }),
  ```
  Ya estaba en Users/Clients; se extendió a **Collaborators, Portfolio,
  Services, Pages** (`Create*Page.tsx`/`Edit*Page.tsx` de cada dominio) — cada
  uno con su propia condición según qué archivos maneja (`photo`, `cover ||
  galleryFiles?.length`, `cover || iconFile`, `cover || ogImage`). Requiere la
  key `offlinePhotoSkipped` en el `i18n/types.ts` + locales de cada dominio —
  **ojo con módulos con traducciones parciales**: Portfolio solo tiene
  `es/en/de` reales, el resto (`fr/pt/it/ja/ko/zh/ru`) son stubs de 5 líneas
  que re-exportan `en` (`export const fr = en`) — no tocar esos stubs, heredan
  la key automáticamente. Verificar con `wc -l` antes de asumir que un módulo
  tiene las 10 traducciones completas (Services y Pages sí las tienen).

- **Caso "error real"** (la mutación falla del todo, ej. 422 por archivo que
  excede el tamaño máximo): `notify.queryError` (`shared/lib/notify.ts`)
  tenía la prioridad **invertida** — `HTTP_MESSAGES[lang][status] ??
  error.message` mostraba siempre el mensaje genérico por código de estado
  (que existe para casi todo status real: 400/403/404/409/422/429/500/502/
  503), tapando casi por completo la razón específica del backend. Arreglado
  con un campo nuevo `HttpError.backendMessage` (`shared/api/api.services.ts`)
  — guarda el mensaje **crudo** que mandó el backend, `undefined` si no mandó
  nada — distinto de `.message`, que sigue sintetizando el fallback técnico
  `HTTP {status}: {statusText}` cuando no hay mensaje (se mantiene por
  compatibilidad/logging, pero ya no se usa para decidir qué mostrarle al
  usuario). `queryError` ahora prioriza `error.backendMessage ??
  HTTP_MESSAGES[lang][status] ?? error.message`.

## Gotcha real: límite de tamaño de imagen desalineado con Vercel (causaba 500 "fantasma" en mobile)

Reportado en producción: subir una foto de la galería del celular a un Service
daba **"Error interno del servidor"** (500 genérico, sin razón) — a pesar del
fix de transparencia de arriba. Investigado con `get_runtime_errors`/
`get_runtime_logs` (MCP de Vercel) sobre `first-backend`: el `PATCH
/api/v1/services/:id` fallaba con 500 pero **sin ningún stack trace en los
logs de la app** — señal de que la función ni siquiera llegó a ejecutar el
código de negocio.

Causa real: `CoverPicker`/`GalleryPicker` (`shared/ui/molecules`) validaban el
tamaño en el cliente contra un default de **5 MB** (`DEFAULT_MAX`/
`DEFAULT_MAX_BYTES`), pero el backend acepta como máximo **4 MB**
(`STORAGE_MAX_IMAGE_SIZE_BYTES`, ver `first-backend/CLAUDE.md`) — valor
elegido a propósito ahí para quedar bajo el límite duro de body de Vercel
(~4.5 MB). Ningún call-site real (`ServiceForm`, `PortfolioForm`, `PageForm`)
pasaba `maxBytes` explícito, así que los tres heredaban el 5 MB por defecto.
Una foto de celular entre 4 y 5 MB pasaba la validación del frontend como
"está bien" y luego el request moría en la capa de plataforma de Vercel
**antes** de llegar a Express/multer — por eso no hay stack trace: el backend
nunca corrió, y `parseErrorBody` no tiene JSON que leer, así que
`HttpError.backendMessage` queda `undefined` y `notify.queryError` cae
(correctamente) al mensaje genérico de 500 — el fix de arriba funcionó como
debía, el bug real estaba un nivel más abajo.

Arreglado con una constante única `MAX_IMAGE_UPLOAD_BYTES` (`shared/lib/
storageLimits.ts`, 4 MB, con comentario explicando el porqué) que ahora es el
default de `CoverPicker`, `GalleryPicker` **y** `PhotoPicker` (que ya usaba un
límite propio de 3 MB, más estricto y nunca causó este bug, pero quedaba
como un tercer número mágico independiente sin relación explícita con el
límite real del backend — unificado para que no vuelvan a desalinearse en
silencio). Si se agrega un picker de imagen nuevo, usar esta constante como
default en vez de inventar un número.

También la usa `MediaUploadModal` (Multimedia): a diferencia de los otros
tres, este NO validaba el tamaño en el cliente en absoluto — un archivo
grande se encolaba sin ningún aviso, y solo fallaba (o no) al intentar
subirlo de verdad. Ahora `addFiles` marca cada imagen que excede el límite
con un error visible de inmediato, y `handleUpload` la excluye del request
real (no tiene sentido intentar una subida que ya se sabe que va a fallar).

**Gotcha de proceso (ya resuelto, no repetir): un commit pusheado después de
mergear su PR nunca llega a `main`.** Este mismo fix de `MAX_IMAGE_UPLOAD_BYTES`
se implementó y se dio por deployado en una sesión anterior, pero el commit
(`f7fbb14`) se pusheó a la rama `fix/error-transparency-and-ui-cleanup`
**después** de que su PR #52 ya estuviera mergeado — quedó huérfano en la
rama (nunca en un PR, nunca en `main`) sin que nada lo señalara como error.
El bug de 5 MB siguió en producción varios días pese al reporte de "ya
arreglado". Encontrado por accidente al toparse con un `import` que
referenciaba un archivo (`storageLimits.ts`) que no existía en el working
tree de `main`. Recuperado con `git cherry-pick f7fbb14` sobre una rama
nueva. **Verificar siempre el estado del PR (`gh pr view <n> --json state`)
antes de pushear una nueva corrección a una rama ya usada** — si el PR ya
está `MERGED`, hace falta una rama y un PR nuevos, no otro push a la vieja.

## Barra de progreso al subir imágenes/videos (Multimedia)

`MediaUploadModal` (Multimedia) muestra un `ProgressBar` (`shared/ui/atoms`,
nuevo) por archivo mientras sube, con su porcentaje real — no una barra
indeterminada. `fetch()` no expone progreso de subida (solo de descarga), así
que las imágenes usan un `uploadWithProgress` nuevo (`shared/api`, basado en
`XMLHttpRequest` y su evento `xhr.upload.onprogress`) en vez del `request()`
compartido; el video ya subía directo a Vercel Blob (`directUploadVideo`), y
`@vercel/blob/client`'s `upload()` expone `onUploadProgress` nativo, así que
solo se reenvía en la misma forma `{loaded,total,percentage}`.

**Cada archivo va como su propia request** (`handleUpload` en
`MediaUploadModal.tsx` hace un `Promise.allSettled` de N uploads
independientes, uno por archivo) — antes las imágenes iban todas juntas en un
único `/storage/upload-bulk`. Se cambió al encontrar un bug real probando esta
misma feature: 3 imágenes de ~3.9MB cada una (bajo el límite individual de 4MB,
ver gotcha de arriba) combinadas en un solo request superaban el límite de
body de la plataforma de Vercel (~4.5MB) y fallaban con un "Error de red"
genérico, no con la razón específica del backend — el chequeo de
`MAX_IMAGE_UPLOAD_BYTES` en `addFiles` solo mira cada archivo por separado,
nunca la suma de los ya encolados. Verificado en vivo: el mismo lote de 3
archivos, subido con esta versión (una request por archivo), llega a la red
correctamente cada uno por su cuenta. Un archivo individual con contenido
sintético inválido (bytes de cabecera JPEG reales pero cuerpo basura) sí puede
seguir devolviendo un 500 genérico del backend (`INTERNAL_SERVER_ERROR`,
probablemente una excepción no capturada al decodificar la imagen) — eso es un
gap de robustez del *backend* frente a un body de imagen corrupto, no del
batching; no se tocó en esta sesión.

Como beneficio adicional de subir cada archivo por separado, cada imagen
ahora tiene su propio porcentaje (antes todas las imágenes de un lote
compartían un único valor de progreso, ya que iban en la misma request).

**Pendiente, no implementado**: `CoverPicker`/`GalleryPicker`/`PhotoPicker`
(Servicios/Portafolio/Páginas, etc.) no tienen barra de progreso — a
diferencia de Multimedia, esos no suben el archivo por su cuenta; viaja
junto con el JSON completo del formulario en el submit vía `request()`. Darles
progreso real necesitaría un cambio más grande (plomería de progreso en cada
función/hook de mutación de creación/edición de cada dominio, más pasar el
callback a cada picker) — evaluar si vale la pena antes de encararlo.

### Gotcha real: video sin validar tamaño en el cliente (subía por la red y fallaba con "Error de red" genérico)

Reportado por el usuario probando un video de ~443MB: la app mostraba
"Error de red. Verifica tu conexión e intenta nuevamente" — el mismo mensaje
genérico de conectividad, aunque el problema real era de tamaño, no de red.
Causa: `MediaUploadModal.addFiles` solo validaba tamaño de **imagen**
(`MAX_IMAGE_UPLOAD_BYTES`) — nunca de video. `@vercel/blob/client` tampoco
valida tamaño del lado del cliente por su cuenta: `directUpload.ts` (backend)
pasa `maximumSizeInBytes: ENV.STORAGE_MAX_VIDEO_SIZE_BYTES` (50MB por
default) a `handleUpload`, pero ese límite solo se aplica **del lado del
servidor** — el SDK client-side (`dist/client.js`, revisado directamente, sin
ningún chequeo de tamaño en su código) deja que la subida arranque igual.
Con un archivo de cientos de MB, Vercel corta la conexión al ver el
`Content-Length` declarado ya por encima del límite — desde la perspectiva
del navegador eso es indistinguible de un corte de red real, así que
`uploadWithProgress`/`directUploadVideo` terminan rechazando con un error que
`notify.errorMessage` no puede distinguir de una desconexión genuina (no es
una `HttpError`, cae al mensaje de red por defecto).

Arreglado agregando `MAX_VIDEO_UPLOAD_BYTES` (`shared/lib/storageLimits.ts`,
50MB, mismo patrón que `MAX_IMAGE_UPLOAD_BYTES`) y extendiendo el chequeo de
`addFiles` para rechazar un video sobredimensionado de inmediato, antes de
que la subida arranque — mismo principio que el chequeo de imagen: mejor
nunca intentar una subida que ya se sabe que va a fallar. Verificado en vivo:
un video sintético de 60MB se marca al instante con "Max 50 MB" sin ningún
intento de red; uno de 10MB se encola normalmente.

**Mismo gap, no tocado todavía**: el Page Builder (`VideoElementCard.tsx`,
`SliderElementCard.tsx`, `BackgroundVideoFields.tsx`, todos en
`domains/pages/components/builder`) también llama `directUploadVideo`
directo, sin ningún chequeo de tamaño de video propio — mismo riesgo, no
arreglado en esta sesión.

### Gotcha real: seleccionar un segundo archivo con "buscar archivos" no lo agregaba a la cola

Reportado por el usuario: adjuntaba un video y luego intentaba adjuntar
también una foto en la misma carga — la foto simplemente no se agregaba a la
cola. Reproducido de forma 100% consistente: en un `MediaUploadModal` recién
abierto, la **primera** selección de archivo vía "buscar archivos" (el
`<input type="file">` oculto) siempre funciona; **cualquier selección
posterior** reutilizando ese mismo nodo `<input>` no dispara `addFiles` en
absoluto, aunque el evento `change` nativo sí llega con el `FileList`
correcto (confirmado interceptándolo con un listener en fase de captura
antes de que React lo procese). Arrastrar-y-soltar un segundo archivo, en
cambio, **sí** funcionaba siempre — que fue la pista clave: descarta que
`addFiles`/`setQueue` estén rotos, y apunta puntualmente a reusar el mismo
nodo DOM del `<input>` entre selecciones.

El truco habitual para permitir re-seleccionar el **mismo** archivo dos
veces (`e.target.value = ''` tras leer `e.target.files`) no alcanza para
este caso — sea cual sea el mecanismo exacto (algo en cómo el navegador o
React determinan si un evento `change` posterior "ya se procesó" para ese
nodo), sigue fallando con archivos **distintos** en cada selección.
Arreglado con el patrón robusto conocido para este tipo de bug: un estado
`inputKey` que se incrementa en cada `onChange`, pasado como `key` del
`<input>` — fuerza a React a **desmontar y montar un nodo `<input>` nuevo**
después de cada selección, así que nunca hay un nodo reusado que pueda
arrastrar un estado interno del navegador de una selección a la siguiente.
Verificado en vivo con hasta 3 selecciones separadas seguidas (video, foto,
foto) — las 3 se agregan correctamente a la cola.

**Dropzone accesible**: el contenedor de arrastrar-y-soltar de este mismo
modal era un `<div role="button" tabIndex={0}>` con su propio `onKeyDown`
para Enter/Espacio — un linter de accesibilidad marcó el `role="button"`
sobre un elemento no interactivo. Cambiado a un `<button type="button">`
real (con `w-full` explícito, ya que un `<button>` no hereda el stretch
automático de un `<div>` dentro del `flex-col` padre) — el foco/teclado
(Enter y Espacio) y el estilo los da gratis el elemento nativo, así que se
retiraron `role`, `tabIndex` y el `onKeyDown` manual. Drag-and-drop y el
click para abrir el selector de archivos siguen funcionando igual sobre un
`<button>` (verificado en vivo).

## Header — ícono de configuración retirado

El engranaje de `Header.tsx` que abría `SettingsDrawer` se **eliminó** — era
una segunda entrada redundante a la misma acción que ya cubre "Preferencias"
dentro de `UserMenu` (`toggleSettings`). `useHeader()` conserva
`toggleSettings`/`closeSettings`/`isSettingsOpen` sin cambios, solo cambió
quién los dispara.

## Convención: `cursor-pointer` en todo elemento accionable

Todo elemento clickeable (botón, link, ítem de menú, fila de opción, tab,
casilla/switch/radio ya lo tenían) debe llevar `cursor-pointer` explícito en
su estado habilitado — no asumir que el navegador ya lo infiere. Excepción
real: **drag handles** (`SortableItemActions`, `SortableMediaTile`) usan
`cursor-grab`/`active:cursor-grabbing`, no `cursor-pointer` — es la
convención correcta para arrastre, no un olvido. Para detectar huecos:
```bash
for f in $(grep -rl "<button" src/shared/ui src/domains src/widgets src/app --include="*.tsx" | grep -v ".test.tsx\|.stories.tsx"); do
  grep -q "cursor-pointer\|cursor-grab" "$f" || echo "MISSING: $f"
done
```

## Convención: `ButtonGroup` — regla de responsividad para grupos de botones de acción

**Todo grupo de 2-3 botones de acción** (footer de modal/formulario, barra de
selección múltiple) debe envolverse en `ButtonGroup` (`shared/ui/atoms`), no
en un `<div className="flex ...">` a mano. La regla, pedida explícitamente
por el usuario tras notar footers de 2-3 botones colapsando mal en mobile:
**2 botones quedan uno al lado del otro incluso en mobile; 3 o más se apilan
verticales (ancho completo) en mobile y vuelven a fila desde `sm:`**.

- **Detección por CSS, no por prop**: `ButtonGroup` usa
  `has-[>:nth-child(3)]:flex-col` (cuenta hijos directos reales en el DOM) en
  vez de recibir un prop de cantidad — así, botones condicionales
  (`{cond && <Button/>}`, o botones envueltos en `<Can>`, que renderiza un
  Fragment sin nodo propio) cambian el layout automáticamente según cuántos
  terminan renderizándose de verdad, sin que el caller tenga que calcularlo.
  Verificado en vivo: un footer con `<Can>`-gated buttons pasa de 2→3 botones
  reales según los permisos del usuario, y `ButtonGroup` se adapta solo.
- **`sm:flex-row!` con `!important`** (mismo patrón que el gotcha de foco de
  `InputLayout` de la sección de Design System): a partir de `sm:`, la fila
  debe ganar sin importar cuántos hijos haya — `has-[...]` no está gateado
  por viewport, así que en desktop con 3 botones ambas condiciones
  (`has-[>:nth-child(3)]:flex-col` y `sm:flex-row`) aplican a la vez; sin
  `!`, cuál gana no está garantizado.
- **Adoptado en**: el footer de `Modal.tsx` (~40+ call sites heredan el
  comportamiento sin tocar nada), los 7 footers de formulario simple
  (Category/Collaborator/Subscriber/Tag/FormEditor/UserGroup Create+Edit,
  antes duplicaban el mismo `<div className="flex justify-end gap-3 ...">`
  a mano) y las 24 barras de selección múltiple (`FadeCollapse` + "N
  seleccionados" + botones, en todo `*Page.tsx`/`*TrashPage.tsx`).
- **`Wizard.tsx` no usa `ButtonGroup` directo** (su estructura ya separa
  Cancel de Back+Primary con `order-*`/`flex-col-reverse` propios para que
  el botón primario quede arriba al apilar) — pero ahora respeta la misma
  regla: el footer entero es `flex-row` (no `flex-col`) cuando `isFirst`
  (Cancelar + Siguiente/Guardar, 2 botones — antes se apilaba igual que el
  caso de 3), y sigue apilando cuando hay `Back` (Cancelar + Atrás +
  Siguiente/Guardar, 3 botones).
- **Gotcha real (ya resuelto, no reintroducir) — `Button` es `w-full` por
  default y eso rompe un `flex-wrap` con 2+ botones**: `Button.tsx` pone
  `w-full sm:w-fit` en su clase base (tap target ancho completo en mobile a
  propósito) — dentro de un contenedor `flex flex-wrap`, dos botones al
  100% de ancho **nunca** caben en la misma fila sin importar el viewport
  (cada uno pide `flex-basis:100%` vía su `width`), así que ambos quedan en
  su propia línea, uno debajo del otro. Esto es justo lo que le pasaba a
  `PageHeader.tsx` (título + acciones) — se asumió en la primera pasada que
  su `flex-wrap` existente ya era "responsive" y se dejó afuera, pero en la
  práctica dos botones con labels normales ("Ver papelera"/"Nuevo cliente")
  igual se apilaban en mobile; reportado en vivo por el usuario con
  captura. `ButtonGroup` corrige esto con `[&>*]:flex-1` en el caso de fila
  (2 botones) — `flex-basis` de `flex-1` gana sobre el `width:100%` de
  `Button` para el cálculo de tamaño del eje principal, así que los dos
  botones se reparten la fila 50/50 en vez de apilarse — y
  `has-[>:nth-child(3)]:[&>*]:flex-none` en el caso apilado (3 botones),
  donde se le devuelve el control del tamaño al `w-full`/`sm:w-fit` propio
  de `Button`. **`PageHeader.tsx` y el "floating title bar" de
  `PageContent.tsx`** (mini-header sticky que aparece al hacer scroll más
  allá del `<h1>`, con su propia fila de acciones) ahora usan `ButtonGroup`
  también — si se agrega un contenedor de botones nuevo sin pasar por
  `ButtonGroup`, verificar explícitamente que no repita este bug (un
  `flex-wrap` con botones no achicados **siempre** los apila, sea cual sea
  el ancho de pantalla — no es solo un problema de mobile).

## `<html lang>` sincronizado con el idioma activo

Reportado por el usuario: con el navegador (Chrome, celular) en español y
First también en español, igual aparecía el prompt de "¿Traducir esta
página?" — señal de que Chrome detectaba un idioma de contenido distinto al
real. Causa: `index.html` traía `<html lang="en">` fijo y **nada** en el
código actualizaba `document.documentElement.lang` — quedaba pegado a ese
valor estático para siempre sin importar el idioma real de la UI, así que
el heurístico de traducción de Chrome (que confía en `lang`) detectaba un
posible desajuste con el contenido real y ofrecía traducir una página que
ya estaba en el idioma correcto.

Arreglado en `shared/model/language.store.ts`, mismo patrón ya establecido
en `theme.store.ts` (`applyTheme`/`document.documentElement.classList`):
una función `applyLanguage(lang)` que hace
`document.documentElement.lang = lang`, invocada dentro de **las tres vías**
por las que el idioma activo cambia — `setLanguage` (selector explícito),
`hydrateLanguage` (sync por URL en `lang.route.ts::beforeLoad`, y
preferencia del backend en `preferencesHydrate.ts`) — y en
`onRehydrateStorage` (carga inicial de la página, cuando Zustand rehidrata
el idioma persistido de una sesión anterior desde `localStorage` antes de
cualquier interacción). `index.html` también se corrigió de `lang="en"` a
`lang="es"` (el default real de la app) para que el valor sea correcto
incluso en el instante antes de que React monte. Verificado en vivo
cambiando de idioma con el selector real y leyendo
`document.documentElement.lang` en consola — ambas direcciones (es→en,
en→es) sincronizan correctamente.

## Documentación relacionada
- `first-backend/CLAUDE.md` — convenciones del backend.
- `README.md` — qué es el proyecto y cómo levantarlo.
