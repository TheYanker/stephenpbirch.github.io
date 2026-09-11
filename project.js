/* Builds a project detail page from PROJECTS (projects.js) and the ?p= slug. */

(function renderProject() {
  const params = new URLSearchParams(location.search);
  const slug = params.get('p');
  const index = PROJECTS.findIndex(p => p.slug === slug);
  const project = PROJECTS[index];
  const host = document.getElementById('projectRoot');

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

  observeReveals(host);

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
