import {BookIcon} from '@sanity/icons/Book'
import {ComposeIcon} from '@sanity/icons/Compose'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {SearchIcon} from '@sanity/icons/Search'
import {StarIcon} from '@sanity/icons/Star'
import {defineField, defineType, getPublishedId} from 'sanity'
import {es, requiredLocale} from '../lib/localized'
import {API_VERSION} from '../../env'

export const LINES = [
  {title: 'Prêt-à-porter', value: 'pret-a-porter'},
  {title: 'Flamenca', value: 'flamenca'},
] as const

export function lineTitle(value: unknown): string | undefined {
  return LINES.find((l) => l.value === value)?.title
}

export const collection = defineType({
  name: 'collection',
  title: 'Colección',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'basic', title: 'Básico', icon: InfoOutlineIcon, default: true},
    {name: 'story', title: 'Historia', icon: ComposeIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la colección',
      type: 'localeString',
      group: 'basic',
      description: 'El gran titular de la colección. Ej.: «Azahar».',
      validation: requiredLocale({label: 'el nombre de la colección'}),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección web',
      type: 'slug',
      group: 'basic',
      description:
        'Final de la dirección de la colección, igual en español e inglés (ej.: isabelastudio.com/es/colecciones/azahar). Pulsa «Generar» para crearla a partir del nombre. Evita cambiarla una vez publicada: los enlaces antiguos dejarían de funcionar.',
      options: {source: 'title.es', maxLength: 80},
      validation: (rule) => rule.required().error('Pulsa «Generar» para crear la dirección web.'),
    }),
    defineField({
      name: 'line',
      title: 'Línea',
      type: 'string',
      group: 'basic',
      description: 'A qué línea pertenece. Sirve para el filtro de la página de colecciones.',
      options: {list: [...LINES], layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required().error('Elige Prêt-à-porter o Flamenca.'),
    }),
    defineField({
      name: 'season',
      title: 'Temporada',
      type: 'string',
      group: 'basic',
      description: 'Cómo quieres que aparezca. Ej.: «Primavera–Verano 2026» o «Feria 2026».',
    }),
    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      group: 'basic',
      description: 'Solo el año, en cifras. Se usa para ordenar las colecciones (las más recientes primero).',
      validation: (rule) => [
        rule.required().error('Escribe el año de la colección.'),
        rule.integer().min(2000).max(2100).error('Escribe un año válido, por ejemplo 2026.'),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Foto de portada',
      type: 'accessibleImage',
      group: 'basic',
      description:
        'La foto que representa la colección en el índice de colecciones, en la portada y al compartir el enlace. Vertical (retrato, 4:5), mínimo 2000 px de alto.',
      validation: (rule) => rule.required().error('Sube una foto de portada.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      type: 'localeText',
      group: 'basic',
      description: 'Una o dos frases que presentan la colección. Se ven en el índice de colecciones y en la portada.',
      validation: requiredLocale({label: 'el resumen'}),
    }),
    defineField({
      name: 'featured',
      title: 'Colección destacada',
      type: 'boolean',
      group: 'basic',
      description:
        'Márcalo en la colección que quieres destacar. Solo debería haber una destacada a la vez. (La colección que sale en la portada se elige en «Inicio».)',
      initialValue: false,
      validation: (rule) =>
        rule
          .custom(async (value, context) => {
            if (!value || !context.document) return true
            const id = getPublishedId(context.document._id)
            const client = context.getClient({apiVersion: API_VERSION})
            // Solo cuenta colecciones publicadas distintas de esta.
            const others = await client.fetch<string[]>(
              `*[_type == "collection" && featured == true && _id != $id
                && !(_id in path("drafts.**")) && !(_id in path("versions.**"))].title.es`,
              {id},
            )
            if (others.length === 0) return true
            return `«${others.join('», «')}» ya está marcada como destacada. Desmárcala allí para que solo haya una.`
          })
          .warning(),
    }),
    defineField({
      name: 'body',
      title: 'Historia de la colección',
      type: 'modularBody',
      group: 'story',
      description:
        'Construye la historia como una revista, apilando bloques: capítulos, textos, moodboard, bocetos, fotos, vídeo, cita y lookbook final. Pulsa «Añadir elemento» para elegir un bloque y arrástralos para reordenar.',
    }),
    defineField({
      name: 'seo',
      title: 'Google y redes sociales',
      type: 'seo',
      group: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Año, más recientes primero',
      name: 'yearDesc',
      by: [
        {field: 'year', direction: 'desc'},
        {field: 'title.es', direction: 'asc'},
      ],
    },
    {
      title: 'Año, más antiguas primero',
      name: 'yearAsc',
      by: [
        {field: 'year', direction: 'asc'},
        {field: 'title.es', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', line: 'line', season: 'season', year: 'year', featured: 'featured', media: 'coverImage'},
    prepare({title, line, season, year, featured, media}) {
      return {
        title: `${es(title) ?? 'Colección sin nombre'}${featured ? ' ★' : ''}`,
        subtitle: [lineTitle(line), season ?? year].filter(Boolean).join(' · '),
        media: media ?? StarIcon,
      }
    },
  },
})
