/**
 * Cargador del visor a pantalla completa. Pesa muy poco: solo escucha la intención de
 * uso y el clic. PhotoSwipe y sus estilos (`lightbox-viewer.ts`) se piden con import()
 * dinámico la primera vez que hacen falta.
 *
 * Todas las fotos `a[data-lightbox]` de la página forman una única galería, en el orden
 * del documento, para recorrer la historia completa de la colección.
 */
const SELECTOR = 'a[data-lightbox]';

type Viewer = typeof import('./lightbox-viewer');
let viewer: Promise<Viewer> | undefined;
const load = () => (viewer ??= import('./lightbox-viewer'));

const triggerFrom = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLAnchorElement>(SELECTOR) : null;

export function initLightbox() {
  const triggers = document.querySelectorAll<HTMLAnchorElement>(SELECTOR);
  if (!triggers.length) return;
  triggers.forEach((a) => a.setAttribute('aria-haspopup', 'dialog'));

  // Precarga en la primera intención (ratón encima, toque o foco con teclado).
  const warm = (e: Event) => {
    if (triggerFrom(e.target)) void load().catch(() => undefined);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('touchstart', warm, { passive: true });
  document.addEventListener('focusin', warm);

  document.addEventListener('click', (e) => {
    const trigger = triggerFrom(e.target);
    // Respeta abrir en pestaña nueva (Ctrl/Cmd/Mayús/clic central).
    if (!trigger || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const all = Array.from(document.querySelectorAll<HTMLAnchorElement>(SELECTOR));
    load()
      .then(({ openViewer }) => openViewer(all, Math.max(0, all.indexOf(trigger))))
      // Si no se puede cargar el visor, se abre la imagen como enlace normal.
      .catch(() => window.location.assign(trigger.href));
  });
}
