import type {Rule} from 'sanity'

/**
 * Utilidades de validación para los campos bilingües `{es, en}`.
 *
 * Regla del proyecto:
 * - Español obligatorio → ERROR (no deja publicar).
 * - Inglés vacío → AVISO (deja publicar; la web usará el texto en español).
 *
 * La validación vive en el campo que USA el objeto (no dentro del objeto),
 * así el mismo `localeString` sirve para campos obligatorios y opcionales.
 */

export type Localized<T = unknown> = {es?: T; en?: T} | undefined

/** ¿Tiene contenido? Sirve para string y para arrays de Portable Text. */
export function hasContent(value: unknown): boolean {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

type Options = {
  /** Texto descriptivo del campo para los mensajes ("el título", "el texto alternativo"…). */
  label?: string
  /**
   * Si el campo vive dentro de una imagen, solo se valida cuando hay imagen subida
   * (así un hueco de imagen vacío no muestra errores de texto alternativo).
   */
  onlyIfParentHasAsset?: boolean
}

function parentHasNoAsset(context: {parent?: unknown}): boolean {
  const parent = context.parent as {asset?: unknown} | undefined
  return !parent?.asset
}

/** Campo bilingüe obligatorio: ES = error, EN = aviso. */
export function requiredLocale(options: Options = {}) {
  const label = options.label ?? 'este texto'
  return (rule: Rule) => [
    rule.custom<Localized>((value, context) => {
      if (options.onlyIfParentHasAsset && parentHasNoAsset(context)) return true
      return hasContent(value?.es) ? true : `Escribe ${label} en español: es obligatorio.`
    }),
    rule
      .custom<Localized>((value, context) => {
        if (options.onlyIfParentHasAsset && parentHasNoAsset(context)) return true
        if (!hasContent(value?.es)) return true
        return hasContent(value?.en)
          ? true
          : `Falta la versión en inglés de ${label}. Puedes publicar igual: la web mostrará el español.`
      })
      .warning(),
  ]
}

/** Campo bilingüe opcional: si se rellena el inglés, pide el español; si hay español sin inglés, avisa. */
export function optionalLocale(options: Options = {}) {
  const label = options.label ?? 'este texto'
  return (rule: Rule) => [
    rule.custom<Localized>((value) => {
      if (hasContent(value?.en) && !hasContent(value?.es)) {
        return `Has escrito ${label} en inglés pero falta el español, que es el idioma principal.`
      }
      return true
    }),
    rule
      .custom<Localized>((value) => {
        if (hasContent(value?.es) && !hasContent(value?.en)) {
          return `Falta la versión en inglés de ${label}. Puedes publicar igual: la web mostrará el español.`
        }
        return true
      })
      .warning(),
  ]
}

/** Devuelve el texto en español de un valor bilingüe (para previews). */
export function es(value: Localized<string>): string | undefined {
  return value?.es?.trim() || value?.en?.trim() || undefined
}

/** Extrae texto plano de Portable Text (para previews). */
export function plainText(blocks: unknown, max = 80): string | undefined {
  if (!Array.isArray(blocks)) return undefined
  const text = blocks
    .map((block) => {
      const children = (block as {children?: {text?: string}[]})?.children
      return Array.isArray(children) ? children.map((c) => c.text ?? '').join('') : ''
    })
    .join(' ')
    .trim()
  if (!text) return undefined
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}
