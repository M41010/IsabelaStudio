/**
 * Imagen ampliada para el visor a pantalla completa (PhotoSwipe).
 * Devuelve la URL más grande razonable del CDN (respetando el recorte de Sanity)
 * y sus dimensiones reales, que PhotoSwipe necesita para calcular el zoom.
 * Con datos de prueba (imágenes locales) usa el archivo local tal cual.
 */
import { urlFor } from './sanity/image';
import type { SanityImage } from './sanity/types';

/** Ancho máximo servido en el visor (el CDN no amplía: nunca más que el original). */
export const ZOOM_MAX_WIDTH = 2560;

export interface ZoomSource {
  src: string;
  width: number;
  height: number;
  srcset?: string;
}

export function zoomSource(image: SanityImage | null | undefined): ZoomSource | null {
  const asset = image?.asset;
  if (!asset?.url) return null;
  const dims = asset.metadata?.dimensions;

  if (asset.url.startsWith('/')) {
    return { src: asset.url, width: dims?.width ?? 1600, height: dims?.height ?? 2000 };
  }

  if (!dims) {
    // Sin metadatos (no debería ocurrir con `asset->`): proporción retrato por defecto.
    const src = urlFor(image as never).width(ZOOM_MAX_WIDTH).quality(85).url();
    return { src, width: ZOOM_MAX_WIDTH, height: Math.round(ZOOM_MAX_WIDTH * 1.25) };
  }

  // El builder aplica `crop` automáticamente: las dimensiones útiles son las del recorte.
  const c = image?.crop;
  const cropW = dims.width * (1 - (c?.left ?? 0) - (c?.right ?? 0));
  const cropH = dims.height * (1 - (c?.top ?? 0) - (c?.bottom ?? 0));
  const width = Math.round(Math.min(cropW, ZOOM_MAX_WIDTH));
  const height = Math.round((width * cropH) / cropW);

  const at = (w: number) => urlFor(image as never).width(w).quality(85).url();
  const widths = [1280, 1920].filter((w) => w < width).concat(width);

  return {
    src: at(width),
    width,
    height,
    srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
  };
}
