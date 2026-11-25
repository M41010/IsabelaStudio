// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, fillPattern, localeLang, locales, matchRoute, routes } from './src/i18n/routes.ts';

// En Cloudflare Pages se define PUBLIC_SITE_URL en las variables de entorno del proyecto.
const site = process.env.PUBLIC_SITE_URL || 'https://isabela-studio.pages.dev';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },

  i18n: {
    defaultLocale,
    locales: [...locales],
    routing: {
      // Todas las URLs bajo /es/ o /en/.
      prefixDefaultLocale: true,
      // La raíz `/` la redirige Cloudflare (public/_redirects), no Astro.
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale,
        locales: Object.fromEntries(locales.map((l) => [l, localeLang[l]])),
      },
      // Los segmentos están traducidos (/es/sobre-mi/ ↔ /en/about/), así que el
      // emparejamiento automático por ruta idéntica no basta: calculamos las
      // alternativas hreflang a partir del mapa de rutas.
      serialize(item) {
        const match = matchRoute(new URL(item.url).pathname);
        if (!match) return item;
        const pattern = routes[match.key];
        const links = locales.map((l) => ({
          lang: localeLang[l],
          url: new URL(fillPattern(pattern[l], match.params), site).href,
        }));
        links.push({
          lang: 'x-default',
          url: new URL(fillPattern(pattern[defaultLocale], match.params), site).href,
        });
        return { ...item, links };
      },
    }),
  ],
});
