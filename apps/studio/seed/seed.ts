/**
 * Contenido inicial de Isabela Studio.
 *
 *   pnpm --filter studio seed
 *
 * Necesita en `apps/studio/.env`: SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET
 * y SANITY_WRITE_TOKEN (token con rol Editor).
 *
 * Es idempotente: usa `_id` fijos con `createOrReplace`, y Sanity reutiliza los assets
 * con el mismo contenido (mismo hash), así que se puede ejecutar varias veces.
 * OJO: sobrescribe los documentos con esos `_id` (portada, ajustes, páginas fijas y la
 * colección de ejemplo). No lo ejecutes cuando Teresita ya haya editado contenido real.
 *
 * Los vídeos (Mux) quedan vacíos: subirlos requiere credenciales de Mux y se hace
 * desde el propio Studio. Los bloques de vídeo del seed mostrarán el aviso «Sube un vídeo».
 */
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient, type SanityClient} from '@sanity/client'
import {placeholderImage, placeholderLogo, type Ratio, type Tint} from './placeholders'
import {
  legalMarkupToPortableText,
  legalTexts,
  type LegalPageId,
} from '../../web/src/lib/sanity/legal-texts'

// --- Entorno ---------------------------------------------------------------

const here = path.dirname(fileURLToPath(import.meta.url))
try {
  process.loadEnvFile(path.join(here, '..', '.env'))
} catch {
  // Sin .env: se usan las variables del entorno.
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || projectId === 'placeholder' || !token) {
  console.error(
    'Faltan variables de entorno. Define SANITY_STUDIO_PROJECT_ID y SANITY_WRITE_TOKEN en apps/studio/.env (ver .env.example).',
  )
  process.exit(1)
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-11-01',
  useCdn: false,
})

// --- Utilidades ----------------------------------------------------------------

type L<T = string> = {es: T; en: T}

let keyCounter = 0
/** Claves deterministas: el mismo seed produce las mismas `_key`. */
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`

const ls = (es: string, en: string) => ({_type: 'localeString', es, en})
const lt = (es: string, en: string) => ({_type: 'localeText', es, en})

/** Párrafos → Portable Text. */
function blocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }))
}
const lrt = (es: string[], en: string[]) => ({_type: 'localeRichText', es: blocks(es), en: blocks(en)})

const assetCache = new Map<string, string>()

async function uploadImage(label: string, ratio: Ratio, tint: Tint): Promise<string> {
  const cacheKey = `${label}|${ratio}|${tint}`
  const cached = assetCache.get(cacheKey)
  if (cached) return cached
  const buffer = await placeholderImage(label, ratio, tint)
  const filename = `placeholder-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`
  const asset = await client.assets.upload('image', buffer, {filename})
  assetCache.set(cacheKey, asset._id)
  console.log(`  · imagen ${filename}`)
  return asset._id
}

type ImgSpec = {label: string; ratio: Ratio; tint: Tint; alt: L; caption?: L}

/** Imagen accesible (con alt bilingüe y pie opcional). */
async function img(spec: ImgSpec, withKey = false) {
  const assetId = await uploadImage(spec.label, spec.ratio, spec.tint)
  return {
    ...(withKey ? {_key: key()} : {}),
    _type: 'accessibleImage',
    asset: {_type: 'reference', _ref: assetId},
    alt: ls(spec.alt.es, spec.alt.en),
    ...(spec.caption ? {caption: ls(spec.caption.es, spec.caption.en)} : {}),
  }
}

async function imgs(specs: ImgSpec[]) {
  const out = []
  for (const spec of specs) out.push(await img(spec, true))
  return out
}

/** Imagen simple (sin alt), para logo, poster u ogImage. */
async function plainImage(label: string, ratio: Ratio, tint: Tint) {
  return {_type: 'image', asset: {_type: 'reference', _ref: await uploadImage(label, ratio, tint)}}
}

const cta = (title: L, text: L, channels: ('email' | 'instagram')[] = ['email', 'instagram']) => ({
  _type: 'ctaBlock',
  title: ls(title.es, title.en),
  text: lt(text.es, text.en),
  channels,
})

const seoObj = (title: L, description: L) => ({
  _type: 'seo',
  title: ls(title.es, title.en),
  description: lt(description.es, description.en),
})

// --- Colección de ejemplo ----------------------------------------------------------

const COLLECTION_ID = 'collection-azahar'

async function buildCollection() {
  console.log('Colección «Azahar»…')
  const cover = await img({
    label: 'Azahar · portada',
    ratio: 'portrait',
    tint: 'flamenca',
    alt: {
      es: 'Traje de flamenca rojo con volantes, fotografiado de cuerpo entero en un patio con naranjos.',
      en: 'Red flamenco dress with ruffles, full-length shot in a courtyard with orange trees.',
    },
  })

  const body = [
    {
      _key: key(),
      _type: 'chapterHeading',
      number: '01',
      title: ls('Inspiración', 'Inspiration'),
      intro: lt(
        'Sevilla en abril: el olor a azahar, la cal de los patios y el rojo de los claveles.',
        'Seville in April: the scent of orange blossom, whitewashed courtyards and the red of carnations.',
      ),
    },
    {
      _key: key(),
      _type: 'textBlock',
      eyebrow: ls('El origen', 'The origin'),
      width: 'offsetLeft',
      body: lrt(
        [
          'Azahar nace de los paseos de madrugada por el barrio de Santa Cruz, cuando las calles todavía huelen a flor de naranjo y la ciudad se prepara para la Feria.',
          'Quería un traje de flamenca que respirara: volantes ligeros, talle limpio y un rojo que no gritara, sino que susurrara.',
        ],
        [
          'Azahar was born from early-morning walks through the Santa Cruz quarter, when the streets still smell of orange blossom and the city gets ready for the April Fair.',
          'I wanted a flamenco dress that could breathe: light ruffles, a clean waist and a red that whispers rather than shouts.',
        ],
      ),
    },
    {
      _key: key(),
      _type: 'moodboard',
      title: ls('Moodboard', 'Moodboard'),
      images: await imgs([
        {label: 'Moodboard · azahar', ratio: 'square', tint: 'marfil', alt: {es: 'Ramillete de flor de azahar sobre lino blanco.', en: 'Orange blossom sprig on white linen.'}},
        {label: 'Moodboard · patio', ratio: 'tall', tint: 'albero', alt: {es: 'Patio sevillano encalado con macetas.', en: 'Whitewashed Sevillian courtyard with flower pots.'}},
        {label: 'Moodboard · clavel', ratio: 'portrait', tint: 'flamenca', alt: {es: 'Clavel rojo en primer plano.', en: 'Close-up of a red carnation.'}},
        {label: 'Moodboard · azulejo', ratio: 'square', tint: 'oliva', alt: {es: 'Detalle de azulejo antiguo en verde y ocre.', en: 'Detail of an antique green and ochre tile.'}},
        {label: 'Moodboard · albero', ratio: 'landscape', tint: 'terracota', alt: {es: 'Textura del albero de la Feria.', en: 'Texture of the fairground ochre sand.'}},
      ]),
    },
    {
      _key: key(),
      _type: 'chapterHeading',
      number: '02',
      title: ls('Del boceto al patrón', 'From sketch to pattern'),
    },
    {
      _key: key(),
      _type: 'sketchGrid',
      title: ls('Bocetos', 'Sketches'),
      images: await imgs([
        {label: 'Boceto 01', ratio: 'tall', tint: 'marfil', alt: {es: 'Boceto a lápiz del traje con volantes en cascada.', en: 'Pencil sketch of the dress with cascading ruffles.'}},
        {label: 'Boceto 02', ratio: 'tall', tint: 'hueso', alt: {es: 'Boceto del escote y las mangas.', en: 'Sketch of the neckline and sleeves.'}},
        {label: 'Boceto 03', ratio: 'square', tint: 'marfil', alt: {es: 'Estudio de color con acuarela roja.', en: 'Colour study in red watercolour.'}},
        {label: 'Patrón', ratio: 'landscape', tint: 'hueso', alt: {es: 'Patrón de papel del cuerpo del traje sobre la mesa de corte.', en: 'Paper pattern of the bodice on the cutting table.'}},
      ]),
    },
    {
      _key: key(),
      _type: 'stepsBlock',
      title: ls('Así se hace un traje Azahar', 'How an Azahar dress is made'),
      variant: 'flamenca',
      steps: [
        {_key: key(), _type: 'step', title: ls('Boceto', 'Sketch'), text: lt('Todo empieza en papel: silueta, volantes y caída.', 'It all starts on paper: silhouette, ruffles and drape.')},
        {_key: key(), _type: 'step', title: ls('Patrón', 'Pattern'), text: lt('Patronaje a mano, pieza a pieza, a la medida del cuerpo.', 'Hand-drafted patterns, piece by piece, fitted to the body.')},
        {_key: key(), _type: 'step', title: ls('Corte y confección', 'Cutting and sewing'), text: lt('Cada volante se corta al bies y se cose en el taller.', 'Each ruffle is cut on the bias and sewn in the studio.')},
      ],
    },
    {
      _key: key(),
      _type: 'chapterHeading',
      number: '03',
      title: ls('Confección', 'Making'),
    },
    {
      _key: key(),
      _type: 'imagePair',
      layout: 'leftTall',
      left: await img({
        label: 'Taller · costura',
        ratio: 'tall',
        tint: 'terracota',
        alt: {es: 'Manos cosiendo un volante rojo a máquina.', en: 'Hands machine-sewing a red ruffle.'},
        caption: {es: 'Cada volante se cose a mano en el taller.', en: 'Every ruffle is sewn by hand in the studio.'},
      }),
      right: await img({
        label: 'Taller · tejido',
        ratio: 'portrait',
        tint: 'flamenca',
        alt: {es: 'Detalle del crespón rojo con lunares bordados.', en: 'Detail of red crepe with embroidered polka dots.'},
      }),
    },
    {
      _key: key(),
      _type: 'videoBlock',
      size: 'full',
      // Sin `asset`: el vídeo de Mux se sube desde el Studio (necesita credenciales de Mux).
      video: {
        _type: 'video',
        poster: await plainImage('Vídeo · prueba', 'landscape', 'noche'),
        description: lt(
          'Teresita ajusta el talle del traje sobre el maniquí durante una prueba.',
          'Teresita adjusts the waist of the dress on the dress form during a fitting.',
        ),
      },
      caption: ls('Prueba de talle en el taller.', 'Waist fitting in the studio.'),
    },
    {
      _key: key(),
      _type: 'pullQuote',
      quote: lt(
        'Un traje de flamenca no se viste: se baila, se respira y se recuerda.',
        'A flamenco dress is not simply worn: it is danced, breathed and remembered.',
      ),
      author: 'Teresita Ortiz',
    },
    {
      _key: key(),
      _type: 'chapterHeading',
      number: '04',
      title: ls('El lookbook', 'The lookbook'),
    },
    {
      _key: key(),
      _type: 'fullBleedImage',
      parallax: true,
      image: await img({
        label: 'Azahar · a sangre',
        ratio: 'wide',
        tint: 'albero',
        alt: {
          es: 'Modelo con el traje Azahar girando en el albero, el volante en movimiento.',
          en: 'Model in the Azahar dress twirling on the fairground sand, ruffles in motion.',
        },
      }),
    },
    {
      _key: key(),
      _type: 'lookbookGallery',
      title: ls('Lookbook', 'Lookbook'),
      images: await imgs([
        {label: 'Look 01', ratio: 'portrait', tint: 'flamenca', alt: {es: 'Look 01: traje rojo de volantes con mantoncillo marfil.', en: 'Look 01: red ruffled dress with ivory shawl.'}},
        {label: 'Look 02', ratio: 'tall', tint: 'marfil', alt: {es: 'Look 02: traje marfil con lunares rojos.', en: 'Look 02: ivory dress with red polka dots.'}},
        {label: 'Look 03', ratio: 'portrait', tint: 'terracota', alt: {es: 'Look 03: traje teja con manga de capa.', en: 'Look 03: terracotta dress with cape sleeves.'}},
        {label: 'Look 04', ratio: 'landscape', tint: 'albero', alt: {es: 'Look 04: dos trajes de la colección en el patio.', en: 'Look 04: two dresses from the collection in the courtyard.'}},
        {label: 'Look 05', ratio: 'tall', tint: 'noche', alt: {es: 'Look 05: traje negro con flecos, de espaldas.', en: 'Look 05: black fringed dress, seen from behind.'}},
        {label: 'Look 06', ratio: 'portrait', tint: 'oliva', alt: {es: 'Look 06: traje verde oliva con volantes de canastero.', en: 'Look 06: olive dress with layered ruffles.'}},
      ]),
    },
    {
      _key: key(),
      ...cta(
        {es: '¿Te imaginas en un Azahar?', en: 'Can you see yourself in an Azahar?'},
        {
          es: 'Cada traje se hace a medida. Escríbeme y te propongo una primera cita en el taller.',
          en: 'Every dress is made to measure. Write to me and I will suggest a first appointment at the studio.',
        },
      ),
    },
  ]

  return {
    _id: COLLECTION_ID,
    _type: 'collection',
    title: ls('Azahar', 'Azahar'),
    slug: {_type: 'slug', current: 'azahar'},
    line: 'flamenca',
    season: 'Feria 2026',
    year: 2026,
    coverImage: cover,
    excerpt: lt(
      'Trajes de flamenca inspirados en la flor del naranjo y la luz de los patios sevillanos.',
      'Flamenco dresses inspired by orange blossom and the light of Sevillian courtyards.',
    ),
    featured: true,
    body,
    seo: seoObj(
      {es: 'Azahar · Colección de flamenca', en: 'Azahar · Flamenco collection'},
      {
        es: 'Azahar: trajes de flamenca diseñados, patronados y cosidos a mano por Isabela Studio.',
        en: 'Azahar: flamenco dresses designed, pattern-cut and hand-sewn by Isabela Studio.',
      },
    ),
  }
}

// --- Páginas -----------------------------------------------------------------------

async function buildAbout() {
  return {
    _id: 'about',
    _type: 'page',
    title: ls('Sobre mí', 'About'),
    intro: lt(
      'Soy Teresita Ortiz. Diseño, patrono y coso cada pieza de Isabela Studio.',
      'I am Teresita Ortiz. I design, pattern-cut and sew every piece of Isabela Studio.',
    ),
    body: [
      {
        _key: key(),
        _type: 'fullBleedImage',
        parallax: false,
        image: await img({
          label: 'Teresita · taller',
          ratio: 'wide',
          tint: 'hueso',
          alt: {es: 'Teresita trabajando en la mesa de corte del taller.', en: 'Teresita working at the cutting table in her studio.'},
        }),
      },
      {
        _key: key(),
        _type: 'textBlock',
        width: 'narrow',
        body: lrt(
          [
            'Aprendí a coser antes que a escribir, entre retales y alfileres. Hoy cada prenda de Isabela Studio pasa por mis manos de principio a fin: el boceto, el patrón, el corte y la última puntada.',
            'Trabajo dos líneas que dialogan entre sí: un prêt-à-porter sobrio y atemporal, y trajes de flamenca que miran a la tradición con ojos de hoy.',
          ],
          [
            'I learned to sew before I learned to write, among fabric scraps and pins. Today every Isabela Studio garment passes through my hands from start to finish: the sketch, the pattern, the cut and the last stitch.',
            'I work on two lines in dialogue with each other: a sober, timeless prêt-à-porter, and flamenco dresses that look at tradition through contemporary eyes.',
          ],
        ),
      },
      {
        _key: key(),
        _type: 'pullQuote',
        quote: lt(
          'Mi sueño es construir una casa de moda española, hecha a mano y sin prisas.',
          'My dream is to build a Spanish fashion house, handmade and unhurried.',
        ),
      },
      {
        _key: key(),
        _type: 'imagePair',
        layout: 'rightTall',
        left: await img({label: 'Taller · alfileres', ratio: 'square', tint: 'marfil', alt: {es: 'Acerico con alfileres y una cinta métrica.', en: 'Pincushion with pins and a tape measure.'}}),
        right: await img({label: 'Taller · maniquí', ratio: 'tall', tint: 'terracota', alt: {es: 'Maniquí con una prenda a medio confeccionar.', en: 'Dress form with a half-finished garment.'}}),
      },
      {
        _key: key(),
        ...cta(
          {es: 'Hablemos', en: "Let's talk"},
          {es: 'Si tienes una idea, me encantará escucharla.', en: 'If you have an idea, I would love to hear it.'},
        ),
      },
    ],
    seo: seoObj(
      {es: 'Sobre mí · Teresita Ortiz', en: 'About · Teresita Ortiz'},
      {
        es: 'Teresita Ortiz, diseñadora de Isabela Studio: prêt-à-porter y flamenca hechos a mano en España.',
        en: 'Teresita Ortiz, designer of Isabela Studio: handmade prêt-à-porter and flamenco fashion from Spain.',
      },
    ),
  }
}

function steps(items: [L, L][]) {
  return items.map(([title, text]) => ({
    _key: key(),
    _type: 'step',
    title: ls(title.es, title.en),
    text: lt(text.es, text.en),
  }))
}

async function buildBespoke() {
  return {
    _id: 'bespoke',
    _type: 'page',
    title: ls('A medida', 'Bespoke'),
    intro: lt(
      'Prendas únicas, hechas para ti de principio a fin.',
      'One-of-a-kind garments, made for you from start to finish.',
    ),
    body: [
      {
        _key: key(),
        _type: 'textBlock',
        width: 'narrow',
        body: lrt(
          ['Un encargo es una conversación. Me cuentas qué imaginas, para qué ocasión y cómo quieres sentirte; yo lo convierto en patrón, tela y costura.'],
          ['A commission is a conversation. You tell me what you imagine, for which occasion and how you want to feel; I turn it into pattern, fabric and seams.'],
        ),
      },
      {
        _key: key(),
        _type: 'stepsBlock',
        title: ls('Prêt-à-porter a medida', 'Made-to-measure prêt-à-porter'),
        variant: 'pret-a-porter',
        steps: steps([
          [{es: 'Contacto', en: 'Contact'}, {es: 'Escríbeme por email o Instagram contándome tu idea y la fecha que tienes en mente.', en: 'Write to me by email or Instagram with your idea and the date you have in mind.'}],
          [{es: 'Primera cita', en: 'First appointment'}, {es: 'Nos vemos en el taller para hablar de diseño, tejidos y presupuesto.', en: 'We meet at the studio to talk about design, fabrics and budget.'}],
          [{es: 'Medidas', en: 'Measurements'}, {es: 'Tomo tus medidas y preparo un patrón exclusivo para ti.', en: 'I take your measurements and draft a pattern exclusively for you.'}],
          [{es: 'Pruebas', en: 'Fittings'}, {es: 'Normalmente dos pruebas para ajustar cada detalle.', en: 'Usually two fittings to perfect every detail.'}],
          [{es: 'Entrega', en: 'Delivery'}, {es: 'Tu prenda, terminada a mano y lista para estrenar.', en: 'Your garment, hand-finished and ready to wear.'}],
        ]),
      },
      {
        _key: key(),
        _type: 'stepsBlock',
        title: ls('Trajes de flamenca', 'Flamenco dresses'),
        intro: lt(
          'Para llegar a la Feria con calma, te recomiendo empezar con al menos tres meses de antelación.',
          'To be ready for the Fair without rushing, I recommend starting at least three months ahead.',
        ),
        variant: 'flamenca',
        steps: steps([
          [{es: 'Contacto', en: 'Contact'}, {es: 'Cuéntame cómo te imaginas tu traje: color, volantes, manga…', en: 'Tell me how you imagine your dress: colour, ruffles, sleeves…'}],
          [{es: 'Primera cita', en: 'First appointment'}, {es: 'Elegimos juntas el diseño y los tejidos en el taller.', en: 'Together we choose the design and fabrics at the studio.'}],
          [{es: 'Medidas', en: 'Measurements'}, {es: 'Medidas completas para un talle perfecto.', en: 'Full measurements for a perfect fit.'}],
          [{es: 'Pruebas', en: 'Fittings'}, {es: 'Pruebas del cuerpo y de los volantes hasta que todo caiga como debe.', en: 'Fittings of the bodice and ruffles until everything falls just right.'}],
          [{es: 'Entrega', en: 'Delivery'}, {es: 'Tu traje, listo para bailar.', en: 'Your dress, ready to dance.'}],
        ]),
      },
      {
        _key: key(),
        ...cta(
          {es: '¿Empezamos?', en: 'Shall we begin?'},
          {
            es: 'Escríbeme y te respondo en menos de 48 horas para concertar la primera cita.',
            en: 'Write to me and I will reply within 48 hours to arrange the first appointment.',
          },
        ),
      },
    ],
    seo: seoObj(
      {es: 'A medida · Encargos', en: 'Bespoke · Commissions'},
      {
        es: 'Prêt-à-porter y trajes de flamenca a medida: así funciona un encargo en Isabela Studio.',
        en: 'Made-to-measure prêt-à-porter and flamenco dresses: how a commission works at Isabela Studio.',
      },
    ),
  }
}

/**
 * Páginas legales: BORRADORES (pendientes de revisión profesional) con marcadores
 * `[PENDIENTE: …]` para los datos del titular. El texto vive en la web
 * (`apps/web/src/lib/sanity/legal-texts.ts`) para que los fixtures y el seed sean idénticos;
 * se carga como un `textBlock` con subtítulos h2/h3, listas y enlaces editables en el Studio.
 */
const LEGAL_SEO: Record<LegalPageId, L> = {
  'legal-notice': {
    es: 'Aviso legal de Isabela Studio: datos del titular, condiciones de uso y propiedad intelectual.',
    en: 'Isabela Studio legal notice: owner details, terms of use and intellectual property.',
  },
  privacy: {
    es: 'Cómo trata Isabela Studio tus datos personales y cómo ejercer tus derechos.',
    en: 'How Isabela Studio processes your personal data and how to exercise your rights.',
  },
  cookies: {
    es: 'Qué cookies usa la web de Isabela Studio y cómo aceptarlas, rechazarlas o configurarlas.',
    en: 'Which cookies the Isabela Studio website uses and how to accept, reject or configure them.',
  },
}

function legalPage(id: LegalPageId) {
  const text = legalTexts[id]
  return {
    _id: id,
    _type: 'page',
    title: ls(text.title.es, text.title.en),
    body: [
      {
        _key: key(),
        _type: 'textBlock',
        width: 'narrow',
        body: {
          _type: 'localeRichText',
          es: legalMarkupToPortableText(text.es, key),
          en: legalMarkupToPortableText(text.en, key),
        },
      },
    ],
    seo: seoObj(text.title, LEGAL_SEO[id]),
  }
}

const legalPages = (['legal-notice', 'privacy', 'cookies'] as const).map(legalPage)

// --- Inicio y ajustes ---------------------------------------------------------------

async function buildHome() {
  return {
    _id: 'homePage',
    _type: 'homePage',
    headline: ls('Hecho a mano, pensado para durar', 'Handmade, made to last'),
    featuredCollection: {_type: 'reference', _ref: COLLECTION_ID},
    gallery: await imgs([
      {label: 'Inicio · look', ratio: 'tall', tint: 'flamenca', alt: {es: 'Traje de flamenca rojo de la colección Azahar.', en: 'Red flamenco dress from the Azahar collection.'}},
      {label: 'Inicio · detalle', ratio: 'square', tint: 'marfil', alt: {es: 'Detalle de un volante cosido a mano.', en: 'Detail of a hand-sewn ruffle.'}},
      {label: 'Inicio · taller', ratio: 'landscape', tint: 'hueso', alt: {es: 'Mesa de corte con patrones y tijeras.', en: 'Cutting table with patterns and scissors.'}},
      {label: 'Inicio · prêt', ratio: 'portrait', tint: 'noche', alt: {es: 'Conjunto de prêt-à-porter negro.', en: 'Black prêt-à-porter outfit.'}},
      {label: 'Inicio · tejido', ratio: 'square', tint: 'albero', alt: {es: 'Tejidos en tonos tierra.', en: 'Fabrics in earthy tones.'}},
    ]),
    philosophyTitle: ls('Una casa de moda española', 'A Spanish fashion house'),
    philosophy: lrt(
      [
        'Diseño, patrono y coso cada pieza en mi taller. Sin colecciones infinitas ni prisas: prendas pensadas para acompañarte muchos años, entre el prêt-à-porter y la tradición flamenca.',
      ],
      [
        'I design, pattern-cut and sew every piece in my studio. No endless collections, no rush: garments made to stay with you for years, between prêt-à-porter and the flamenco tradition.',
      ],
    ),
    cta: cta(
      {es: '¿Tienes una idea?', en: 'Have an idea in mind?'},
      {es: 'Cuéntamela y la hacemos realidad, a tu medida.', en: 'Tell me about it and we will make it real, made to measure.'},
    ),
    seo: seoObj(
      {es: 'Isabela Studio · Moda de autor hecha a mano', en: 'Isabela Studio · Handmade designer fashion'},
      {
        es: 'Prêt-à-porter y trajes de flamenca diseñados, patronados y cosidos a mano por Teresita Ortiz.',
        en: 'Prêt-à-porter and flamenco dresses designed, pattern-cut and hand-sewn by Teresita Ortiz.',
      },
    ),
  }
}

async function buildSettings() {
  const logoAsset = await client.assets.upload('image', await placeholderLogo(), {filename: 'placeholder-logo.png'})
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Isabela Studio',
    logo: {_type: 'image', asset: {_type: 'reference', _ref: logoAsset._id}},
    tagline: ls('Moda de autor hecha a mano en España', 'Handmade designer fashion from Spain'),
    // [PENDIENTE] Datos reales de contacto.
    contactEmail: 'hola@isabelastudio.com',
    instagramHandle: 'isabelastudio',
    instagramUrl: 'https://www.instagram.com/isabelastudio/',
    // heroVideo / heroVideoMobile: vacíos a propósito (se suben a Mux desde el Studio).
    defaultSeo: {
      ...seoObj(
        {es: 'Isabela Studio', en: 'Isabela Studio'},
        {
          es: 'Prêt-à-porter y trajes de flamenca hechos a mano por Teresita Ortiz.',
          en: 'Handmade prêt-à-porter and flamenco dresses by Teresita Ortiz.',
        },
      ),
      ogImage: await plainImage('Isabela Studio', 'og', 'marfil'),
    },
  }
}

// --- Ejecución -----------------------------------------------------------------

async function main() {
  console.log(`Seed → proyecto ${projectId}, dataset ${dataset}`)
  const docs: {_id: string; _type: string; [field: string]: unknown}[] = [
    await buildSettings(),
    await buildCollection(),
    await buildHome(),
    await buildAbout(),
    await buildBespoke(),
    ...legalPages,
  ]

  const tx = client.transaction()
  for (const doc of docs) tx.createOrReplace(doc)
  await tx.commit()
  console.log(`Listo: ${docs.length} documentos (${docs.map((d) => d._id).join(', ')}).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
