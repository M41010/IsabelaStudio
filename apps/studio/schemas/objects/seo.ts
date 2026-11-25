import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'
import {optionalLocale} from '../lib/localized'

/**
 * Datos para Google y para cuando se comparte un enlace (WhatsApp, Instagram, etc.).
 * Todo es opcional: si se deja vacío, la web usa el título de la página
 * y los datos por defecto de «Ajustes».
 */
export const seo = defineType({
  name: 'seo',
  title: 'Google y redes sociales',
  type: 'object',
  icon: SearchIcon,
  description:
    'Opcional. Controla cómo aparece esta página en Google y cuando alguien comparte el enlace. Si lo dejas vacío, la web lo completa sola.',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Título para Google',
      type: 'localeString',
      description: 'El título azul que sale en Google. Ideal: menos de 60 caracteres.',
      validation: (rule) => [
        ...optionalLocale({label: 'el título para Google'})(rule),
        rule
          .custom<{es?: string; en?: string}>((value) => {
            const tooLong = [value?.es, value?.en].some((t) => (t?.length ?? 0) > 60)
            return tooLong ? 'Es un poco largo: Google podría cortarlo (más de 60 caracteres).' : true
          })
          .warning(),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción para Google',
      type: 'localeText',
      description: 'El texto gris bajo el título en Google. Ideal: entre 70 y 160 caracteres.',
      validation: (rule) => [
        ...optionalLocale({label: 'la descripción para Google'})(rule),
        rule
          .custom<{es?: string; en?: string}>((value) => {
            const tooLong = [value?.es, value?.en].some((t) => (t?.length ?? 0) > 160)
            return tooLong ? 'Es un poco larga: Google podría cortarla (más de 160 caracteres).' : true
          })
          .warning(),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen al compartir',
      type: 'image',
      description:
        'La foto que aparece al compartir el enlace en WhatsApp, Instagram, Facebook… Horizontal, 1200 × 630 px.',
      options: {hotspot: true},
    }),
  ],
})
