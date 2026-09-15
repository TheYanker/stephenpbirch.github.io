/* Builds a project detail page from PROJECTS (projects.js) and the ?p= slug. */

(function renderProject() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('p');
  const index = PROJECTS.findIndex(p => p.slug === slug);
  const project = PROJECTS[index];
  const host = document.getElementById('projectRoot');

  // Every project page is gated behind a work-in-progress cover for now.
  showWipCover(project ? project.name : null);

  // Unknown or missing slug: say so rather than rendering an empty shell.
  if (!project) {
    document.title = 'Project not found — Stephen Birch';
    host.innerHTML =
      '<div class="project-hero">' +
        '<a class="back-link" href="index.html#projects">← All projects</a>' +
        '<h1>Project not found</h1>' +
        '<p class="project-summary">That link doesn’t match any project. ' +
          'Head back to the projects list to pick one.</p>' +
      '</div>';
    return;
  }

  document.title = project.name + ' — Stephen Birch';

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ── Hero ── */
  const hero = el('div', 'project-hero');
  const back = el('a', 'back-link', '← All projects');
  back.href = 'index.html#projects';
  hero.appendChild(back);
  hero.appendChild(el('h1', null, project.name));

  const meta = el('div', 'project-hero-meta');
  const status = el('span', 'project-status' + (project.status === 'Ongoing' ? ' active' : ''),
    project.status === 'Ongoing' ? '● Ongoing' : project.status);
  meta.appendChild(status);
  meta.appendChild(el('span', 'project-term', project.term));
  (project.tags || []).forEach(t => meta.appendChild(el('span', 'tag', t)));
  hero.appendChild(meta);
  hero.appendChild(el('p', 'project-summary', project.summary));
  host.appendChild(hero);

  /* ── Media gallery ── */
  const media = project.media || [];
  if (media.length) {
    const sec = el('section', 'project-section reveal');
    sec.appendChild(el('h2', null, 'Gallery'));
    const grid = el('div', 'gallery');
    media.forEach(item => grid.appendChild(galleryItem(item)));
    sec.appendChild(grid);
    host.appendChild(sec);
  }

  /* ── Prose sections ── */
  (project.sections || []).forEach(s => {
    const sec = el('section', 'project-section reveal');
    sec.appendChild(el('h2', null, s.title));
    (s.body || []).forEach(p => sec.appendChild(el('p', null, p)));
    if (s.list && s.list.length) {
      const ul = el('ul', 'bullet-list');
      s.list.forEach(li => ul.appendChild(el('li', null, li)));
      sec.appendChild(ul);
    }
    host.appendChild(sec);
  });

  /* ── Previous / next project ── */
  const nav = el('nav', 'project-nav');
  const prev = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];
  const navCard = (p, dir, cls) => {
    const a = el('a', cls);
    a.href = 'project.html?p=' + encodeURIComponent(p.slug);
    a.appendChild(el('div', 'dir', dir));
    a.appendChild(el('div', 'name', p.name));
    return a;
  };
  if (prev) nav.appendChild(navCard(prev, '← Previous', 'prev'));
  if (next) nav.appendChild(navCard(next, 'Next →', 'next'));
  if (nav.children.length) host.appendChild(nav);

  if (next) buildNextFab(next, nav);

  observeReveals(host);

  /* Small floating shortcut to the next project, pinned to the right edge.
     It steps aside once the footer nav is in view so the two don't stack up. */
  function buildNextFab(nextProject, footerNav) {
    const fab = el('a', 'project-fab');
    fab.href = 'project.html?p=' + encodeURIComponent(nextProject.slug);
    fab.setAttribute('aria-label', 'Next project: ' + nextProject.name);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path d="M5 12h14M13 6l6 6-6 6"/>';
    fab.appendChild(svg);

    const text = el('div', 'fab-text');
    text.appendChild(el('span', 'fab-dir', 'Next'));
    text.appendChild(el('span', 'fab-name', nextProject.name));
    fab.appendChild(text);

    (document.querySelector('.content') || document.body).appendChild(fab);

    // Once the footer nav scrolls into view the floating copy is redundant.
    if (footerNav && 'IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(e => fab.classList.toggle('is-hidden', e.isIntersecting));
      }, { rootMargin: '0px 0px -80px 0px' }).observe(footerNav);
    }
  }

  /* ── Gallery item builders ── */
  function galleryItem(item) {
    const card = el('div', 'gallery-item' + (item.wide ? ' wide' : ''));
    card.appendChild(frameFor(item));
    if (item.caption) card.appendChild(el('div', 'gallery-caption', item.caption));
    return card;
  }

  function frameFor(item) {
    if (item.type === 'video') return videoFrame(item);
    if (item.type === 'youtube') return youtubeFrame(item);
    return imageFrame(item);
  }

  function imageFrame(item) {
    // Images open in a lightbox, so the frame is a real button for keyboard use.
    const frame = el('button', 'gallery-frame');
    frame.type = 'button';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    // A file that isn't there yet becomes a labelled placeholder, not a
    // broken-image icon — and stops being clickable.
    img.addEventListener('error', () => {
      img.remove();
      frame.disabled = true;
      frame.style.cursor = 'default';
      frame.appendChild(placeholder(item.src));
    });
    frame.appendChild(img);
    frame.addEventListener('click', () => openLightbox(item.src, item.caption || ''));
    return frame;
  }

  function videoFrame(item) {
    const frame = el('div', 'gallery-frame');
    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    if (item.poster) video.poster = item.poster;
    video.addEventListener('error', () => {
      video.remove();
      frame.appendChild(placeholder(item.src));
    });
    frame.appendChild(video);
    return frame;
  }

  function youtubeFrame(item) {
    const frame = el('div', 'gallery-frame');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(item.id);
    iframe.title = item.caption || 'Project video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    return frame;
  }

  function placeholder(src) {
    const box = el('div', 'gallery-missing');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
      '<circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>';
    box.appendChild(svg);
    box.appendChild(el('span', null, 'Media coming soon'));
    box.appendChild(el('span', null, src.split('/').pop()));
    return box;
  }

  /* ── Work-in-progress cover ──
     Sits above everything and locks scrolling, so the page reads as unfinished
     rather than half-built. The content below is left intact in the DOM — this
     hides it visually, it does not protect it. Delete this call (and the
     showWipCover function) to open the project pages back up. */
  function showWipCover(name) {
    const mk = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    };

    const cover = mk('div', 'wip-overlay');
    cover.setAttribute('role', 'dialog');
    cover.setAttribute('aria-modal', 'true');
    cover.setAttribute('aria-label', 'Work in progress');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>' +
      '<path d="M12 9v4"/><path d="M12 17h.01"/>';
    cover.appendChild(svg);

    cover.appendChild(mk('div', 'wip-title', 'Work in Progress'));
    if (name) cover.appendChild(mk('div', 'wip-project', name));
    cover.appendChild(mk('p', 'wip-sub',
      'This project page is still being built. The write-up and media aren’t ' +
      'ready to show yet — check back soon.'));

    const back = mk('a', 'wip-back', '← Back to the site');
    back.href = 'index.html';
    cover.appendChild(back);

    document.body.appendChild(cover);
    // Lock both: body alone still leaves the root scrollable in some browsers.
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Keep the covered page out of the tab order and off screen readers.
    const content = document.querySelector('.content');
    if (content) {
      content.setAttribute('aria-hidden', 'true');
      if ('inert' in HTMLElement.prototype) content.inert = true;
    }
    back.focus();
  }
})();

/* ── Lightbox ── */
function openLightbox(src, alt) {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!box || !img) return;
  img.src = src;
  img.alt = alt;
  box.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lightboxClose').focus();
}

(function lightboxWiring() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const close = () => {
    box.hidden = true;
    document.getElementById('lightboxImg').src = '';
    document.body.style.overflow = '';
  };
  document.getElementById('lightboxClose').addEventListener('click', close);
  // Clicking the backdrop (but not the image itself) closes it.
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !box.hidden) close();
  });
})();
