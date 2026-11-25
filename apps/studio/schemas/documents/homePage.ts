import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {HomeIcon} from '@sanity/icons/Home'
import {ImagesIcon} from '@sanity/icons/Images'
import {SearchIcon} from '@sanity/icons/Search'
import {StarIcon} from '@sanity/icons/Star'
import {TextIcon} from '@sanity/icons/Text'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {optionalLocale, requiredLocale} from '../lib/localized'

export const homePage = defineType({
  name: 'homePage',
  title: 'Inicio',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'featured', title: 'Colección destacada', icon: StarIcon, default: true},
    {name: 'gallery', title: 'Fotos', icon: ImagesIcon},
    {name: 'philosophy', title: 'Filosofía', icon: TextIcon},
    {name: 'cta', title: 'Contacto', icon: EnvelopeIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Titular editorial',
      type: 'localeString',
      group: 'featured',
      description:
        'El gran titular que aparece bajo el vídeo de portada, junto a la colección destacada. Corto y con fuerza, como la portada de una revista. (El vídeo se cambia en «Ajustes».)',
      validation: requiredLocale({label: 'el titular'}),
    }),
    defineField({
      name: 'featuredCollection',
      title: 'Colección destacada',
      type: 'reference',
      group: 'featured',
      to: [{type: 'collection'}],
      description: 'Elige la colección que se presenta en la portada. Su foto de portada y su resumen se muestran junto al titular.',
      options: {disableNew: true},
      validation: (rule) => rule.required().error('Elige una colección para la portada.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Selección de fotos',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({type: 'accessibleImage'})],
      options: {layout: 'grid'},
      description:
        'Entre 3 y 7 fotos que se colocan en composición asimétrica, como una página de revista. Mezcla verticales y horizontales, planos generales y detalles. El orden importa: la primera es la más grande.',
      validation: (rule) => [
        rule.min(3).error('Elige al menos 3 fotos para la composición.'),
        rule.max(7).warning('Más de 7 fotos hacen la portada muy larga en el móvil.'),
      ],
    }),
    defineField({
      name: 'philosophyTitle',
      title: 'Título de la filosofía (opcional)',
      type: 'localeString',
      group: 'philosophy',
      description: 'Ej.: «Hecho a mano, de principio a fin».',
      validation: optionalLocale({label: 'el título'}),
    }),
    defineField({
      name: 'philosophy',
      title: 'Filosofía',
      type: 'localeRichText',
      group: 'philosophy',
      description: 'Un párrafo breve sobre tu forma de trabajar y tu visión. Mejor menos de 80 palabras.',
      validation: requiredLocale({label: 'el texto de filosofía'}),
    }),
    defineField({
      name: 'cta',
      title: 'Llamada a contactar',
      type: 'ctaBlock',
      group: 'cta',
      description: 'El bloque final de la portada que invita a escribirte.',
    }),
    defineField({
      name: 'seo',
      title: 'Google y redes sociales',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Inicio', subtitle: 'Portada de la web', media: HomeIcon}
    },
  },
})
