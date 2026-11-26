/**
 * Datos de prueba: se usan SOLO mientras no hay proyecto de Sanity configurado
 * (PUBLIC_SANITY_PROJECT_ID vacío). Reflejan la forma exacta de las consultas de `queries.ts`
 * para poder maquetar y probar el diseño antes de tener contenido real.
 * Imágenes generadas con `node scripts/make-fixtures.mjs`.
 */
import type { PortableTextBlock } from '@portabletext/types';
import manifest from './fixtures-manifest.json';
import { legalMarkupToPortableText, legalTexts, type LegalPageId } from './legal-texts';
import type {
  CollectionDetail,
  CtaBlock,
  HomePage,
  LocaleRichText,
  ModularBlock,
  PageDoc,
  PageId,
  PressItem,
  SanityImage,
  SiteSettings,
} from './types';

type FixtureName = keyof typeof manifest;

let keySeq = 0;
const key = () => `fx${(keySeq++).toString(36)}`;

function img(name: FixtureName, altEs: string, altEn: string, captionEs?: string, captionEn?: string): SanityImage {
  const m = manifest[name];
  return {
    _key: key(),
    asset: {
      _id: `fixture-${name}`,
      url: m.url,
      metadata: { lqip: m.lqip, dimensions: { width: m.width, height: m.height, aspectRatio: m.width / m.height } },
    },
    hotspot: null,
    crop: null,
    alt: { es: altEs, en: altEn },
    caption: captionEs ? { es: captionEs, en: captionEn ?? captionEs } : null,
  };
}

/** Portable Text mínimo a partir de párrafos. */
function pt(...paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }));
}
const rich = (es: string[], en: string[]): LocaleRichText => ({ es: pt(...es), en: pt(...en) });

const cta: CtaBlock = {
  _type: 'ctaBlock',
  _key: key(),
  title: { es: '¿Hablamos de tu pieza?', en: 'Shall we talk about your piece?' },
  text: {
    es: 'Cada encargo empieza con una conversación. Escríbeme y te cuento cómo trabajamos.',
    en: 'Every commission begins with a conversation. Write to me and I will tell you how we work.',
  },
  channels: ['email', 'instagram'],
};

const looks = (['look-01', 'look-02', 'look-03', 'look-04', 'look-05', 'look-06'] as const).map((n, i) =>
  img(n, `Look ${i + 1} de la colección Azahar`, `Look ${i + 1} from the Azahar collection`),
);

const azaharBody: ModularBlock[] = [
  {
    _type: 'chapterHeading',
    _key: key(),
    number: '01',
    title: { es: 'Inspiración', en: 'Inspiration' },
    intro: {
      es: 'Los patios de Sevilla en abril, cuando el azahar lo llena todo.',
      en: 'The courtyards of Seville in April, when orange blossom fills the air.',
    },
  },
  {
    _type: 'textBlock',
    _key: key(),
    eyebrow: { es: 'Concepto', en: 'Concept' },
    width: 'offsetLeft',
    body: rich(
      [
        'Azahar nace de la memoria: la cal de las paredes, la sombra de los naranjos y el sonido de los volantes al girar. Una colección que mira a la tradición sin miedo a depurarla.',
        'Cada traje se ha dibujado, patronado y cosido a mano en el taller, buscando el equilibrio entre la silueta clásica de flamenca y una línea contemporánea.',
      ],
      [
        'Azahar is born from memory: whitewashed walls, the shade of orange trees and the sound of ruffles turning. A collection that looks at tradition without fear of refining it.',
        'Every dress has been drawn, patterned and sewn by hand in the studio, seeking a balance between the classic flamenca silhouette and a contemporary line.',
      ],
    ),
  },
  {
    _type: 'moodboard',
    _key: key(),
    title: { es: 'Moodboard', en: 'Moodboard' },
    images: (['mood-01', 'mood-02', 'mood-03', 'mood-04', 'mood-05'] as const).map((n, i) =>
      img(n, `Referencia ${i + 1} del moodboard`, `Moodboard reference ${i + 1}`),
    ),
  },
  {
    _type: 'chapterHeading',
    _key: key(),
    number: '02',
    title: { es: 'Bocetos', en: 'Sketches' },
    intro: null,
  },
  {
    _type: 'sketchGrid',
    _key: key(),
    title: { es: 'Del papel al patrón', en: 'From paper to pattern' },
    images: (['sketch-01', 'sketch-02', 'sketch-03', 'sketch-04'] as const).map((n, i) =>
      img(n, `Boceto ${i + 1} a lápiz y acuarela`, `Sketch ${i + 1} in pencil and watercolour`),
    ),
  },
  {
    _type: 'chapterHeading',
    _key: key(),
    number: '03',
    title: { es: 'Patronaje y confección', en: 'Pattern-making and construction' },
    intro: {
      es: 'Ella misma patrona y cose cada pieza.',
      en: 'She patterns and sews every piece herself.',
    },
  },
  {
    _type: 'imagePair',
    _key: key(),
    layout: 'leftTall',
    left: img('patron-01', 'Patrones de papel sobre la mesa de corte', 'Paper patterns on the cutting table', 'Patrón base del cuerpo', 'Bodice base pattern'),
    right: img('patron-02', 'Manos cosiendo un volante', 'Hands sewing a ruffle', 'Volantes cosidos a mano', 'Hand-sewn ruffles'),
  },
  {
    _type: 'videoBlock',
    _key: key(),
    size: 'inset',
    caption: { es: 'El taller, durante la confección de Azahar.', en: 'The studio, while making Azahar.' },
    video: {
      playbackId: null,
      aspectRatio: '16:9',
      renditions: [],
      poster: img('hero-poster', 'Fotograma del taller', 'Still from the studio'),
      description: { es: 'Manos cortando y cosiendo tela en el taller.', en: 'Hands cutting and sewing fabric in the studio.' },
    },
  },
  {
    _type: 'pullQuote',
    _key: key(),
    quote: {
      es: 'Un traje de flamenca tiene que moverse como respira quien lo lleva.',
      en: 'A flamenca dress must move the way its wearer breathes.',
    },
    author: 'Teresita Ortiz',
  },
  {
    _type: 'chapterHeading',
    _key: key(),
    number: '04',
    title: { es: 'Tejidos', en: 'Fabrics' },
    intro: null,
  },
  {
    _type: 'fullBleedImage',
    _key: key(),
    parallax: true,
    image: img('wide-tejidos', 'Detalle de lunares y encaje', 'Detail of polka dots and lace', 'Lunares, encaje y crepé', 'Polka dots, lace and crepe'),
  },
  {
    _type: 'textBlock',
    _key: key(),
    eyebrow: null,
    width: 'twoColumns',
    body: rich(
      [
        'Crepé de seda, algodones con lunar pintado y encajes antiguos recuperados. Tejidos elegidos por cómo caen y cómo vuelan.',
        'La paleta parte del blanco cal y del naranja amargo, con acentos de verde hoja.',
      ],
      [
        'Silk crepe, hand-painted polka-dot cottons and recovered antique lace. Fabrics chosen for how they fall and how they fly.',
        'The palette starts from lime white and bitter orange, with accents of leaf green.',
      ],
    ),
  },
  {
    _type: 'chapterHeading',
    _key: key(),
    number: '05',
    title: { es: 'Lookbook', en: 'Lookbook' },
    intro: null,
  },
  {
    _type: 'lookbookGallery',
    _key: key(),
    title: { es: 'Azahar, el lookbook', en: 'Azahar, the lookbook' },
    images: looks,
  },
  cta,
];

const azahar: CollectionDetail = {
  _id: 'collection-azahar',
  slug: 'azahar',
  line: 'flamenca',
  title: { es: 'Azahar', en: 'Azahar' },
  season: 'Primavera 2027',
  year: 2027,
  featured: true,
  excerpt: {
    es: 'Trajes de flamenca inspirados en los patios sevillanos y el olor del azahar.',
    en: 'Flamenca dresses inspired by Sevillian courtyards and the scent of orange blossom.',
  },
  coverImage: img('cover-azahar', 'Traje de flamenca blanco con volantes, de espaldas', 'White flamenca dress with ruffles, seen from behind'),
  body: azaharBody,
  seo: null,
};

const lino: CollectionDetail = {
  _id: 'collection-lino',
  slug: 'lino',
  line: 'pret-a-porter',
  title: { es: 'Lino', en: 'Lino' },
  season: 'Verano 2026',
  year: 2026,
  featured: false,
  excerpt: {
    es: 'Prêt-à-porter en lino y algodón: siluetas limpias para el verano.',
    en: 'Ready-to-wear in linen and cotton: clean silhouettes for summer.',
  },
  coverImage: img('pret-cover', 'Conjunto de lino crudo', 'Raw linen outfit'),
  body: [
    {
      _type: 'textBlock',
      _key: key(),
      eyebrow: { es: 'Concepto', en: 'Concept' },
      width: 'narrow',
      body: rich(['Una colección breve en lino crudo.'], ['A short collection in raw linen.']),
    },
    { _type: 'lookbookGallery', _key: key(), title: null, images: looks.slice(0, 3) },
  ],
  seo: null,
};

export const fixtureCollections: CollectionDetail[] = [azahar, lino];

export const fixtureSiteSettings: SiteSettings = {
  siteName: 'Isabela Studio',
  logo: null,
  tagline: { es: 'Casa de moda española', en: 'Spanish fashion house' },
  contactEmail: 'hola@isabelastudio.com',
  instagramHandle: 'isabelastudio',
  instagramUrl: 'https://www.instagram.com/isabelastudio/',
  heroVideo: {
    playbackId: null,
    aspectRatio: '16:9',
    renditions: [],
    poster: img('hero-poster', 'Taller de confección de Isabela Studio', 'Isabela Studio atelier'),
    description: { es: 'Proceso de confección en el taller.', en: 'The making process in the studio.' },
  },
  heroVideoMobile: null,
  defaultSeo: {
    title: { es: 'Isabela Studio — Teresita Ortiz', en: 'Isabela Studio — Teresita Ortiz' },
    description: {
      es: 'Prêt-à-porter y trajes de flamenca diseñados, patronados y cosidos a mano por Teresita Ortiz.',
      en: 'Ready-to-wear and flamenca dresses designed, patterned and hand-sewn by Teresita Ortiz.',
    },
    ogImage: null,
  },
};

export const fixtureHomePage: HomePage = {
  headline: { es: 'Azahar, el sur hecho a mano', en: 'Azahar, the south made by hand' },
  featuredCollection: azahar,
  gallery: [
    img('home-01', 'Traje de flamenca en un patio', 'Flamenca dress in a courtyard'),
    img('home-02', 'Detalle de volantes', 'Detail of ruffles'),
    img('home-03', 'Modelo con mantón', 'Model wearing a shawl'),
    img('home-04', 'Detalle de encaje', 'Lace detail'),
  ],
  philosophyTitle: { es: 'Hecho a mano, de principio a fin', en: 'Handmade, from start to finish' },
  philosophy: rich(
    [
      'Diseño, patrono y coso cada pieza. Creo en la moda que se hace despacio, con oficio y con la ambición de construir una casa de moda española.',
    ],
    [
      'I design, pattern and sew every piece. I believe in fashion made slowly, with craft, and with the ambition of building a Spanish fashion house.',
    ],
  ),
  cta,
  seo: null,
};

const steps = (variant: 'pret-a-porter' | 'flamenca'): ModularBlock => ({
  _type: 'stepsBlock',
  _key: key(),
  variant,
  title: variant === 'flamenca' ? { es: 'Trajes de flamenca', en: 'Flamenca dresses' } : { es: 'Prêt-à-porter', en: 'Ready-to-wear' },
  intro: null,
  steps: [
    ['Contacto', 'Contact', 'Escríbeme por email o Instagram y cuéntame qué buscas.', 'Write to me by email or Instagram and tell me what you are looking for.'],
    ['Primera cita', 'First appointment', 'Nos vemos en el taller para hablar de ideas, tejidos y fechas.', 'We meet at the studio to talk about ideas, fabrics and dates.'],
    ['Toma de medidas', 'Measurements', 'Tomo tus medidas y creo un patrón solo para ti.', 'I take your measurements and create a pattern just for you.'],
    ['Pruebas', 'Fittings', 'Ajustamos la pieza en varias pruebas hasta que sea perfecta.', 'We adjust the piece over several fittings until it is perfect.'],
    ['Entrega', 'Delivery', 'Tu pieza, terminada a mano, lista para estrenar.', 'Your piece, hand-finished, ready to wear.'],
  ].map(([te, tn, xe, xn]) => ({ _key: key(), title: { es: te, en: tn }, text: { es: xe, en: xn } })),
});

/** Páginas legales: los borradores de `legal-texts.ts` (los mismos que carga el seed). */
const legal = (id: LegalPageId): PageDoc => {
  const text = legalTexts[id];
  return {
    _id: id,
    _updatedAt: '2026-11-26T09:00:00Z',
    title: text.title,
    intro: null,
    body: [
      {
        _type: 'textBlock',
        _key: key(),
        width: 'narrow',
        eyebrow: null,
        body: {
          es: legalMarkupToPortableText(text.es, key) as PortableTextBlock[],
          en: legalMarkupToPortableText(text.en, key) as PortableTextBlock[],
        },
      },
    ],
    seo: null,
  };
};

export const fixturePages: Record<PageId, PageDoc> = {
  about: {
    _id: 'about',
    title: { es: 'Sobre mí', en: 'About' },
    intro: {
      es: 'Soy Teresita Ortiz. Diseño, patrono y coso cada pieza de Isabela Studio.',
      en: 'I am Teresita Ortiz. I design, pattern and sew every Isabela Studio piece.',
    },
    body: [
      { _type: 'fullBleedImage', _key: key(), parallax: true, image: img('wide-taller', 'Teresita en su taller', 'Teresita in her studio') },
      {
        _type: 'textBlock',
        _key: key(),
        width: 'offsetRight',
        eyebrow: { es: 'Mi historia', en: 'My story' },
        body: rich(
          ['Aprendí a coser en casa, entre retales y patrones. Hoy mi taller es el lugar donde la tradición se encuentra con una mirada contemporánea.'],
          ['I learned to sew at home, among scraps and patterns. Today my studio is where tradition meets a contemporary eye.'],
        ),
      },
      {
        _type: 'pullQuote',
        _key: key(),
        quote: { es: 'Quiero construir una casa de moda española.', en: 'I want to build a Spanish fashion house.' },
        author: 'Teresita Ortiz',
      },
      cta,
    ],
    seo: null,
  },
  bespoke: {
    _id: 'bespoke',
    title: { es: 'A medida', en: 'Bespoke' },
    intro: {
      es: 'Piezas únicas hechas para ti, de la primera conversación a la última puntada.',
      en: 'One-of-a-kind pieces made for you, from the first conversation to the final stitch.',
    },
    body: [steps('pret-a-porter'), steps('flamenca'), cta],
    seo: null,
  },
  'legal-notice': legal('legal-notice'),
  privacy: legal('privacy'),
  cookies: legal('cookies'),
};

/** Logo de un medio: imagen simple, sin alt (la web pone el nombre del medio como texto). */
function outletLogo(name: FixtureName): SanityImage {
  const m = manifest[name];
  return {
    asset: {
      _id: `fixture-${name}`,
      url: m.url,
      metadata: { lqip: m.lqip, dimensions: { width: m.width, height: m.height, aspectRatio: m.width / m.height } },
    },
    hotspot: null,
    crop: null,
  };
}

/**
 * Apariciones en prensa de ejemplo (medios inventados), en el orden de la consulta:
 * las más recientes primero. Con entradas, «Prensa» aparece en el menú; para probar el
 * estado vacío (y el menú sin «Prensa»), deja este array vacío.
 */
export const fixturePressItems: PressItem[] = [
  {
    _id: 'press-volante',
    outlet: 'Revista Volante',
    headline: {
      es: 'Teresita Ortiz y el traje de flamenca que respira',
      en: 'Teresita Ortiz and the flamenca dress that breathes',
    },
    date: '2026-10-14',
    logo: outletLogo('press-logo-volante'),
    url: 'https://example.com/revista-volante/teresita-ortiz',
    pdfUrl: null,
  },
  {
    _id: 'press-diario-del-patio',
    outlet: 'Diario del Patio',
    headline: {
      es: 'Cinco diseñadoras que están cambiando la moda flamenca',
      en: 'Five designers who are changing flamenca fashion',
    },
    date: '2026-04-02',
    logo: null,
    url: null,
    pdfUrl: '/fixtures/prensa-diario-del-patio.pdf',
  },
  {
    _id: 'press-hilo-y-aguja',
    outlet: 'Hilo & Aguja',
    headline: {
      es: 'Entrevista: «Coser es la forma más lenta de pensar»',
      en: 'Interview: “Sewing is the slowest way of thinking”',
    },
    date: '2025-12-09',
    logo: null,
    url: 'https://example.com/hilo-y-aguja/entrevista-isabela-studio',
    pdfUrl: null,
  },
];
