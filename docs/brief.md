# Brief del proyecto: Web portfolio de Isabela Studio

## Contexto
Isabela Studio es la firma de moda de la diseñadora Teresita Ortiz. Hace prêt-à-porter y trajes de flamenca. Ella misma diseña, patrona y cose cada pieza, y su visión es construir una casa de moda española.

Objetivos de la web:
1. Enseñar su trabajo al mundo como una revista de moda de lujo.
2. Conseguir encargos de clientes particulares: ver el trabajo, enamorarse y contactar fácilmente por email o Instagram.

No es una tienda online. No debe parecer un e-commerce ni mostrar catálogos de producto.

## Stack
- Astro (última estable), salida estática, JS mínimo.
- Sanity como CMS headless. Teresita (no técnica) edita sola: campos con descripciones en español, previsualizaciones e iconos.
- Cloudflare Pages; webhook de Sanity → rebuild.
- TypeScript, CSS moderno (custom properties, container queries), sin frameworks CSS pesados.
- GSAP (ScrollTrigger) + Lenis + View Transitions.
- pnpm.

## Idiomas
ES (defecto) y EN, rutas `/es/...` y `/en/...` con i18n nativo de Astro. Selector discreto en cabecera. Textos del CMS con campos ES/EN; textos fijos en archivos de traducción. `hreflang` y sitemap por idioma.

## Páginas (fase 1, 5 de diciembre)
1. Inicio: vídeo a pantalla completa del proceso de confección (autoplay, muted, loop, playsinline, poster) con logo superpuesto. Debajo: colección destacada con gran titular editorial, selección de fotos en composición asimétrica tipo revista, bloque breve de filosofía y llamada a contactar.
2. Colecciones: índice con filtro por línea (Prêt-à-porter / Flamenca). Debe verse bien con una sola colección.
3. Detalle de colección: narrativa editorial (inspiración y concepto, moodboard, bocetos, patronaje y confección con fotos y vídeo, tejidos, lookbook final). Una historia, no una galería plana. Visor a pantalla completa con teclado y gestos.
4. Sobre mí: historia de Teresita, que diseña, patrona y cose; visión de casa de moda española.
5. A medida / Encargos: cómo funciona (contacto, primera cita, medidas, pruebas, entrega), apartado prêt-à-porter y apartado flamenca. Termina en llamada a contactar.
6. Prensa: medio (logo), titular, fecha, enlace o PDF. Si no hay entradas, se oculta del menú.
7. Contacto: email (mailto) e Instagram, elegante. Sin formulario.
8. Legales: aviso legal, privacidad, cookies.
9. 404 con el mismo estilo.

## Dirección visual
- Lujo editorial tipo revista. Referencias: acnestudios.com (sobriedad, espacio), jacquemus.com (vídeo, impacto), vídeo del proceso en paryescala.com (sin su parte comercial).
- Manda la fotografía. Mucho espacio en blanco, composiciones asimétricas, imágenes a sangre, tipografía editorial grande.
- Serif de display elegante + sans neutra, autoalojadas, `font-display: swap`. Paleta neutra: marfil/hueso, negro tinta, acento cálido. [PENDIENTE: ajustar con logo e Instagram.]
- Animaciones lentas y elegantes: aparición con máscara al hacer scroll, parallax sutil, titulares línea a línea, transiciones suaves. Respetar `prefers-reduced-motion`.
- Mobile first (la mayoría llega desde Instagram en el móvil).

## Rendimiento
- Lighthouse ≥ 95 en las cuatro categorías, también en móvil.
- Imágenes desde el CDN de Sanity en AVIF/WebP con srcset/sizes, LQIP con desenfoque, lazy salvo la principal.
- Vídeos comprimidos con poster, sin cargar hasta ser visibles; versión ligera en móvil.
- JS solo en las páginas que lo usen.

## Analítica y cookies
GA4 con Consent Mode v2. Banner RGPD/LSSI: aceptar, rechazar (igual de visible) y configurar. Nada de GA sin consentimiento. Estilo editorial, ES/EN.

## SEO y accesibilidad
Metadatos por página editables desde Sanity, Open Graph, Twitter cards, JSON-LD (Organization / Person / CreativeWork). HTML semántico, contraste, teclado, foco visible.

## Fase 2
Más colecciones, mejoras de animación en portada, extras.
