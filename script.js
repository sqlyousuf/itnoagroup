const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGsap = typeof window.gsap !== 'undefined';
const hasScrollTrigger = hasGsap && typeof window.ScrollTrigger !== 'undefined';

if (hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------- Preloader ---------- */

const preloader = document.getElementById('preloader');
const preloaderCount = document.getElementById('preloaderCount');

function hidePreloader() {
  if (!preloader || preloader.classList.contains('is-hidden')) return;
  preloader.style.animation = 'none';
  preloader.classList.add('is-hidden');
}

if (preloader) {
  if (reduceMotion) {
    hidePreloader();
  } else {
    if (preloaderCount && hasGsap) {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.6,
        ease: 'power1.inOut',
        onUpdate: () => {
          preloaderCount.textContent = Math.round(counter.val) + '%';
        },
      });
    }
    window.addEventListener('load', () => {
      window.setTimeout(hidePreloader, 700);
    });
    window.setTimeout(hidePreloader, 2600);
  }
}

/* ---------- Mobile navigation ---------- */

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

function closeNav() {
  if (siteNav && siteNav.classList.contains('open')) {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    closeNav();
  }
});

/* ---------- Sticky header state ---------- */

const header = document.getElementById('site-header');

function updateHeaderState() {
  if (!header) return;
  if (window.scrollY > 12) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

/* ---------- Lenis smooth scroll + GSAP ScrollTrigger sync ---------- */

let lenis = null;

if (!reduceMotion && typeof window.Lenis !== 'undefined') {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });

  if (hasScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/* ---------- Smooth anchor scrolling ---------- */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -20 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
    window.setTimeout(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 600);
  });
});

/* ---------- Counters ---------- */

function setCounterFinal(el) {
  const target = parseFloat(el.dataset.count || '0');
  const suffix = el.dataset.suffix || '';
  el.textContent = target + suffix;
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count || '0');
  const suffix = el.dataset.suffix || '';
  const state = { val: 0 };
  el.textContent = '0' + suffix;
  gsap.to(state, {
    val: target,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(state.val) + suffix;
    },
  });
}

if (hasGsap && !reduceMotion) {
  document.querySelectorAll('.hero-trust-number').forEach((el) => animateCounter(el));

  if (hasScrollTrigger) {
    document.querySelectorAll('.stat-number').forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => animateCounter(el),
      });
    });
  }
}

/* ---------- Hero entrance ---------- */

if (hasGsap && !reduceMotion) {
  const heroTimeline = gsap.timeline({ delay: 0.3, defaults: { ease: 'power4.out' } });
  heroTimeline
    .set('.hero-heading .line-inner, .hero-lede .line-inner', { yPercent: 110 })
    .set('.hero-eyebrow, .hero-actions, .hero-trust', { autoAlpha: 0, y: 24 })
    .to('.hero-heading .line-inner', { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.1)
    .to('.hero-lede .line-inner', { yPercent: 0, duration: 1 }, 0.35)
    .to('.hero-eyebrow', { autoAlpha: 1, y: 0, duration: 0.8 }, 0)
    .to('.hero-actions', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55)
    .to('.hero-trust', { autoAlpha: 1, y: 0, duration: 0.8 }, 0.7);
}

/* ---------- Scroll reveals ---------- */

if (hasScrollTrigger && !reduceMotion) {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.set(el, { autoAlpha: 0, y: 36 });
    gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

/* ---------- Clip-path image reveals ---------- */

if (hasScrollTrigger && !reduceMotion) {
  gsap.utils.toArray('[data-clip-reveal]').forEach((el) => {
    gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
    gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.3,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/* ---------- Parallax ---------- */

if (hasScrollTrigger && !reduceMotion) {
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const strength = parseFloat(el.dataset.parallaxStrength || '12');
    gsap.to(el, {
      yPercent: strength,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ---------- Custom cursor ---------- */

if (finePointer && !reduceMotion && hasGsap) {
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.documentElement.classList.add('has-cursor');
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3' });
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3' });

    window.addEventListener('mousemove', (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
    });

    const hoverTargets = document.querySelectorAll('a, button, .service-row');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  }
}

/* ---------- Magnetic buttons ---------- */

if (finePointer && !reduceMotion && hasGsap) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

    el.addEventListener('mousemove', (event) => {
      const bounds = el.getBoundingClientRect();
      const relX = event.clientX - bounds.left - bounds.width / 2;
      const relY = event.clientY - bounds.top - bounds.height / 2;
      moveX(relX * 0.35);
      moveY(relY * 0.5);
    });

    el.addEventListener('mouseleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}

/* ---------- Fallback: ensure counters are correct if animation never ran ---------- */

if (!hasGsap || reduceMotion) {
  document.querySelectorAll('.hero-trust-number, .stat-number').forEach(setCounterFinal);
}
