# First Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack-Query%20%2B%20Router-FF4154?logo=reactquery&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline--first-5A0FC8?logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)
![Tests](https://img.shields.io/badge/tests-1111%2F1118%20passing-brightgreen)

</div>

Panel de administración de **First** — plataforma multipropósito CRM + CMS
(gestión de clientes/proyectos, un constructor visual de páginas, catálogo de
servicios/portafolio, y todo lo necesario para operar el sitio público).
SPA en **React 19 + TypeScript + Vite**, arquitectura **domain-sliced**,
consume la API de [`first-backend`](../first-backend).

**15** dominios de negocio · **10** idiomas · **54** componentes en
`shared/ui` (22 atoms + 32 molecules) · offline-first con cola de
mutaciones · code-splitting por ruta · **0 `any`** en todo el repo.

> **¿Nuevo en este repo?** Lee [`CLAUDE.md`](./CLAUDE.md) primero — documenta
> las convenciones (qué va en `shared/ui`/`shared/lib`, campos numéricos,
> nunca duplicar un componente reutilizable) que todo el código nuevo debe
> seguir. Este README describe *qué existe*; `CLAUDE.md` describe *cómo
> construir más de forma consistente*.

## Índice

- [Empezar](#empezar)
- [Variables de entorno](#variables-de-entorno)
- [Stack técnico](#stack-técnico)
- [Arquitectura](#arquitectura)
- [Dominios de negocio](#dominios-de-negocio)
- [Constructor de páginas](#constructor-de-páginas)
- [Librería de componentes (`shared/ui`)](#librería-de-componentes-sharedui)
- [Formularios (React Hook Form + Zod)](#formularios-react-hook-form--zod)
- [Internacionalización y ruteo](#internacionalización-y-ruteo)
- [Permisos (RBAC) en la UI](#permisos-rbac-en-la-ui)
- [Offline-first y PWA](#offline-first-y-pwa)
- [Rendimiento](#rendimiento)
- [Calidad — gates](#calidad--gates)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

## Empezar

```bash
# Instalar dependencias
pnpm install

# Desarrollo (hot reload)
pnpm dev

# Build de producción
pnpm build

# Previsualizar el build de producción localmente
pnpm preview
```

## Variables de entorno

Vite solo lee `.env` al arrancar — un cambio exige reiniciar `pnpm dev`.

| Variable | Notas |
|---|---|
| `VITE_API_BASE_URL` | Base de la API del backend, ej. `https://first-backend-navike21.vercel.app/api/v1` |
| `VITE_SOCKET_URL` | Base del servidor Socket.io (presencia) |
| `VITE_AUTH_PROVIDER` | `api` en producción; `fake` solo disponible en dev (`import.meta.env.DEV`) — nunca cae a `fake` en build de producción aunque falte la variable |
| `VITE_FAKE_USERNAME` / `VITE_FAKE_PASSWORD` | Solo usadas por el provider `fake` en desarrollo |
| `VITE_APP_VERSION` | Mostrada en la UI (footer/about) |

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | React 19 |
| Lenguaje | TypeScript 6 |
| Build | Vite 8 |
| Ruteo | TanStack Router — rutas con prefijo de idioma, lazy-loaded por página |
| Estado de servidor | TanStack Query — offline-first, persistido en IndexedDB |
| Estado de cliente | Zustand |
| Formularios | React Hook Form + Zod (`@hookform/resolvers`) |
| Estilos | Tailwind CSS 4 |
| Animación | `motion` (ex Framer Motion) |
| Editor de texto enriquecido | Tiptap (ProseMirror) |
| Drag & drop | `dnd-kit` |
| Offline / PWA | `vite-plugin-pwa` (service worker) + `localforage` (IndexedDB) |
| Realtime | `socket.io-client` — presencia de usuarios |
| Testing | Vitest + Testing Library + `jsdom` |
| Lint | ESLint 10 + `typescript-eslint` + `eslint-plugin-sonarjs` (config separada, on-demand) |

## Arquitectura

**Domain-Sliced** (migrado desde Feature-Sliced Design): se agrupa por
dominio de negocio, no por capa técnica.

```text
src/
├── app/          Inicialización: router, providers (TanStack Query + PWA
│                 persist), layouts, estilos globales
├── shared/       Código verdaderamente transversal (sin dominio)
│   ├── ui/        Librería de componentes (atoms/molecules/layouts) — ver abajo
│   ├── lib/       Funciones/hooks utilitarios puros (co-localizados con su .test.ts)
│   ├── api/       Cliente HTTP, cola offline, config compartida
│   ├── model/     Stores Zustand globales (sesión, idioma, red, presencia)
│   ├── router/    nav-paths, breadcrumbs, guards de permisos
│   └── i18n/      Helper createTranslations()
├── widgets/      Bloques de UI cross-dominio: Header, Sidebar, Footer
└── domains/      Un folder por dominio de negocio (ver tabla abajo)
```

Dentro de un dominio:

```text
domains/<nombre>/
├── pages/        Componentes de página + sus hooks (Page.tsx, Page.hooks.ts)
├── components/    Componentes reutilizables SOLO dentro de este dominio
├── api/          Llamadas HTTP + hooks de TanStack Query
├── model/        Schemas Zod, tipos, stores Zustand locales
├── i18n/         Traducciones completas del dominio (10 idiomas)
└── index.ts      API pública — el único punto de entrada externo al dominio
```

**Regla de dependencias** (de arriba hacia abajo): `app` puede importar de
cualquier capa; `widgets`/`domains` importan de `shared` libremente y de
otro dominio solo vía su `index.ts`; `shared` no importa de `domains` (con
una excepción documentada y tolerada: `PresenceStatus`, candidato a moverse
a `shared/types`).

## Dominios de negocio

| Dominio | Qué hace |
|---|---|
| `auth` | Login, sesión persistida, refresco silencioso de token |
| `dashboard` | Panel de inicio |
| `users` / `user-groups` | Gestión de usuarios y grupos de permisos (RBAC) |
| `clients` | CRM — gestión de clientes (privado) |
| `services` | Catálogo de servicios, multilingüe |
| `portfolio` | Casos de éxito, vincula clientes + servicios, testimonios, galería |
| `pages` | Páginas CMS con **constructor visual** (ver sección dedicada abajo) |
| `collaborators` | Perfiles públicos del equipo (distinto de `users`) |
| `subscribers` | Lista de newsletter |
| `forms` | Formularios públicos configurables por campos (contacto, cotización, postulación…) + bandeja de respuestas |
| `categories` / `tags` | Taxonomía compartida para contenido |
| `media` | Biblioteca de archivos (imágenes/video), subida directa a storage |
| `site-config` | Configuración global de presentación del sitio (header/footer/social/mapas) |
| `app-settings` | Configuración de organización (marca, notificaciones, apariencia) |
| `audit-log` | Visor del registro de auditoría (solo lectura) |
| `errors` | Páginas 403/404 |

Cada dominio con contenido traducible sigue el mismo patrón de idioma:
`LangSidebar` (formularios con varios campos traducibles) o `LangTabs`
(formularios de un solo campo) — ambos en `shared/ui`, nunca reimplementados
por dominio.

## Constructor de páginas

El dominio `pages` incluye un constructor visual de tres niveles —
**sección → columna → widget** — con drag-and-drop (`dnd-kit`) para
reordenar tanto columnas como widgets dentro de una columna.

<details>
<summary><strong>10 tipos de widget</strong></summary>

| Widget | Contenido |
|---|---|
| Texto | Rich text (Tiptap) — párrafos, listas, links, formato |
| Imagen | Imagen con ancho/alto/alineación configurable |
| Slider | Carrusel de imágenes/video, reordenable |
| Botón | CTA con variante (primary/secondary/outline), destino y alineación |
| Galería | Grilla de imágenes (1-4 columnas) con texto alternativo por idioma |
| Acordeón | Preguntas/respuestas (la respuesta es rich text) |
| Testimonios | Nombre + cargo + cita + foto + calificación (1-5) |
| Estadísticas | Valor ("500+", "98%") + etiqueta, en una fila |
| Video | URL embebida + leyenda |
| Mapa | Dirección + coordenadas (lat/lng vía `InputNumber`, nunca texto libre) + botón de cómo llegar |

</details>

Cada widget con imagen/video ofrece **biblioteca primero**: el picker
muestra `MediaLibraryModal` (archivos ya subidos) antes de pedir subir uno
nuevo. El editor de texto enriquecido nunca sube imágenes de inmediato —
usa preview en base64 hasta que el formulario se guarda de verdad.

El panel del constructor muestra el **progreso de traducción** por idioma
(% completado + semáforo) para saber de un vistazo qué falta traducir.

## Librería de componentes (`shared/ui`)

Barrel único (`shared/ui/index.ts`) — antes de escribir un componente nuevo,
revisar si ya existe aquí.

<details>
<summary><strong>Atoms (22)</strong></summary>

`AppLogo`, `Avatar`, `Button`, `Can` (gating por permisos), `Card`, `Chip`,
`DetailField`, `FadeCollapse`, `HelperText`, `IconButton`,
`IconComponent`, `Label`, `LangBadge`, `LinkButton`, `MediaThumbnail`,
`NavItem`, `RichTextArea`, `SectionDivider`, `SectionLabel`, `Skeleton`,
`Spinner`, `Switch`, `ThemeToggle`

</details>

<details>
<summary><strong>Molecules (32)</strong></summary>

`Accordion`, `ActionMenu`, `Breadcrumbs`, `Checkbox`, `CountryLabel`,
`CoverPicker`, `DataTable`, `Drawer`, `FeatureCard`, `FormGrid`,
`GalleryPicker`, `HexColorInput`, `InputDate`, `InputField`, `InputNumber`,
`LangSidebar`, `LangTabs`, `LanguageSwitcher`, `LocationSelect`,
`MediaGrid`, `MediaLibraryModal`, `Modal`, `NetworkStatusBanner`,
`PageHeader`, `PanelLayout`, `PhotoPicker`, `RadioOption`, `Select`,
`SortableItemActions`, `SortableMediaTile`, `Tabs`, `TextArea`, `Tooltip`,
`Wizard`

</details>

- **Todo campo numérico usa `InputNumber`** (`allowNegative`/`decimals`/
  `mask`) — nunca `InputField` con `inputMode` o saneo manual con regex.
- **Todo dato reutilizable entre 2+ dominios vive aquí** — no se duplica.
  Ejemplos reales: `LangSidebar`/`LangTabs` (selector de idioma, antes
  copiado en 6 formularios), `HexColorInput` (antes duplicado en
  Create/EditUserGroupForm), `SortableItemActions`/`SortableMediaTile`
  (filas/miniaturas arrastrables del constructor de páginas).
- Dentro de `shared/ui`, los componentes se importan entre sí por **ruta
  relativa** (`../../atoms/IconButton`), nunca vía el barrel — ese barrel es
  solo para consumidores fuera de `shared/ui`.

## Formularios (React Hook Form + Zod)

Patrón consistente en los 13 formularios de la app:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema) as Resolver<FormData>,
  mode: 'onTouched',
})
```

- **Wizard** (stepper) para formularios largos con muchos campos
  (clients, users, services, portfolio, pages). **Página única** para
  formularios cortos (subscribers, collaborators, tags, categories).
- Los errores de validación del servidor (422, `details.validation[]`) se
  mapean a `setError` de RHF por campo — nunca se muestran como un toast
  genérico si el backend indicó a qué campo pertenecen.
- Teléfonos = máscara numérica (`InputNumber` con `mask`); direcciones =
  `LocationSelect` (país → departamento → provincia → distrito) + calle.

## Internacionalización y ruteo

10 idiomas: `es` `en` `de` `fr` `it` `ja` `ko` `pt` `zh` `ru`. Cada ruta
lleva el idioma como prefijo (`/:lang/...`) y los *slugs* de cada segmento
están traducidos (`shared/router/route-slugs.ts`) — no es solo el prefijo,
la URL completa cambia de idioma.

Los textos de UI usan el helper `createTranslations()` por dominio; los
valores de catálogo (moneda, tipo de documento, industria, etc.) NO se
traducen a mano — se piden a la API de configuración del backend
(`useConfigData`, cache Zustand con TTL de 24h) y usan
`Intl.DisplayNames`/`labelFor()`.

## Permisos (RBAC) en la UI

Gateado en tres capas, todas alimentadas por el mismo mapa `CAN` — el
backend es la autoridad final, esto es solo UX (ocultar lo que no se puede
usar, no la única barrera de seguridad):

1. **Componente `<Can anyOf={...}>`** — oculta un botón/sección si el
   usuario no tiene el permiso.
2. **Guards de ruta** (`requirePermission`) — bloquean acceso directo por
   URL, no solo el ítem del menú.
3. **Filtro del menú lateral** — un grupo padre sin hijos visibles
   desaparece por completo, no queda un menú vacío.

## Offline-first y PWA

- **Datos**: TanStack Query persistido en IndexedDB (`localforage`) +
  **cola de mutaciones offline** — una mutación no-GET hecha sin conexión
  se encola y se reintenta sola al reconectar (`OfflineQueuedError`,
  detectado por el `MutationCache` para mostrar "guardado para sincronizar"
  en vez de un error).
- **App shell**: `vite-plugin-pwa` (service worker, `generateSW`) — la app
  carga sin red tras la primera visita.
- **Mobile-first**: Tailwind mobile-first en toda la app (nunca patrones
  desktop-first adaptados hacia abajo); `DataTable` colapsa a tarjetas en
  pantallas pequeñas.

## Rendimiento

- **Code-splitting por ruta**: cada página de dominio es su propio chunk
  (`lazyRouteComponent` de TanStack Router) — el bundle único de ~5MB se
  partió en chunks de 6-12KB por página + un chunk `shared/ui` común
  (~3.5MB, cacheado una sola vez tras la primera carga).
- Pendiente conocido: ese chunk común sigue siendo grande — el editor de
  texto enriquecido (Tiptap) es probablemente el mayor contribuyente;
  lazy-cargarlo específicamente sería el siguiente paso.

## Calidad — gates

Deben pasar los cinco antes de un PR:

```bash
pnpm typecheck    # tsc -b
pnpm lint         # ESLint + typescript-eslint + react-hooks — 0 warnings
pnpm lint:sonar   # SonarJS (config separada, on-demand) — 0 code smells
pnpm format       # Prettier — "src/**/*.{ts,tsx,css}"
pnpm test         # Vitest
```

- **`0 any`** en todo el repo (`@typescript-eslint/no-explicit-any: error`).
- Tipos de cada componente de `shared/ui` co-localizados en su propio
  `Componente.types.ts`, no inline ni en un archivo de tipos compartido.
- `pnpm audit` — **0 vulnerabilidades** (dependencias de producción y dev).

## Testing

```bash
pnpm vitest run
```

**1111 de 1118 tests pasan** (los 7 restantes son un mock preexistente de
`LanguageSwitcher` en `Header.test.tsx`/`SettingsDrawer.test.tsx`, no una
regresión — confirmado reproducible en `main` sin relación con cambios
recientes).

## Despliegue

Vercel. `main` → Producción; `feature/*` → Preview. `vite.config.ts` incluye
un proxy de `/api` hacia el mismo host de producción para desarrollo local
contra datos reales.

```bash
pnpm build
pnpm preview
```

## Licencia

Proyecto privado — sin licencia de código abierto.
