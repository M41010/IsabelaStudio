/**
 * Configuración compartida por `sanity.config.ts`, `sanity.cli.ts` y los esquemas.
 * En el Studio solo están disponibles las variables con prefijo `SANITY_STUDIO_`.
 */

/** Valor de relleno para que `sanity build` funcione antes de crear el proyecto en sanity.io. */
export const PLACEHOLDER_PROJECT_ID = 'placeholder'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || PLACEHOLDER_PROJECT_ID
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

/** Versión de la API de Sanity usada en consultas desde el Studio (validaciones, etc.). */
export const API_VERSION = '2026-11-01'
