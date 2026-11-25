import { createImageUrlBuilder, type ImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from './client';

// Sin projectId el builder no puede generar URLs; aun así se crea para que los
// tipos sean estables. Las imágenes solo existen cuando hay proyecto.
const builder = createImageUrlBuilder({ projectId: projectId || 'placeholder', dataset });

/** Builder base: formato automático (AVIF/WebP según el navegador). */
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source).auto('format');
}

/** Anchos por defecto para `srcset`, pensados para móvil primero y pantallas retina. */
export const DEFAULT_WIDTHS = [320, 480, 640, 800, 1024, 1280, 1600, 2000, 2560] as const;

export interface ResponsiveImageOptions {
  /** Anchos para el srcset. */
  widths?: readonly number[];
  /** Relación de aspecto (ancho / alto). Si se indica, se recorta respetando hotspot y crop. */
  aspectRatio?: number;
  quality?: number;
}

export interface ResponsiveImage {
  src: string;
  srcset: string;
  width: number;
  height?: number;
}

/**
 * `src` + `srcset` para una imagen de Sanity.
 * Si la fuente incluye `hotspot`/`crop` (pide `image { ..., asset-> }` o al menos
 * `hotspot` y `crop` en la consulta), el builder los aplica automáticamente:
 * `crop` recorta y `hotspot` decide el encuadre al forzar una relación de aspecto.
 */
export function responsiveImage(source: SanityImageSource, options: ResponsiveImageOptions = {}): ResponsiveImage {
  const { widths = DEFAULT_WIDTHS, aspectRatio, quality = 80 } = options;
  const sorted = [...widths].sort((a, b) => a - b);

  const at = (w: number) => {
    let b = urlFor(source).width(w).quality(quality);
    if (aspectRatio) b = b.height(Math.round(w / aspectRatio)).fit('crop');
    return b.url();
  };

  const fallbackWidth = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length / 2))] ?? 1024;

  return {
    src: at(fallbackWidth),
    srcset: sorted.map((w) => `${at(w)} ${w}w`).join(', '),
    width: fallbackWidth,
    height: aspectRatio ? Math.round(fallbackWidth / aspectRatio) : undefined,
  };
}
