# Plan técnico acordado (2026-11-25)

## Decisiones
- Monorepo pnpm (pnpm 12): `apps/web` (Astro estático) y `apps/studio` (Sanity Studio alojado en `isabela.sanity.studio`).
- Rutas con segmentos traducidos; `pages/es/*` y `pages/en/*` son envoltorios finos sobre `src/views/*`. `/` → `/es/` vía `public/_redirects`.
  - ES: /es/, /es/colecciones/, /es/colecciones/[slug]/, /es/sobre-mi/, /es/a-medida/, /es/prensa/, /es/contacto/, /es/aviso-legal/, /es/privacidad/, /es/cookies/
  - EN: /en/, /en/collections/, /en/collections/[slug]/, /en/about/, /en/bespoke/, /en/press/, /en/contact/, /en/legal-notice/, /en/privacy/, /en/cookies/
  - 404.astro común.
- Slug de colección compartido entre idiomas.
- Localización por campo: `localeString`, `localeText`, `localeRichText` = `{ es, en }`. ES obligatorio, EN con aviso (warning) y respaldo a ES en el front.
- Vídeo: Mux (plugin `sanity-plugin-mux-input`), que transcodifica y adapta. Poster opcional en Sanity.
- View Transitions nativas por CSS, sin ClientRouter. GSAP + ScrollTrigger + Lenis en un único `scripts/motion.ts` cargado solo donde haga falta.
- Visor: PhotoSwipe v5 solo en el detalle de colección.
- Cookies: vanilla-cookieconsent v3 + GA4 con Consent Mode v2 (nada de GA sin consentimiento).
- Tipos: `sanity typegen`.
- Sin previsualización en directo (sitio estático): cambios visibles tras el rebuild por webhook.

## Esquemas Sanity
Objetos: `localeString`, `localeText`, `localeRichText`, `accessibleImage` (hotspot, alt {es,en}, caption {es,en} opcional), `seo` (title, description localizados, ogImage), `muxVideo` wrapper (vídeo Mux + poster + alt/descr).
Bloques (compartidos por `collection` y `page`): `textBlock`, `fullBleedImage`, `imagePair`, `sketchGrid`, `moodboard`, `videoBlock`, `pullQuote`, `lookbookGallery`, `chapterHeading`, `stepsBlock`, `ctaBlock`.
Documentos: `collection`, `pressItem`, `page` (ids fijos: about, bespoke, legal-notice, privacy, cookies), `siteSettings` (singleton), `homePage` (singleton: titular editorial, colección destacada, selección de fotos, filosofía, CTA).

## Orden
0 Monorepo + Astro + Studio · 1 Esquemas + UX Studio + seed · 2 Tokens/fuentes/layout/i18n/SanityImage · 3 Bloques + detalle colección + visor · 4 Inicio + colecciones · 5 Resto de páginas · 6 Motion · 7 SEO + cookies/GA4 · 8 Deploy + webhook · 9 Auditoría + README + guía Teresita
