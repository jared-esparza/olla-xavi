if (typeof document !== 'undefined') {
  document.documentElement.classList.add('js');
}

function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function visibleSlidesForWidth(width) {
  if (width <= 560) return 1;
  if (width <= 900) return 2;
  if (width <= 1180) return 3;
  return 5;
}

function galleryStep(index, direction, length) {
  return wrapIndex(index + direction, length);
}

function galleryKeyAction(key) {
  if (key === 'ArrowLeft') return -1;
  if (key === 'ArrowRight') return 1;
  if (key === 'Escape') return 'close';
  return 0;
}

function initMobileNavigation() {
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  if (!button || !navigation) return;

  const label = button.querySelector('.sr-only');

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Cerrar menú' : 'Abrir menú';
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setOpen(false);
  });
}

function initPlaceholderLinks() {
  document.querySelectorAll('[data-site-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#') event.preventDefault();
    });
  });
}

function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const previousButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const status = carousel.querySelector('[data-carousel-status]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!track || !slides.length || !previousButton || !nextButton || !dotsContainer) return;

  let visible = visibleSlidesForWidth(window.innerWidth);
  let index = 0;
  let timer = null;
  let touchStart = null;

  const maxIndex = () => Math.max(0, slides.length - visible);

  const createDots = () => {
    dotsContainer.replaceChildren();
    const count = maxIndex() + 1;
    for (let dotIndex = 0; dotIndex < count; dotIndex += 1) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Mostrar imágenes desde la ${dotIndex + 1}`);
      dot.addEventListener('click', () => {
        goTo(dotIndex, true);
      });
      dotsContainer.append(dot);
    }
  };

  const render = () => {
    carousel.style.setProperty('--visible-slides', visible);
    index = Math.min(index, maxIndex());
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(${-index * (slideWidth + gap)}px)`;

    [...dotsContainer.children].forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });

    if (status) {
      const end = Math.min(index + visible, slides.length);
      status.textContent = `Mostrando imágenes ${index + 1} a ${end} de ${slides.length}`;
    }
  };

  const stopAutoplay = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reduceMotion || document.hidden || maxIndex() === 0) return;
    timer = window.setInterval(() => goTo(index + 1), 4500);
  };

  function goTo(nextIndex, userInitiated = false) {
    index = wrapIndex(nextIndex, maxIndex() + 1);
    render();
    if (userInitiated) stopAutoplay();
  }

  previousButton.addEventListener('click', () => goTo(index - 1, true));
  nextButton.addEventListener('click', () => goTo(index + 1, true));

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1, true);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1, true);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      goTo(0, true);
    }
    if (event.key === 'End') {
      event.preventDefault();
      goTo(maxIndex(), true);
    }
  });

  carousel.addEventListener('touchstart', (event) => {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    touchStart = null;
    if (Math.abs(distance) < 42) return;
    goTo(index + (distance < 0 ? 1 : -1), true);
  }, { passive: true });

  window.addEventListener('resize', () => {
    const nextVisible = visibleSlidesForWidth(window.innerWidth);
    if (nextVisible !== visible) {
      visible = nextVisible;
      createDots();
    }
    render();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);

  createDots();
  render();
  startAutoplay();
}

function initGalleryModal() {
  const dialog = document.querySelector('#gallery-modal');
  const slides = [...document.querySelectorAll('[data-gallery-slide]')];
  if (!dialog || !slides.length) return;

  const image = dialog.querySelector('[data-gallery-image]');
  const counter = dialog.querySelector('[data-gallery-counter]');
  const previousButton = dialog.querySelector('.gallery-modal-prev');
  const nextButton = dialog.querySelector('.gallery-modal-next');
  const closeButton = dialog.querySelector('.gallery-modal-close');
  if (!image || !counter || !previousButton || !nextButton || !closeButton) return;

  let index = 0;
  let opener = null;
  let touchStart = null;

  const render = () => {
    const sourceImage = slides[index].querySelector('img');
    image.src = sourceImage.currentSrc || sourceImage.src;
    image.alt = sourceImage.alt;
    counter.textContent = `${index + 1} / ${slides.length} · ${sourceImage.alt}`;
  };

  const move = (direction) => {
    index = galleryStep(index, direction, slides.length);
    render();
  };

  const open = (slide, slideIndex) => {
    index = slideIndex;
    opener = slide;
    render();
    document.body.classList.add('gallery-open');
    dialog.showModal();
    closeButton.focus();
  };

  slides.forEach((slide, slideIndex) => {
    slide.addEventListener('click', () => open(slide, slideIndex));
    slide.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(slide, slideIndex);
      }
    });
  });

  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  closeButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    const action = galleryKeyAction(event.key);
    if (action === 'close') {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (action) {
      event.preventDefault();
      move(action);
    }
  });

  dialog.addEventListener('touchstart', (event) => {
    touchStart = event.changedTouches[0].clientX;
  }, { passive: true });

  dialog.addEventListener('touchend', (event) => {
    if (touchStart === null) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    touchStart = null;
    if (Math.abs(distance) < 42) return;
    move(distance < 0 ? 1 : -1);
  }, { passive: true });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('gallery-open');
    if (opener) opener.focus();
  });
}

function init() {
  initMobileNavigation();
  initPlaceholderLinks();
  initCarousel();
  initGalleryModal();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { wrapIndex, visibleSlidesForWidth, galleryStep, galleryKeyAction };
}
