import { getCollectionSlugs } from './api';

/** Rutas estáticas del detalle de colección (slug común a ES y EN). */
export async function getCollectionStaticPaths() {
  const slugs = await getCollectionSlugs();
  return slugs.map((slug) => ({ params: { slug } }));
}
