import es from './es.json';
import en from './en.json';
import {
  defaultLocale,
  fillPattern,
  localeLang,
  locales,
  routes,
  type Locale,
  type ParamsArg,
  type RouteKey,
} from './routes';

export { defaultLocale, localeLang, locales, matchRoute, routes } from './routes';
export type { Locale, RouteKey, RouteMatch } from './routes';

export type UiKey = keyof typeof es;

// `satisfies` obliga a que en.json tenga exactamente las mismas claves que es.json.
const ui = { es, en: en satisfies Record<UiKey, string> } as const;

/** Texto fijo de la interfaz. Si falta en EN, usa ES. */
export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key] ?? ui[defaultLocale][key];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Ruta relativa localizada, p. ej. localizedPath('about', 'en') -> '/en/about/'. */
export function localizedPath<K extends RouteKey>(key: K, locale: Locale, ...[params]: ParamsArg<K>): string {
  return fillPattern(routes[key][locale], params ?? {});
}

export interface AlternateUrl {
  locale: Locale;
  /** Código para hreflang / lang. */
  lang: string;
  path: string;
}

/** Versiones de una misma página en cada idioma (para hreflang y el selector de idioma). */
export function alternateUrls<K extends RouteKey>(key: K, ...args: ParamsArg<K>): AlternateUrl[] {
  return locales.map((locale) => ({
    locale,
    lang: localeLang[locale],
    path: localizedPath(key, locale, ...args),
  }));
}

/** Idioma a partir del primer segmento de la URL; ES si no se reconoce. */
export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const [, first] = pathname.split('/');
  return isLocale(first) ? first : defaultLocale;
}

/** Campo localizado del CMS (`{ es, en }`). Si falta el idioma pedido, usa ES. */
export type LocaleValue<T> = Partial<Record<Locale, T | null>> | null | undefined;

export function pickLocale<T>(field: LocaleValue<T>, locale: Locale): T | undefined {
  if (!field) return undefined;
  const value = field[locale];
  if (value !== undefined && value !== null && value !== '') return value;
  return field[defaultLocale] ?? undefined;
}
