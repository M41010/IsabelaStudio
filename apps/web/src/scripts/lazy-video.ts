/**
 * Vídeos diferidos: no se descarga nada hasta que el vídeo entra en pantalla;
 * se pausa al salir. Con `prefers-reduced-motion` no arranca solo (el botón permite reproducirlo).
 * El botón de pausa recuerda la elección del usuario durante la visita.
 */
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function load(video: HTMLVideoElement) {
  if (video.dataset.loaded) return;
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => {
    s.src = s.dataset.src!;
  });
  video.dataset.loaded = '1';
  video.load();
}

function setup(root: HTMLElement) {
  const video = root.querySelector('video');
  const toggle = root.querySelector<HTMLButtonElement>('.mux-video__toggle');
  if (!video) return;

  let userPaused = reducedMotion();
  const label = toggle?.querySelector('.visually-hidden');

  const sync = () => {
    const paused = video.paused;
    root.classList.toggle('is-playing', !paused);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(paused));
      if (label) label.textContent = (paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause) ?? '';
    }
  };
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);

  const play = () => {
    load(video);
    video.play().catch(() => sync());
  };

  if (toggle) {
    toggle.hidden = false;
    sync();
    toggle.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        play();
      } else {
        userPaused = true;
        video.pause();
      }
    });
  }

  new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        if (!userPaused) play();
      } else if (!video.paused) {
        video.pause();
      }
    },
    { rootMargin: '200px 0px' },
  ).observe(root);
}

export function initLazyVideos() {
  document.querySelectorAll<HTMLElement>('[data-lazy-video]:not([data-ready])').forEach((el) => {
    el.dataset.ready = '';
    setup(el);
  });
}
