/** Ancla legible a partir de un título: «Qué datos tratamos» → `que-datos-tratamos`. */
export function anchorId(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'seccion'
  );
}
