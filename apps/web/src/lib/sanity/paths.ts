import { fetchSanity } from './client';
import { collectionSlugsQuery } from './queries';

/** Rutas estáticas del detalle de colección (slug común a ES y EN). `[]` sin Sanity. */
export async function getCollectionStaticPaths() {
  const slugs = await fetchSanity<string[]>(collectionSlugsQuery, {}, []);
  return slugs.map((slug) => ({ params: { slug } }));
}
