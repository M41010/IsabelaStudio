import { createClient, type QueryParams, type SanityClient } from '@sanity/client';

export const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID?.trim() || '';
export const dataset = import.meta.env.PUBLIC_SANITY_DATASET?.trim() || 'production';
export const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION?.trim() || '2026-11-01';

/** `false` mientras no exista un proyecto de Sanity: el sitio compila sin contenido. */
export const isSanityConfigured = projectId.length > 0;

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Sitio estático: en el build queremos siempre el contenido publicado más reciente.
      useCdn: false,
      perspective: 'published',
    })
  : null;

/**
 * Ejecuta una consulta GROQ. Devuelve `fallback` (por defecto `null`) si Sanity
 * no está configurado, para que el build funcione sin proyecto.
 *
 * @example const slugs = await fetchSanity<string[]>(collectionSlugsQuery, {}, []);
 */
export async function fetchSanity<T>(query: string, params: QueryParams, fallback: T): Promise<T>;
export async function fetchSanity<T>(query: string, params?: QueryParams): Promise<T | null>;
export async function fetchSanity<T>(query: string, params: QueryParams = {}, fallback?: T): Promise<T | null> {
  if (!sanityClient) return fallback ?? null;
  const result = await sanityClient.fetch<T>(query, params);
  return result ?? fallback ?? null;
}
