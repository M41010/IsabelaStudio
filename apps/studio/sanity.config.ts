import {esESLocale} from '@sanity/locale-es-es'
import {visionTool} from '@sanity/vision'
import {defineConfig, isDev} from 'sanity'
import {muxInput} from 'sanity-plugin-mux-input'
import {structureTool} from 'sanity/structure'
import {API_VERSION, dataset, projectId} from './env'
import {schemaTypes} from './schemas'
import {FIXED_PAGES} from './schemas/documents/page'
import {COLLECTION_BY_LINE_TEMPLATE, structure} from './structure'

/**
 * Documentos únicos con id fijo: la portada, los ajustes y las páginas fijas.
 * Sanity los oculta del menú «Crear» y no permite duplicarlos.
 */
const singletons = [
  {documentId: 'homePage', schemaType: 'homePage', title: 'Inicio'},
  {documentId: 'siteSettings', schemaType: 'siteSettings', title: 'Ajustes'},
  ...FIXED_PAGES.map((p) => ({documentId: p.id, schemaType: 'page', title: p.title})),
]

const SINGLETON_SCHEMA_TYPES = new Set(singletons.map((s) => s.schemaType))
const SINGLETON_IDS = new Set(singletons.map((s) => s.documentId))

/** Acciones que no tienen sentido en documentos únicos (borrarlos rompería la web). */
const BLOCKED_SINGLETON_ACTIONS = new Set(['delete', 'duplicate', 'unpublish'])

export default defineConfig({
  name: 'default',
  title: 'Isabela Studio',
  projectId,
  dataset,

  plugins: [
    structureTool({structure, title: 'Contenido'}),
    muxInput({
      tool: {title: 'Vídeos'},
      acceptedMimeTypes: ['video/*'],
      max_resolution_tier: '1080p',
      // MP4 estáticos: la web los reproduce con <video> nativo, sin cargar un reproductor HLS.
      static_renditions: ['1080p', '720p', '480p'],
    }),
    esESLocale(),
    // La consola de consultas GROQ solo se carga en desarrollo.
    ...(isDev ? [visionTool({defaultApiVersion: API_VERSION, title: 'Consultas'})] : []),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: COLLECTION_BY_LINE_TEMPLATE,
        title: 'Colección de una línea',
        schemaType: 'collection',
        parameters: [{name: 'line', type: 'string'}],
        value: (params: {line?: string}) => ({line: params.line}),
      },
    ],
  },

  document: {
    singletons,

    // Menú «Crear»: sin documentos únicos ni la plantilla auxiliar por línea
    // (esa solo se ofrece dentro de «Colecciones → Prêt-à-porter / Flamenca»).
    newDocumentOptions: (prev, {creationContext}) =>
      prev.filter((item) => {
        if (SINGLETON_IDS.has(item.templateId) || SINGLETON_SCHEMA_TYPES.has(item.templateId)) return false
        if (item.templateId === COLLECTION_BY_LINE_TEMPLATE) return creationContext.type === 'structure'
        return true
      }),

    actions: (prev, context) => {
      const isSingleton =
        Boolean(context.singleton) || (context.documentId !== undefined && SINGLETON_IDS.has(context.documentId))
      if (!isSingleton) return prev
      return prev.filter((action) => !action.action || !BLOCKED_SINGLETON_ACTIONS.has(action.action))
    },
  },
})
