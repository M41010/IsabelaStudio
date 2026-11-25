import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'
import {es, optionalLocale, requiredLocale} from '../lib/localized'

/**
 * Páginas fijas de la web. No se crean ni se borran desde el Studio:
 * cada una tiene un identificador fijo (ver `FIXED_PAGES`) y la web sabe en qué ruta va.
 */
export const FIXED_PAGES = [
  {id: 'about', title: 'Sobre mí', path: '/es/sobre-mi · /en/about'},
  {id: 'bespoke', title: 'A medida', path: '/es/a-medida · /en/bespoke'},
  {id: 'legal-notice', title: 'Aviso legal', path: '/es/aviso-legal · /en/legal-notice'},
  {id: 'privacy', title: 'Privacidad', path: '/es/privacidad · /en/privacy'},
  {id: 'cookies', title: 'Cookies', path: '/es/cookies · /en/cookies'},
] as const

export type FixedPageId = (typeof FIXED_PAGES)[number]['id']

export const page = defineType({
  name: 'page',
  title: 'Página',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la página',
      type: 'localeString',
      description: 'El titular grande al principio de la página. También se usa en la pestaña del navegador.',
      validation: requiredLocale({label: 'el título'}),
    }),
    defineField({
      name: 'intro',
      title: 'Entradilla (opcional)',
      type: 'localeText',
      description: 'Una o dos frases bajo el título.',
      validation: optionalLocale({label: 'la entradilla'}),
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'modularBody',
      description:
        'Apila bloques para construir la página: textos, fotos, pasos del proceso, llamada a contactar… Pulsa «Añadir elemento» y arrástralos para reordenar.',
    }),
    defineField({
      name: 'seo',
      title: 'Google y redes sociales',
      type: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', id: '_id'},
    prepare({title, id}) {
      const fixed = FIXED_PAGES.find((p) => typeof id === 'string' && id.endsWith(p.id))
      return {
        title: es(title) ?? fixed?.title ?? 'Página',
        subtitle: fixed?.path,
        media: DocumentTextIcon,
      }
    },
  },
})
