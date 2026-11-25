import {DashboardIcon} from '@sanity/icons/Dashboard'
import {EditIcon} from '@sanity/icons/Edit'
import {ImageIcon} from '@sanity/icons/Image'
import {ImagesIcon} from '@sanity/icons/Images'
import {SplitVerticalIcon} from '@sanity/icons/SplitVertical'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {es, optionalLocale} from '../lib/localized'

const imageMember = defineArrayMember({type: 'accessibleImage'})

function countLabel(images: unknown, singular: string, plural: string): string {
  const n = Array.isArray(images) ? images.length : 0
  return `${n} ${n === 1 ? singular : plural}`
}

export const fullBleedImage = defineType({
  name: 'fullBleedImage',
  title: 'Imagen a sangre',
  type: 'object',
  icon: ImageIcon,
  description: 'Una sola foto que ocupa todo el ancho de la pantalla, de borde a borde. Para los momentos de más impacto.',
  fields: [
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'accessibleImage',
      description:
        'Mejor en horizontal y con mucha calidad (mínimo 2400 px de ancho). En el móvil se recorta alrededor del punto importante que marques.',
      validation: (rule) => rule.required().error('Sube una imagen.'),
    }),
    defineField({
      name: 'parallax',
      title: 'Movimiento suave al hacer scroll (parallax)',
      type: 'boolean',
      description:
        'Si lo activas, la foto se desplaza un poco más despacio que la página al bajar, dando sensación de profundidad. Queda mejor en fotos con aire alrededor.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {media: 'image', alt: 'image.alt', caption: 'image.caption', parallax: 'parallax'},
    prepare({media, alt, caption, parallax}) {
      return {
        title: es(caption) ?? es(alt) ?? 'Imagen a sangre',
        subtitle: `Imagen a sangre${parallax ? ' · con parallax' : ''}`,
        media: media ?? ImageIcon,
      }
    },
  },
})

const PAIR_LAYOUTS = [
  {title: 'La de la izquierda más alta', value: 'leftTall'},
  {title: 'La de la derecha más alta', value: 'rightTall'},
]

export const imagePair = defineType({
  name: 'imagePair',
  title: 'Pareja de imágenes',
  type: 'object',
  icon: SplitVerticalIcon,
  description: 'Dos fotos juntas en composición asimétrica, como en una doble página de revista.',
  fields: [
    defineField({
      name: 'left',
      title: 'Imagen izquierda',
      type: 'accessibleImage',
      description: 'Mejor en vertical (retrato).',
      validation: (rule) => rule.required().error('Sube la imagen de la izquierda.'),
    }),
    defineField({
      name: 'right',
      title: 'Imagen derecha',
      type: 'accessibleImage',
      description: 'Mejor en vertical (retrato). Puede ser un detalle: tejido, costura, bordado…',
      validation: (rule) => rule.required().error('Sube la imagen de la derecha.'),
    }),
    defineField({
      name: 'layout',
      title: 'Composición',
      type: 'string',
      description: 'Cuál de las dos fotos es la protagonista (más grande y más alta). En el móvil se ven una debajo de otra.',
      options: {list: PAIR_LAYOUTS, layout: 'radio', direction: 'horizontal'},
      initialValue: 'leftTall',
    }),
  ],
  preview: {
    select: {media: 'left', right: 'right', alt: 'left.alt', layout: 'layout'},
    prepare({media, alt, layout}) {
      const layoutTitle = PAIR_LAYOUTS.find((l) => l.value === layout)?.title
      return {
        title: es(alt) ?? 'Pareja de imágenes',
        subtitle: ['Pareja de imágenes', layoutTitle].filter(Boolean).join(' · '),
        media: media ?? SplitVerticalIcon,
      }
    },
  },
})

export const sketchGrid = defineType({
  name: 'sketchGrid',
  title: 'Bocetos',
  type: 'object',
  icon: EditIcon,
  description: 'Cuadrícula de bocetos, dibujos o patrones escaneados.',
  fields: [
    defineField({
      name: 'title',
      title: 'Título (opcional)',
      type: 'localeString',
      description: 'Ej.: «Del papel al patrón».',
      validation: optionalLocale({label: 'el título'}),
    }),
    defineField({
      name: 'images',
      title: 'Bocetos',
      type: 'array',
      of: [imageMember],
      options: {layout: 'grid'},
      description: 'Escanea o fotografía los bocetos sobre fondo liso. Cualquier orientación sirve. Arrastra para cambiar el orden.',
      validation: (rule) => rule.min(1).error('Añade al menos un boceto.'),
    }),
  ],
  preview: {
    select: {title: 'title', images: 'images', media: 'images.0'},
    prepare({title, images, media}) {
      return {
        title: es(title) ?? 'Bocetos',
        subtitle: `Bocetos · ${countLabel(images, 'imagen', 'imágenes')}`,
        media: media ?? EditIcon,
      }
    },
  },
})

export const moodboard = defineType({
  name: 'moodboard',
  title: 'Moodboard',
  type: 'object',
  icon: DashboardIcon,
  description: 'Collage de inspiración: referencias, colores, texturas, lugares. Entre 3 y 9 imágenes.',
  fields: [
    defineField({
      name: 'title',
      title: 'Título (opcional)',
      type: 'localeString',
      description: 'Ej.: «Inspiración».',
      validation: optionalLocale({label: 'el título'}),
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      type: 'array',
      of: [imageMember],
      options: {layout: 'grid'},
      description:
        'Entre 3 y 9 imágenes. Mezcla fotos verticales y horizontales: la web las coloca en un collage. Arrastra para cambiar el orden.',
      validation: (rule) => [
        rule.min(3).error('El moodboard necesita al menos 3 imágenes.'),
        rule.max(9).error('Como máximo 9 imágenes: así el collage respira.'),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', images: 'images', media: 'images.0'},
    prepare({title, images, media}) {
      return {
        title: es(title) ?? 'Moodboard',
        subtitle: `Moodboard · ${countLabel(images, 'imagen', 'imágenes')}`,
        media: media ?? DashboardIcon,
      }
    },
  },
})

export const lookbookGallery = defineType({
  name: 'lookbookGallery',
  title: 'Lookbook',
  type: 'object',
  icon: ImagesIcon,
  description:
    'Galería con las fotos finales de la colección. En la web, al tocar una foto se abre a pantalla completa y se puede pasar de una a otra.',
  fields: [
    defineField({
      name: 'title',
      title: 'Título (opcional)',
      type: 'localeString',
      description: 'Ej.: «Lookbook».',
      validation: optionalLocale({label: 'el título'}),
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      type: 'array',
      of: [imageMember],
      options: {layout: 'grid'},
      description:
        'Fotos del lookbook en alta calidad (mínimo 2000 px en el lado largo), preferiblemente en vertical. Arrastra para cambiar el orden.',
      validation: (rule) => rule.min(1).error('Añade al menos una foto.'),
    }),
  ],
  preview: {
    select: {title: 'title', images: 'images', media: 'images.0'},
    prepare({title, images, media}) {
      return {
        title: es(title) ?? 'Lookbook',
        subtitle: `Lookbook · ${countLabel(images, 'foto', 'fotos')}`,
        media: media ?? ImagesIcon,
      }
    },
  },
})
