import {BlockContentIcon} from '@sanity/icons/BlockContent'
import {defineArrayMember, defineType} from 'sanity'

/** Orden en el que aparecen los bloques en el menú «Añadir bloque». */
export const BLOCK_TYPES = [
  'chapterHeading',
  'textBlock',
  'pullQuote',
  'fullBleedImage',
  'imagePair',
  'moodboard',
  'sketchGrid',
  'lookbookGallery',
  'videoBlock',
  'stepsBlock',
  'ctaBlock',
] as const

/**
 * Cuerpo modular compartido por colecciones y páginas:
 * una lista de bloques que Teresita apila y reordena como páginas de una revista.
 */
export const modularBody = defineType({
  name: 'modularBody',
  title: 'Contenido',
  type: 'array',
  icon: BlockContentIcon,
  of: BLOCK_TYPES.map((type) => defineArrayMember({type})),
  options: {
    insertMenu: {
      filter: false,
      groups: [
        {name: 'texto', title: 'Texto', of: ['chapterHeading', 'textBlock', 'pullQuote']},
        {
          name: 'imagenes',
          title: 'Imágenes',
          of: ['fullBleedImage', 'imagePair', 'moodboard', 'sketchGrid', 'lookbookGallery'],
        },
        {name: 'video', title: 'Vídeo', of: ['videoBlock']},
        {name: 'contacto', title: 'Encargos y contacto', of: ['stepsBlock', 'ctaBlock']},
      ],
      views: [
        // Miniaturas ilustrativas servidas desde `static/blocks/*.svg`.
        {name: 'grid', previewImageUrl: (schemaTypeName) => `/static/blocks/${schemaTypeName}.svg`},
        {name: 'list'},
      ],
    },
  },
})
