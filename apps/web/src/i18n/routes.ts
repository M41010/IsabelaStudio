/**
 * Mapa de rutas localizadas. Única fuente de verdad para los segmentos traducidos.
 * Los ficheros de `src/pages/{es,en}/` deben reflejar exactamente estas rutas.
 *
 * Los parámetros dinámicos se escriben como `[nombre]` (p. ej. `[slug]`).
 * Todas las rutas terminan en `/` (trailingSlash: 'always').
 */

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

/** Código BCP 47 para `hreflang` / `<html lang>`. */
export const localeLang: Record<Locale, string> = {
  es: 'es',
  en: 'en',
};

export const routes = {
  home: { es: '/es/', en: '/en/' },
  collections: { es: '/es/colecciones/', en: '/en/collections/' },
  collectionDetail: { es: '/es/colecciones/[slug]/', en: '/en/collections/[slug]/' },
  about: { es: '/es/sobre-mi/', en: '/en/about/' },
  bespoke: { es: '/es/a-medida/', en: '/en/bespoke/' },
  press: { es: '/es/prensa/', en: '/en/press/' },
  contact: { es: '/es/contacto/', en: '/en/contact/' },
  legalNotice: { es: '/es/aviso-legal/', en: '/en/legal-notice/' },
  privacy: { es: '/es/privacidad/', en: '/en/privacy/' },
  cookies: { es: '/es/cookies/', en: '/en/cookies/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Extrae los nombres de parámetro de un patrón: '/es/x/[slug]/' -> 'slug'. */
type ParamNames<P extends string> = P extends `${string}[${infer Name}]${infer Rest}`
  ? Name | ParamNames<Rest>
  : never;

/** Parámetros requeridos por una ruta (`never` si es estática). */
export type RouteParams<K extends RouteKey> = ParamNames<(typeof routes)[K]['es']>;

export type ParamsArg<K extends RouteKey> = [RouteParams<K>] extends [never]
  ? [params?: undefined]
  : [params: Record<RouteParams<K>, string>];

/** Sustituye `[param]` en un patrón. */
export function fillPattern(pattern: string, params: Record<string, string> = {}): string {
  return pattern.replace(/\[([^\]]+)\]/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`Falta el parámetro "${name}" para la ruta ${pattern}`);
    return encodeURIComponent(value);
  });
}

export interface RouteMatch {
  key: RouteKey;
  locale: Locale;
  params: Record<string, string>;
}

function patternToRegExp(pattern: string): { re: RegExp; names: string[] } {
  const names: string[] = [];
  const source = pattern
    .split(/(\[[^\]]+\])/)
    .map((part) => {
      const m = /^\[([^\]]+)\]$/.exec(part);
      if (m) {
        names.push(m[1]!);
        return '([^/]+)';
      }
      return part.replace(/[.*+?^${}()|\\]/g, '\\$&');
    })
    .join('');
  return { re: new RegExp(`^${source}$`), names };
}

const compiled = (Object.keys(routes) as RouteKey[]).flatMap((key) =>
  locales.map((locale) => ({ key, locale, ...patternToRegExp(routes[key][locale]) })),
);

/** Encuentra la ruta correspondiente a un pathname (con o sin barra final). */
export function matchRoute(pathname: string): RouteMatch | undefined {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  for (const { key, locale, re, names } of compiled) {
    const m = re.exec(path);
    if (m) {
      const params: Record<string, string> = {};
      names.forEach((name, i) => (params[name] = decodeURIComponent(m[i + 1]!)));
      return { key, locale, params };
    }
  }
  return undefined;
}
