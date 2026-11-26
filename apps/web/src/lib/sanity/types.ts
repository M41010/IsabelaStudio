/**
 * Tipos de los datos que devuelven las consultas de `queries.ts` (ya proyectados).
 * Si cambias un esquema en `apps/studio/schemas` o una proyección GROQ, actualiza esto.
 */
import type { PortableTextBlock } from '@portabletext/types';

export type Locale = 'es' | 'en';
export type CollectionLine = 'pret-a-porter' | 'flamenca';

export interface LocaleString {
  es?: string | null;
  en?: string | null;
}
export type LocaleText = LocaleString;
export interface LocaleRichText {
  es?: PortableTextBlock[] | null;
  en?: PortableTextBlock[] | null;
}

/** Imagen con el asset expandido (`asset->`): dimensiones y LQIP para el placeholder. */
export interface SanityImage {
  _key?: string;
  asset: {
    _id: string;
    /** URL del original en el CDN de Sanity, o ruta local `/fixtures/...` en modo de datos de prueba. */
    url: string;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width: number; height: number; aspectRatio: number } | null;
    } | null;
  } | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  alt?: LocaleString | null;
  caption?: LocaleString | null;
}

/** Vídeo de Mux ya resuelto. Los MP4 estáticos se sirven desde `stream.mux.com/{playbackId}/{name}`. */
export interface SanityVideo {
  playbackId?: string | null;
  /** "16:9", "9:16"… según Mux. */
  aspectRatio?: string | null;
  /** Nombres de los MP4 estáticos listos, p. ej. ["1080p.mp4", "720p.mp4"]. */
  renditions?: string[] | null;
  poster?: SanityImage | null;
  description?: LocaleText | null;
}

export interface Seo {
  title?: LocaleString | null;
  description?: LocaleText | null;
  ogImage?: SanityImage | null;
}

// ---------- Bloques modulares ----------

interface BlockBase {
  _key: string;
}
export interface TextBlock extends BlockBase {
  _type: 'textBlock';
  eyebrow?: LocaleString | null;
  body?: LocaleRichText | null;
  width?: 'narrow' | 'offsetLeft' | 'offsetRight' | 'twoColumns' | null;
}
export interface FullBleedImageBlock extends BlockBase {
  _type: 'fullBleedImage';
  image?: SanityImage | null;
  parallax?: boolean | null;
}
export interface ImagePairBlock extends BlockBase {
  _type: 'imagePair';
  left?: SanityImage | null;
  right?: SanityImage | null;
  layout?: 'leftTall' | 'rightTall' | null;
}
export interface ImageSetBlock<T extends string> extends BlockBase {
  _type: T;
  title?: LocaleString | null;
  images?: SanityImage[] | null;
}
export type SketchGridBlock = ImageSetBlock<'sketchGrid'>;
export type MoodboardBlock = ImageSetBlock<'moodboard'>;
export type LookbookGalleryBlock = ImageSetBlock<'lookbookGallery'>;
export interface VideoBlock extends BlockBase {
  _type: 'videoBlock';
  video?: SanityVideo | null;
  /** Ver opciones en apps/studio/schemas/blocks/editorialBlocks.ts */
  size?: 'full' | 'inset' | null;
  caption?: LocaleString | null;
}
export interface PullQuoteBlock extends BlockBase {
  _type: 'pullQuote';
  quote?: LocaleText | null;
  author?: string | null;
}
export interface ChapterHeadingBlock extends BlockBase {
  _type: 'chapterHeading';
  number?: string | null;
  title?: LocaleString | null;
  intro?: LocaleText | null;
}
export interface StepsBlock extends BlockBase {
  _type: 'stepsBlock';
  title?: LocaleString | null;
  intro?: LocaleText | null;
  variant?: 'both' | 'pret-a-porter' | 'flamenca' | null;
  steps?: { _key: string; title?: LocaleString | null; text?: LocaleText | null }[] | null;
}
export interface CtaBlock extends Partial<BlockBase> {
  _type: 'ctaBlock';
  title?: LocaleString | null;
  text?: LocaleText | null;
  channels?: ('email' | 'instagram')[] | null;
}

export type ModularBlock =
  | TextBlock
  | FullBleedImageBlock
  | ImagePairBlock
  | SketchGridBlock
  | MoodboardBlock
  | LookbookGalleryBlock
  | VideoBlock
  | PullQuoteBlock
  | ChapterHeadingBlock
  | StepsBlock
  | CtaBlock;

// ---------- Documentos ----------

export interface CollectionSummary {
  _id: string;
  slug: string;
  line: CollectionLine;
  title: LocaleString;
  season?: string | null;
  year?: number | null;
  coverImage?: SanityImage | null;
  excerpt?: LocaleText | null;
  featured?: boolean | null;
}

export interface CollectionDetail extends CollectionSummary {
  body?: ModularBlock[] | null;
  seo?: Seo | null;
}

export interface PageDoc {
  _id: string;
  /** Última edición (ISO). Las páginas legales la muestran como «Última actualización». */
  _updatedAt?: string | null;
  title: LocaleString;
  intro?: LocaleText | null;
  body?: ModularBlock[] | null;
  seo?: Seo | null;
}

export interface HomePage {
  headline?: LocaleString | null;
  featuredCollection?: CollectionSummary | null;
  gallery?: SanityImage[] | null;
  philosophyTitle?: LocaleString | null;
  philosophy?: LocaleRichText | null;
  cta?: CtaBlock | null;
  seo?: Seo | null;
}

export interface SiteSettings {
  siteName?: string | null;
  logo?: SanityImage | null;
  tagline?: LocaleString | null;
  contactEmail?: string | null;
  instagramHandle?: string | null;
  instagramUrl?: string | null;
  heroVideo?: SanityVideo | null;
  heroVideoMobile?: SanityVideo | null;
  defaultSeo?: Seo | null;
}

export interface PressItem {
  _id: string;
  outlet: string;
  headline?: LocaleString | null;
  date?: string | null;
  logo?: SanityImage | null;
  url?: string | null;
  pdfUrl?: string | null;
}

export type PageId = 'about' | 'bespoke' | 'legal-notice' | 'privacy' | 'cookies';
