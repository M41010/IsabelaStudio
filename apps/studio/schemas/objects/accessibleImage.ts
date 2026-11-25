import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'
import {es, optionalLocale, requiredLocale} from '../lib/localized'

/**
 * Imagen con texto alternativo bilingüe (accesibilidad y SEO) y pie de foto opcional.
 * Se usa en todas las fotos de la web.
 */
export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Imagen',
  type: 'image',
  icon: ImageIcon,
  description:
    'Sube la foto en la mejor calidad que tengas (mínimo 2000 px en el lado largo). ' +
    'Después pulsa el icono del lápiz para marcar el punto importante de la foto: así, cuando la web la recorte en el móvil, no cortará la cara ni la prenda.',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Descripción de la imagen (texto alternativo)',
      type: 'localeString',
      description:
        'Describe en una frase lo que se ve, como si se lo contaras a alguien que no puede ver la foto. ' +
        'Ej.: «Vestido de flamenca rojo con volantes en lunares blancos, de espaldas». No se ve en la web: lo leen los lectores de pantalla y Google.',
      validation: requiredLocale({label: 'la descripción de la imagen', onlyIfParentHasAsset: true}),
    }),
    defineField({
      name: 'caption',
      title: 'Pie de foto (opcional)',
      type: 'localeString',
      description: 'Texto pequeño que aparece debajo de la foto. Ej.: «Prueba de patronaje en el taller».',
      validation: optionalLocale({label: 'el pie de foto'}),
    }),
  ],
  preview: {
    select: {media: 'asset', alt: 'alt', caption: 'caption'},
    prepare({media, alt, caption}) {
      return {
        title: es(caption) ?? es(alt) ?? 'Imagen sin descripción',
        subtitle: es(alt) ? undefined : 'Falta la descripción de la imagen',
        media,
      }
    },
  },
})
