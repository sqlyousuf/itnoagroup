const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
    } else {
      siteNav.classList.add('open');
    }
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && siteNav.classList.contains('open')) {
    siteNav.classList.remove('open');
  }
});
