import { fetchSanity } from './client';
import { hasPressQuery } from './queries';

// Memoizado: en el build se consulta una sola vez para todas las páginas.
let hasPressPromise: Promise<boolean> | undefined;

/** `true` si hay al menos una entrada de prensa (si no, "Prensa" se oculta del menú). */
export function getHasPress(): Promise<boolean> {
  hasPressPromise ??= fetchSanity<boolean>(hasPressQuery, {}, false);
  return hasPressPromise;
}
