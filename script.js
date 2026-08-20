// Mobile navigation toggle
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

// Sticky header background/blur on scroll
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

// Smooth scroll for anchor nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// Scroll-reveal animations
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}
