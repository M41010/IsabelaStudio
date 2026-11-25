# Isabela Studio — portfolio web

Monorepo pnpm: `apps/web` (Astro, salida estática → Cloudflare Pages) y `apps/studio` (Sanity Studio → isabela.sanity.studio).
Fase 1 con fecha de entrega 2026-12-05.

## Convenciones
- Idiomas: ES (por defecto) y EN. Rutas con prefijo `/es/` y `/en/` y segmentos traducidos (`/es/sobre-mi`, `/en/about`). Mapa de rutas en `apps/web/src/i18n/routes.ts`.
- Contenido del CMS localizado por campo: objetos `{ es, en }` (`localeString`, `localeText`, `localeRichText`). Si falta EN, se usa ES.
- Textos fijos de la interfaz en `apps/web/src/i18n/{es,en}.json`.
- Páginas: `pages/es/*` y `pages/en/*` son envoltorios finos; la lógica está en `src/views/`.
- CSS: custom properties en `src/styles/tokens.css`, mobile first, container queries, sin frameworks CSS.
- JS mínimo: cada script se carga solo en la página que lo usa. Todo el motion respeta `prefers-reduced-motion`.
- View Transitions nativas por CSS (`@view-transition`), sin `ClientRouter`.
- Imágenes siempre mediante el componente `SanityImage` (AVIF/WebP, srcset, LQIP). Vídeo en Mux (plugin de Sanity).
- Studio en español: cada campo con `description`, iconos y `preview`.
- Commits pequeños y descriptivos, en español.

## Comandos
- `pnpm install`
- `pnpm dev:web` / `pnpm dev:studio`
- `pnpm build:web`
