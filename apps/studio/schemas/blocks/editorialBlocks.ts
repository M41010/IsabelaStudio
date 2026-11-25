import {BlockquoteIcon} from '@sanity/icons/Blockquote'
import {BookmarkIcon} from '@sanity/icons/Bookmark'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {OlistIcon} from '@sanity/icons/Olist'
import {PlayIcon} from '@sanity/icons/Play'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {es, optionalLocale, requiredLocale} from '../lib/localized'

export const videoBlock = defineType({
  name: 'videoBlock',
  title: 'Vídeo',
  type: 'object',
  icon: PlayIcon,
  description: 'Un vídeo del proceso (patronaje, confección, pruebas…). Se reproduce solo, en silencio y en bucle.',
  fields: [
    defineField({
      name: 'video',
      title: 'Vídeo',
      type: 'video',
      validation: (rule) => rule.required().error('Añade un vídeo.'),
    }),
    defineField({
      name: 'size',
      title: 'Tamaño',
      type: 'string',
      description: 'A pantalla completa para vídeos horizontales de impacto; encajado para vídeos verticales o de detalle.',
      options: {
        list: [
          {title: 'A pantalla completa', value: 'full'},
          {title: 'Encajado en la página', value: 'inset'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'caption',
      title: 'Pie de vídeo (opcional)',
      type: 'localeString',
      description: 'Texto pequeño bajo el vídeo. Ej.: «Corte del patrón en el taller».',
      validation: optionalLocale({label: 'el pie de vídeo'}),
    }),
  ],
  preview: {
    select: {caption: 'caption', description: 'video.description', poster: 'video.poster', size: 'size'},
    prepare({caption, description, poster, size}) {
      return {
        title: es(caption) ?? es(description) ?? 'Vídeo',
        subtitle: `Vídeo · ${size === 'inset' ? 'encajado' : 'a pantalla completa'}`,
        media: poster ?? PlayIcon,
      }
    },
  },
})

export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Cita destacada',
  type: 'object',
  icon: BlockquoteIcon,
  description: 'Una frase en letra muy grande, para hacer una pausa en la lectura.',
  fields: [
    defineField({
      name: 'quote',
      title: 'Cita',
      type: 'localeText',
      description: 'Mejor corta: una o dos frases. Sin comillas, la web las pone sola.',
      validation: requiredLocale({label: 'la cita'}),
    }),
    defineField({
      name: 'author',
      title: 'Autor (opcional)',
      type: 'string',
      description: 'Quién lo dice. Ej.: «Teresita Ortiz». Déjalo vacío si es tu propia voz en la historia.',
    }),
  ],
  preview: {
    select: {quote: 'quote', author: 'author'},
    prepare({quote, author}) {
      return {
        title: es(quote) ? `«${es(quote)}»` : 'Cita vacía',
        subtitle: ['Cita destacada', author].filter(Boolean).join(' · '),
        media: BlockquoteIcon,
      }
    },
  },
})

export const chapterHeading = defineType({
  name: 'chapterHeading',
  title: 'Capítulo',
  type: 'object',
  icon: BookmarkIcon,
  description:
    'Abre un nuevo capítulo de la historia con un número grande y un título (por ejemplo «01 — Inspiración»). Ayuda a leer la colección como una revista.',
  fields: [
    defineField({
      name: 'number',
      title: 'Número',
      type: 'string',
      description: 'Dos cifras: 01, 02, 03…',
      validation: (rule) => [
        rule.required().error('Escribe el número del capítulo.'),
        rule.regex(/^\d{1,2}$/, {name: 'número'}).warning('Usa solo cifras, por ejemplo 01.'),
      ],
    }),
    defineField({
      name: 'title',
      title: 'Título del capítulo',
      type: 'localeString',
      description: 'Una o pocas palabras. Ej.: «Inspiración», «Patronaje», «El lookbook».',
      validation: requiredLocale({label: 'el título del capítulo'}),
    }),
    defineField({
      name: 'intro',
      title: 'Entradilla (opcional)',
      type: 'localeText',
      description: 'Una o dos frases que presentan el capítulo.',
      validation: optionalLocale({label: 'la entradilla'}),
    }),
  ],
  preview: {
    select: {number: 'number', title: 'title'},
    prepare({number, title}) {
      return {
        title: [number, es(title)].filter(Boolean).join(' — ') || 'Capítulo',
        subtitle: 'Capítulo',
        media: BookmarkIcon,
      }
    },
  },
})

const STEP_VARIANTS = [
  {title: 'Ambas líneas', value: 'both'},
  {title: 'Prêt-à-porter', value: 'pret-a-porter'},
  {title: 'Flamenca', value: 'flamenca'},
]

export const stepsBlock = defineType({
  name: 'stepsBlock',
  title: 'Pasos',
  type: 'object',
  icon: OlistIcon,
  description:
    'Lista de pasos numerados. Se usa en «A medida» para explicar el proceso: contacto, primera cita, medidas, pruebas y entrega.',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
      description: 'Ej.: «Cómo funciona un encargo de flamenca».',
      validation: requiredLocale({label: 'el título'}),
    }),
    defineField({
      name: 'intro',
      title: 'Entradilla (opcional)',
      type: 'localeText',
      validation: optionalLocale({label: 'la entradilla'}),
    }),
    defineField({
      name: 'variant',
      title: '¿Para qué línea son estos pasos?',
      type: 'string',
      description: 'Sirve para mostrar la etiqueta adecuada y agrupar los pasos en la web.',
      options: {list: STEP_VARIANTS, layout: 'radio', direction: 'horizontal'},
      initialValue: 'both',
    }),
    defineField({
      name: 'steps',
      title: 'Pasos',
      type: 'array',
      description: 'Se numeran solos en el orden en que aparecen. Arrastra para reordenar.',
      validation: (rule) => rule.min(1).error('Añade al menos un paso.'),
      of: [
        defineArrayMember({
          name: 'step',
          title: 'Paso',
          type: 'object',
          icon: OlistIcon,
          fields: [
            defineField({
              name: 'title',
              title: 'Nombre del paso',
              type: 'localeString',
              description: 'Ej.: «Primera cita».',
              validation: requiredLocale({label: 'el nombre del paso'}),
            }),
            defineField({
              name: 'text',
              title: 'Explicación',
              type: 'localeText',
              description: 'Qué ocurre en este paso, cuánto suele durar, qué debe traer la clienta…',
              validation: requiredLocale({label: 'la explicación'}),
            }),
          ],
          preview: {
            select: {title: 'title', text: 'text'},
            prepare({title, text}) {
              return {title: es(title) ?? 'Paso sin nombre', subtitle: es(text)}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', steps: 'steps', variant: 'variant'},
    prepare({title, steps, variant}) {
      const n = Array.isArray(steps) ? steps.length : 0
      const variantTitle = STEP_VARIANTS.find((v) => v.value === variant)?.title
      return {
        title: es(title) ?? 'Pasos',
        subtitle: [`Pasos · ${n} ${n === 1 ? 'paso' : 'pasos'}`, variantTitle].filter(Boolean).join(' · '),
        media: OlistIcon,
      }
    },
  },
})

const CHANNELS = [
  {title: 'Email', value: 'email'},
  {title: 'Instagram', value: 'instagram'},
]

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Llamada a contactar',
  type: 'object',
  icon: EnvelopeIcon,
  description:
    'Invita a escribirte. Muestra un título, un texto breve y los botones de email y/o Instagram (los datos se toman de «Ajustes»).',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
      description: 'Ej.: «¿Hablamos de tu vestido?».',
      validation: requiredLocale({label: 'el título'}),
    }),
    defineField({
      name: 'text',
      title: 'Texto (opcional)',
      type: 'localeText',
      description: 'Una o dos frases. Ej.: «Cuéntame qué imaginas y te propongo una primera cita en el taller».',
      validation: optionalLocale({label: 'el texto'}),
    }),
    defineField({
      name: 'channels',
      title: 'Botones de contacto',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Elige qué formas de contacto se muestran. La dirección de email y la cuenta de Instagram se cambian en «Ajustes».',
      options: {list: CHANNELS, layout: 'grid'},
      initialValue: ['email', 'instagram'],
      validation: (rule) => [rule.min(1).error('Elige al menos una forma de contacto.'), rule.unique()],
    }),
  ],
  preview: {
    select: {title: 'title', channels: 'channels'},
    prepare({title, channels}) {
      const list = Array.isArray(channels)
        ? channels.map((c: string) => CHANNELS.find((ch) => ch.value === c)?.title ?? c).join(' + ')
        : ''
      return {
        title: es(title) ?? 'Llamada a contactar',
        subtitle: ['Llamada a contactar', list].filter(Boolean).join(' · '),
        media: EnvelopeIcon,
      }
    },
  },
})
