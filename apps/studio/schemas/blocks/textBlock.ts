import {TextIcon} from '@sanity/icons/Text'
import {defineField, defineType} from 'sanity'
import {plainText, requiredLocale} from '../lib/localized'

const WIDTHS = [
  {title: 'Estrecho y centrado (lectura cómoda)', value: 'narrow'},
  {title: 'Desplazado a la izquierda (estilo revista)', value: 'offsetLeft'},
  {title: 'Desplazado a la derecha (estilo revista)', value: 'offsetRight'},
  {title: 'Ancho, a dos columnas', value: 'twoColumns'},
]

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Texto',
  type: 'object',
  icon: TextIcon,
  description: 'Uno o varios párrafos para contar la historia: inspiración, proceso, tejidos…',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Antetítulo (opcional)',
      type: 'localeString',
      description: 'Palabra o frase muy corta encima del texto, en letra pequeña. Ej.: «Inspiración», «Los tejidos».',
    }),
    defineField({
      name: 'body',
      title: 'Texto',
      type: 'localeRichText',
      description: 'Escribe con frases cortas y párrafos breves: en el móvil se lee mejor.',
      validation: requiredLocale({label: 'el texto'}),
    }),
    defineField({
      name: 'width',
      title: 'Composición',
      type: 'string',
      description: 'Cómo se coloca el texto en la página. Alterna entre opciones para dar ritmo de revista.',
      options: {list: WIDTHS, layout: 'radio'},
      initialValue: 'narrow',
    }),
  ],
  preview: {
    select: {body: 'body.es', eyebrow: 'eyebrow.es', width: 'width'},
    prepare({body, eyebrow, width}) {
      const widthTitle = WIDTHS.find((w) => w.value === width)?.title
      return {
        title: plainText(body) ?? 'Texto vacío',
        subtitle: ['Texto', eyebrow, widthTitle].filter(Boolean).join(' · '),
        media: TextIcon,
      }
    },
  },
})
