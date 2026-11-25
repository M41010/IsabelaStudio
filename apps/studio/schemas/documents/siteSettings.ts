import {CogIcon} from '@sanity/icons/Cog'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'
import {SearchIcon} from '@sanity/icons/Search'
import {defineField, defineType} from 'sanity'
import {optionalLocale} from '../lib/localized'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ajustes',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Marca', icon: ImageIcon, default: true},
    {name: 'contact', title: 'Contacto', icon: EnvelopeIcon},
    {name: 'video', title: 'Vídeo de portada', icon: PlayIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nombre de la marca',
      type: 'string',
      group: 'brand',
      description: 'Se usa en la pestaña del navegador, en Google y al compartir. Ej.: «Isabela Studio».',
      initialValue: 'Isabela Studio',
      validation: (rule) => rule.required().error('Escribe el nombre de la marca.'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'brand',
      description:
        'Mejor en SVG (o PNG con fondo transparente) y en un solo color. Aparece en la cabecera y sobre el vídeo de portada.',
    }),
    defineField({
      name: 'tagline',
      title: 'Frase de la marca (opcional)',
      type: 'localeString',
      group: 'brand',
      description: 'Una frase corta que acompaña a la marca en el pie de página. Ej.: «Moda de autor hecha a mano en España».',
      validation: optionalLocale({label: 'la frase de la marca'}),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contacto',
      type: 'string',
      group: 'contact',
      description: 'El email al que llegarán los encargos. Se usa en todos los botones «Escríbeme».',
      validation: (rule) => [
        rule.required().error('Escribe el email de contacto.'),
        rule.email().error('Este email no parece correcto.'),
      ],
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Usuario de Instagram',
      type: 'string',
      group: 'contact',
      description: 'Tu usuario, sin la @. Ej.: isabelastudio',
      validation: (rule) =>
        rule.regex(/^[A-Za-z0-9._]+$/, {name: 'usuario'}).error('Escribe solo el usuario, sin @ ni espacios.'),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Enlace a Instagram',
      type: 'url',
      group: 'contact',
      description: 'La dirección completa de tu perfil. Ej.: https://www.instagram.com/isabelastudio/',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'heroVideo',
      title: 'Vídeo de portada',
      type: 'video',
      group: 'video',
      description:
        'El vídeo a pantalla completa del principio de la web (proceso de confección). Se reproduce solo, en silencio y en bucle. ' +
        'Ideal: horizontal, entre 10 y 30 segundos. Mux ya envía al móvil una versión más ligera automáticamente.',
    }),
    defineField({
      name: 'heroVideoMobile',
      title: 'Vídeo de portada para móvil (opcional)',
      type: 'video',
      group: 'video',
      description:
        'Solo si quieres un vídeo distinto en el móvil, por ejemplo grabado en VERTICAL (9:16). No hace falta para que pese menos: Mux ya adapta la calidad. Si lo dejas vacío, el móvil muestra el vídeo principal recortado.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Google y redes sociales (por defecto)',
      type: 'seo',
      group: 'seo',
      description:
        'Se usa en cualquier página que no tenga sus propios datos. La «Imagen al compartir» de aquí es la imagen por defecto al compartir la web.',
      options: {collapsible: false},
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Ajustes', subtitle: 'Logo, contacto, vídeo de portada y SEO', media: CogIcon}
    },
  },
})
