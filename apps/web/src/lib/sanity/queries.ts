/**
 * Consultas GROQ. Provisionales hasta tener los esquemas definitivos y `sanity typegen`.
 */

export type CollectionLine = 'pret-a-porter' | 'flamenca';

/** Slugs de todas las colecciones (el slug es común a ES y EN). */
export const collectionSlugsQuery = /* groq */ `
  *[_type == "collection" && defined(slug.current)].slug.current
`;

export interface CollectionSummary {
  _id: string;
  slug: string;
  line: CollectionLine;
  title: { es?: string; en?: string } | null;
}

/** Índice de colecciones (placeholder: se ampliará con portada, año, etc.). */
export const collectionsIndexQuery = /* groq */ `
  *[_type == "collection" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    "slug": slug.current,
    line,
    title
  }
`;

/** Detalle de una colección por slug (placeholder). */
export const collectionBySlugQuery = /* groq */ `
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    line,
    title
  }
`;

/** ¿Hay entradas de prensa? Decide si se muestra "Prensa" en el menú. */
export const hasPressQuery = /* groq */ `count(*[_type == "pressItem"]) > 0`;
