/**
 * Capa de datos: las vistas llaman SOLO a estas funciones.
 * Con Sanity configurado consultan el CMS; sin proyecto devuelven los datos de prueba
 * de `fixtures.ts` para poder maquetar. Cada consulta se memoiza durante el build.
 */
import { fetchSanity, isSanityConfigured } from './client';
import {
  fixtureCollections,
  fixtureHomePage,
  fixturePages,
  fixturePressItems,
  fixtureSiteSettings,
} from './fixtures';
import {
  collectionBySlugQuery,
  collectionsIndexQuery,
  homePageQuery,
  pageByIdQuery,
  pressItemsQuery,
  siteSettingsQuery,
} from './queries';
import type { CollectionDetail, CollectionSummary, HomePage, PageDoc, PageId, PressItem, SiteSettings } from './types';

/** `true` cuando se están usando datos de prueba (sin proyecto de Sanity). */
export const usingFixtures = !isSanityConfigured;

const cache = new Map<string, Promise<unknown>>();
function memo<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, load());
  return cache.get(key) as Promise<T>;
}

export const getSiteSettings = () =>
  memo('settings', async () =>
    usingFixtures ? fixtureSiteSettings : ((await fetchSanity<SiteSettings>(siteSettingsQuery)) ?? {}),
  );

export const getHomePage = () =>
  memo('home', async () => (usingFixtures ? fixtureHomePage : ((await fetchSanity<HomePage>(homePageQuery)) ?? {})));

export const getCollections = () =>
  memo('collections', async (): Promise<CollectionSummary[]> =>
    usingFixtures ? fixtureCollections : await fetchSanity<CollectionSummary[]>(collectionsIndexQuery, {}, []),
  );

export const getCollection = (slug: string) =>
  memo(`collection:${slug}`, async () =>
    usingFixtures
      ? (fixtureCollections.find((c) => c.slug === slug) ?? null)
      : await fetchSanity<CollectionDetail>(collectionBySlugQuery, { slug }),
  );

export const getCollectionSlugs = async () => (await getCollections()).map((c) => c.slug);

export const getPage = (id: PageId) =>
  memo(`page:${id}`, async () => (usingFixtures ? fixturePages[id] : await fetchSanity<PageDoc>(pageByIdQuery, { id })));

export const getPressItems = () =>
  memo('press', async () =>
    usingFixtures ? fixturePressItems : await fetchSanity<PressItem[]>(pressItemsQuery, {}, []),
  );
