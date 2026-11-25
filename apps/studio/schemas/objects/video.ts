import {PlayIcon} from '@sanity/icons/Play'
import {defineField, defineType} from 'sanity'
import {es, optionalLocale} from '../lib/localized'

/**
 * Vídeo alojado en Mux + imagen de portada (poster) + descripción.
 * Mux convierte el vídeo y lo sirve en la calidad adecuada a cada pantalla y conexión
 * (el móvil recibe automáticamente una versión más ligera).
 */
export const video = defineType({
  name: 'video',
  title: 'Vídeo',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'asset',
      title: 'Archivo de vídeo',
      type: 'mux.video',
      description:
        'Sube el vídeo (MP4 o MOV, en la mejor calidad que tengas). Tarda unos minutos en procesarse; ' +
        'después la web lo adapta sola a cada móvil y conexión. Recomendado: vídeos cortos (menos de 1 minuto) y sin sonido importante, porque en la web se reproducen en silencio.',
      validation: (rule) => rule.required().error('Sube un vídeo.'),
    }),
    defineField({
      name: 'poster',
      title: 'Imagen de portada (opcional)',
      type: 'image',
      description:
        'Foto que se ve mientras el vídeo carga. Si la dejas vacía se usa un fotograma del propio vídeo. Usa la misma orientación que el vídeo.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'description',
      title: 'Descripción del vídeo (opcional)',
      type: 'localeText',
      description:
        'Qué ocurre en el vídeo, en una o dos frases. No se ve en la web: ayuda a personas con discapacidad visual y a Google.',
      validation: optionalLocale({label: 'la descripción del vídeo'}),
    }),
  ],
  preview: {
    select: {description: 'description', poster: 'poster', status: 'asset.asset.status'},
    prepare({description, poster, status}) {
      return {
        title: es(description) ?? 'Vídeo',
        subtitle: status ? `Estado en Mux: ${status}` : undefined,
        media: poster ?? PlayIcon,
      }
    },
  },
})
