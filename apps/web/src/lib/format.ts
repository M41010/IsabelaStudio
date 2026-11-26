import { localeLang, type Locale } from '../i18n/utils';

/**
 * Fecha legible en el idioma activo: «14 de octubre de 2026» / «14 October 2026».
 * Acepta fechas `YYYY-MM-DD` (campo `date` de Sanity) o ISO completas (`_updatedAt`).
 * Se formatea en UTC para que una fecha sin hora no cambie de día según la zona del build.
 */
export function formatDate(value: string | null | undefined, locale: Locale): string | undefined {
  if (!value) return undefined;
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : localeLang[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Valor para el atributo `datetime` de `<time>` (solo la fecha). */
export function isoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}
