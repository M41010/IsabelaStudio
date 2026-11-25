import {ActivityIcon} from '@sanity/icons/Activity'
import {DocumentPdfIcon} from '@sanity/icons/DocumentPdf'
import {LinkIcon} from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'
import {es, requiredLocale} from '../lib/localized'

type PressDoc = {url?: string; pdf?: {asset?: unknown}}

/** Exactamente uno de los dos: enlace o PDF. */
function linkOrPdf(context: {document?: unknown}): true | string {
  const doc = context.document as PressDoc | undefined
  const hasUrl = Boolean(doc?.url)
  const hasPdf = Boolean(doc?.pdf?.asset)
  if (hasUrl && hasPdf) return 'Elige solo una opción: o el enlace o el PDF. Borra la otra.'
  if (!hasUrl && !hasPdf) return 'Añade el enlace al artículo o sube el PDF.'
  return true
}

export const pressItem = defineType({
  name: 'pressItem',
  title: 'Aparición en prensa',
  type: 'document',
  icon: ActivityIcon,
  description: 'Artículos, entrevistas o menciones en medios. Si no hay ninguna, la sección «Prensa» se oculta del menú.',
  fields: [
    defineField({
      name: 'outlet',
      title: 'Medio',
      type: 'string',
      description: 'Nombre de la revista, periódico o web. Ej.: «Vogue España».',
      validation: (rule) => rule.required().error('Escribe el nombre del medio.'),
    }),
    defineField({
      name: 'headline',
      title: 'Titular',
      type: 'localeString',
      description: 'El titular del artículo, tal cual o resumido.',
      validation: requiredLocale({label: 'el titular'}),
    }),
    defineField({
      name: 'date',
      title: 'Fecha de publicación',
      type: 'date',
      description: 'Se usa para ordenar las apariciones (las más recientes primero).',
      options: {dateFormat: 'D [de] MMMM [de] YYYY'},
      validation: (rule) => rule.required().error('Indica la fecha de publicación.'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo del medio (opcional)',
      type: 'image',
      description: 'Mejor en PNG o SVG con fondo transparente, en negro o en un solo color. Si no lo hay, la web muestra el nombre del medio.',
    }),
    defineField({
      name: 'url',
      title: 'Enlace al artículo',
      type: 'url',
      description: 'Si el artículo está en internet, pega aquí la dirección. Rellena esto O el PDF, no los dos.',
      validation: (rule) => [rule.uri({scheme: ['http', 'https']}), rule.custom((_, context) => linkOrPdf(context))],
    }),
    defineField({
      name: 'pdf',
      title: 'PDF del artículo',
      type: 'file',
      description: 'Si es un artículo en papel, sube el escaneo en PDF. Rellena esto O el enlace, no los dos.',
      options: {accept: 'application/pdf'},
      validation: (rule) => rule.custom((_, context) => linkOrPdf(context)),
    }),
  ],
  orderings: [
    {title: 'Fecha, más recientes primero', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
  ],
  preview: {
    select: {outlet: 'outlet', headline: 'headline', date: 'date', logo: 'logo', url: 'url', pdf: 'pdf.asset'},
    prepare({outlet, headline, date, logo, url, pdf}) {
      const formatted = date
        ? new Date(`${date}T00:00:00`).toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})
        : undefined
      return {
        title: es(headline) ?? 'Sin titular',
        subtitle: [outlet, formatted, pdf ? 'PDF' : url ? 'Enlace' : undefined].filter(Boolean).join(' · '),
        media: logo ?? (pdf ? DocumentPdfIcon : LinkIcon),
      }
    },
  },
})
