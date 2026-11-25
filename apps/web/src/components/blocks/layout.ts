/**
 * Utilidades de maquetación compartidas por los bloques.
 *
 * La retícula de los bloques (ver `blocks.css`) es de 6 columnas en móvil y 12 a partir
 * de 48rem de ancho de contenedor. El contenedor de cada bloque ocupa todo el ancho de la
 * ventana, así que los anchos del contenedor coinciden con los de la ventana y se pueden
 * traducir a `sizes` con media queries.
 */
import type { SanityImage } from '../../lib/sanity/types';

/** Debe coincidir con `--container-max` (110rem) en tokens.css. */
const WRAP_MAX_REM = 110;
/** Gutter lateral máximo (2.5rem) × 2 en escritorio; 1rem × 2 en móvil. */
const GUTTERS_DESKTOP_REM = 5;
const GUTTERS_MOBILE_REM = 2;

const round = (n: number) => Math.round(n * 1000) / 1000;

/**
 * `sizes` para una imagen que ocupa `desktop` de 12 columnas (≥ 48rem) y `mobile` de 6.
 * Aproxima por exceso (ignora los huecos entre columnas): mejor un srcset algo mayor que borroso.
 */
export function gridSizes(desktop: number, mobile = 6): string {
  const d = round(desktop / 12);
  const m = round(mobile / 6);
  return [
    `(min-width: ${WRAP_MAX_REM + GUTTERS_DESKTOP_REM}rem) ${Math.ceil(d * WRAP_MAX_REM)}rem`,
    `(min-width: 48rem) calc(${d} * (100vw - ${GUTTERS_DESKTOP_REM}rem))`,
    `calc(${m} * (100vw - ${GUTTERS_MOBILE_REM}rem))`,
  ].join(', ');
}

/** Relación de aspecto natural (ancho/alto) de una imagen, con respaldo retrato. */
export function naturalRatio(image: SanityImage | null | undefined, fallback = 4 / 5): number {
  const dims = image?.asset?.metadata?.dimensions;
  if (!dims) return fallback;
  const c = image?.crop;
  const w = dims.width * (1 - (c?.left ?? 0) - (c?.right ?? 0));
  const h = dims.height * (1 - (c?.top ?? 0) - (c?.bottom ?? 0));
  return w > 0 && h > 0 ? w / h : fallback;
}

/** Limita la proporción natural a un rango; devuelve `undefined` si ya está dentro (sin recorte). */
export function clampRatio(image: SanityImage | null | undefined, min: number, max: number): number | undefined {
  const r = naturalRatio(image);
  if (r < min) return min;
  if (r > max) return max;
  return undefined;
}

export const hasImage = (image: SanityImage | null | undefined): image is SanityImage => !!image?.asset?.url;

/** Número de dos cifras para índices editoriales: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0');
