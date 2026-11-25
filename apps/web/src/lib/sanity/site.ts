import { getPressItems } from './api';

/** `true` si hay al menos una entrada de prensa (si no, "Prensa" se oculta del menú). */
export async function getHasPress(): Promise<boolean> {
  return (await getPressItems()).length > 0;
}
