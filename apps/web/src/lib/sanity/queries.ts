/**
 * Consultas GROQ. Los tipos de lo que devuelven están en `types.ts`.
 * Las proyecciones expanden imágenes (dimensiones + LQIP) y vídeos de Mux para que
 * los componentes no tengan que hacer más consultas.
 */

/** Imagen con asset expandido. Uso: `image{${IMAGE}}`. */
export const IMAGE = /* groq */ `
  _key, hotspot, crop, alt, caption,
  asset->{ _id, url, metadata{ lqip, dimensions{ width, height, aspectRatio } } }
`;

/** Objeto `video` (Mux + poster). Uso: `video{${VIDEO}}`. */
export const VIDEO = /* groq */ `
  "playbackId": asset.asset->playbackId,
  "aspectRatio": asset.asset->data.aspect_ratio,
  "renditions": asset.asset->data.static_renditions.files[status == "ready"].name,
  poster{${IMAGE}},
  description
`;

const SEO = /* groq */ `seo{ title, description, ogImage{${IMAGE}} }`;

/** Cuerpo modular: expande las imágenes y vídeos de cada tipo de bloque. */
export const MODULAR_BODY = /* groq */ `
  body[]{
    ...,
    _type == "fullBleedImage" => { image{${IMAGE}} },
    _type == "imagePair" => { left{${IMAGE}}, right{${IMAGE}} },
    _type in ["sketchGrid", "moodboard", "lookbookGallery"] => { images[]{${IMAGE}} },
    _type == "videoBlock" => { video{${VIDEO}} }
  }
`;

const COLLECTION_SUMMARY = /* groq */ `
  _id,
  "slug": slug.current,
  line, title, season, year, excerpt, featured,
  coverImage{${IMAGE}}
`;

/** Slugs de todas las colecciones (el slug es común a ES y EN). */
export const collectionSlugsQuery = /* groq */ `
  *[_type == "collection" && defined(slug.current)].slug.current
`;

/** Índice de colecciones: primero las más recientes. */
export const collectionsIndexQuery = /* groq */ `
  *[_type == "collection" && defined(slug.current)] | order(year desc, _createdAt desc) {
    ${COLLECTION_SUMMARY}
  }
`;

/** Detalle de una colección por slug. */
export const collectionBySlugQuery = /* groq */ `
  *[_type == "collection" && slug.current == $slug][0] {
    ${COLLECTION_SUMMARY},
    ${MODULAR_BODY},
    ${SEO}
  }
`;

/** Página fija por id (about, bespoke, legal-notice, privacy, cookies). */
export const pageByIdQuery = /* groq */ `
  *[_type == "page" && _id == $id][0] {
    _id, _updatedAt, title, intro,
    ${MODULAR_BODY},
    ${SEO}
  }
`;

export const homePageQuery = /* groq */ `
  *[_type == "homePage"][0] {
    headline,
    featuredCollection->{ ${COLLECTION_SUMMARY} },
    gallery[]{${IMAGE}},
    philosophyTitle,
    philosophy,
    cta,
    ${SEO}
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0] {
    siteName, tagline, contactEmail, instagramHandle, instagramUrl,
    logo{${IMAGE}},
    heroVideo{${VIDEO}},
    heroVideoMobile{${VIDEO}},
    defaultSeo{ title, description, ogImage{${IMAGE}} }
  }
`;

export const pressItemsQuery = /* groq */ `
  *[_type == "pressItem"] | order(date desc) {
    _id, outlet, headline, date, url,
    "pdfUrl": pdf.asset->url,
    logo{${IMAGE}}
  }
`;

/** ¿Hay entradas de prensa? Decide si se muestra "Prensa" en el menú. */
export const hasPressQuery = /* groq */ `count(*[_type == "pressItem"]) > 0`;
