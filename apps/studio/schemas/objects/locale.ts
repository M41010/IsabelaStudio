import {TranslateIcon} from '@sanity/icons/Translate'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Objetos bilingües `{es, en}`.
 * La obligatoriedad (ES = error, EN = aviso) se define en cada campo que los usa
 * con `requiredLocale()` / `optionalLocale()` de `schemas/lib/localized.ts`.
 */

const ES_DESCRIPTION = 'Idioma principal de la web.'
const EN_DESCRIPTION = 'Si lo dejas vacío, la web en inglés mostrará el texto en español.'

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto corto (español / inglés)',
  type: 'object',
  icon: TranslateIcon,
  options: {columns: 2},
  fields: [
    defineField({name: 'es', title: 'Español', type: 'string', description: ES_DESCRIPTION}),
    defineField({name: 'en', title: 'English', type: 'string', description: EN_DESCRIPTION}),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto (español / inglés)',
  type: 'object',
  icon: TranslateIcon,
  fields: [
    defineField({name: 'es', title: 'Español', type: 'text', rows: 4, description: ES_DESCRIPTION}),
    defineField({name: 'en', title: 'English', type: 'text', rows: 4, description: EN_DESCRIPTION}),
  ],
})

/** Texto con formato: párrafos, subtítulos, cursiva, negrita y enlaces. */
const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Párrafo', value: 'normal'},
    {title: 'Subtítulo', value: 'h2'},
    {title: 'Subtítulo pequeño', value: 'h3'},
    {title: 'Cita', value: 'blockquote'},
  ],
  lists: [
    {title: 'Lista con puntos', value: 'bullet'},
    {title: 'Lista numerada', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Negrita', value: 'strong'},
      {title: 'Cursiva', value: 'em'},
    ],
    annotations: [
      defineArrayMember({
        name: 'link',
        title: 'Enlace',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'Dirección del enlace',
            type: 'url',
            description: 'Pega la dirección completa, por ejemplo https://instagram.com/… o mailto:hola@…',
            validation: (rule) =>
              rule.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
          }),
        ],
      }),
    ],
  },
})

export const localeRichText = defineType({
  name: 'localeRichText',
  title: 'Texto con formato (español / inglés)',
  type: 'object',
  icon: TranslateIcon,
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [richTextBlock],
      description: ES_DESCRIPTION,
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [richTextBlock],
      description: EN_DESCRIPTION,
    }),
  ],
})
