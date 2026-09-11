/* Shared behavior for every page: theme toggle, scroll reveal, nav highlight. */

(function themeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    } else {
      root.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    }
  });
})();

/* Reveal-on-scroll. Call again after injecting new .reveal elements. */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observeReveals(scope) {
  (scope || document).querySelectorAll('.reveal:not(.visible)')
    .forEach(el => revealObserver.observe(el));
}
observeReveals();

/* Highlight the nav link for the section currently in view (home page only). */
(function navHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  });
})();
