/**
 * Visor a pantalla completa con PhotoSwipe v5 (se carga bajo demanda desde `lightbox.ts`).
 * Teclado (flechas, Esc), gestos (deslizar, pellizcar para ampliar), foco atrapado en el
 * diálogo y devuelto a la foto correspondiente al cerrar. Respeta `prefers-reduced-motion`.
 */
import PhotoSwipe, { type SlideData } from 'photoswipe';
// Los estilos se piden como URL y se inyectan al abrir: así no bloquean el pintado de la página.
import coreCss from 'photoswipe/style.css?url';
import themeCss from './lightbox-viewer.css?url';

let stylesReady: Promise<unknown> | undefined;
function loadStyles() {
  stylesReady ??= Promise.all(
    [coreCss, themeCss].map(
      (href) =>
        new Promise<void>((resolve) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.onload = link.onerror = () => resolve();
          document.head.append(link);
        }),
    ),
  );
  return stylesReady;
}

// Iconos de trazo fino, en la línea editorial (sustituyen a los de PhotoSwipe).
const icon = (body: string, size = 24) =>
  `<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="square">${body}</svg>`;
const CLOSE = icon('<path d="M5 5l14 14M19 5L5 19"/>');
const ZOOM = icon('<path class="pswp__zoom-icn-bar-v" d="M12 5v14"/><path d="M5 12h14"/>');
// La flecha "siguiente" es la misma, volteada por el CSS de PhotoSwipe.
const ARROW = icon('<path d="M33 16H5m9-9l-9 9 9 9"/>', 36);

/** Hay un visor abierto (o abriéndose): evita dobles aperturas por clics repetidos. */
let busy = false;

function labels() {
  const d = document.getElementById('lightbox-l10n')?.dataset ?? {};
  return {
    dialog: d.dialog ?? '',
    close: d.close ?? 'Close',
    zoom: d.zoom ?? 'Zoom',
    prev: d.prev ?? 'Previous',
    next: d.next ?? 'Next',
    error: d.error ?? '',
    of: d.of ?? '/',
  };
}

function toSlide(a: HTMLAnchorElement): SlideData {
  const img = a.querySelector('img');
  return {
    src: a.href,
    srcset: a.dataset.pswpSrcset || undefined,
    width: Number(a.dataset.pswpWidth) || img?.naturalWidth || 1600,
    height: Number(a.dataset.pswpHeight) || img?.naturalHeight || 2000,
    // Miniatura ya cargada como marcador mientras llega la grande.
    msrc: img?.currentSrc || img?.src,
    alt: img?.alt ?? '',
    caption: a.dataset.caption ?? '',
  };
}

/** Precarga los estilos del visor (se llama en cuanto se descarga este módulo). */
void loadStyles();

export async function openViewer(triggers: HTMLAnchorElement[], index: number) {
  if (busy || !triggers.length) return;
  busy = true;
  await loadStyles();
  const l = labels();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pswp = new PhotoSwipe({
    dataSource: triggers.map(toSlide),
    index,
    bgOpacity: 1,
    showHideAnimationType: reduce ? 'none' : 'fade',
    showAnimationDuration: reduce ? 0 : 450,
    hideAnimationDuration: reduce ? 0 : 350,
    zoomAnimationDuration: reduce ? 0 : 333,
    // El foco se devuelve a mano (a la foto que se estaba viendo, no a la que lo abrió).
    returnFocus: false,
    trapFocus: true,
    closeTitle: l.close,
    zoomTitle: l.zoom,
    arrowPrevTitle: l.prev,
    arrowNextTitle: l.next,
    errorMsg: l.error,
    indexIndicatorSep: ` ${l.of} `,
    closeSVG: CLOSE,
    zoomSVG: ZOOM,
    arrowPrevSVG: ARROW,
    arrowNextSVG: ARROW,
    mainClass: 'pswp--editorial',
    // En pantallas pequeñas la foto ocupa todo el ancho; en grandes respira.
    paddingFn: (viewport) =>
      viewport.x >= 768 ? { top: 72, bottom: 88, left: 96, right: 96 } : { top: 56, bottom: 72, left: 0, right: 0 },
  });

  pswp.on('firstUpdate', () => {
    pswp.element?.setAttribute('aria-modal', 'true');
    if (l.dialog) pswp.element?.setAttribute('aria-label', l.dialog);
  });

  // Pie de foto bajo la imagen, anunciado de forma educada al cambiar de foto.
  pswp.on('uiRegister', () => {
    pswp.ui?.registerElement({
      name: 'caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, p) => {
        el.setAttribute('aria-live', 'polite');
        const update = () => {
          const text = (p.currSlide?.data.caption as string | undefined) ?? '';
          el.textContent = text;
          el.hidden = !text;
        };
        p.on('change', update);
        update();
      },
    });
  });

  pswp.on('destroy', () => {
    const trigger = triggers[pswp.currIndex] ?? triggers[index];
    busy = false;
    trigger?.focus();
  });

  pswp.init();
}
