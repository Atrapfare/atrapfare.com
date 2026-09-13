'use strict';

(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const scroller = $('#scroller');

  /* ── Menu bar clock ───────────────────────────────────────── */

  const clock = $('#clock');
  let lang = 'en';
  const fmts = {
    de: new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    en: new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
  };
  function tick() { clock.textContent = fmts[lang].format(new Date()).replace(',', ''); }
  tick(); setInterval(tick, 15000);
  $('#year').textContent = String(new Date().getFullYear());

  /* ── i18n ─────────────────────────────────────────────────── */

  const i18nNodes = $$('[data-de][data-en]');

  function applyLang(next) {
    lang = next;
    i18nNodes.forEach(el => { el.textContent = el.dataset[next]; });
    root.lang = next;
    $('#btn-de').classList.toggle('active', next === 'de');
    $('#btn-en').classList.toggle('active', next === 'en');
    $('#btn-de').setAttribute('aria-pressed', String(next === 'de'));
    $('#btn-en').setAttribute('aria-pressed', String(next === 'en'));
    try { localStorage.setItem('lang', next); } catch (e) {}
    tick();
  }
  function setLang(next) {
    if (next === lang) return;
    if (reduceMotion) { applyLang(next); return; }
    const body = $('.window-body');
    body.classList.remove('lang-fade'); void body.offsetWidth; body.classList.add('lang-fade');
    setTimeout(() => applyLang(next), 160);
    body.addEventListener('animationend', () => body.classList.remove('lang-fade'), { once: true });
  }
  (function initLang() {
    let stored = null;
    try { stored = localStorage.getItem('lang'); } catch (e) {}
    const initial = stored === 'de' || stored === 'en' ? stored
      : (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';
    if (initial !== 'en') applyLang(initial);
    $('#btn-de').addEventListener('click', () => setLang('de'));
    $('#btn-en').addEventListener('click', () => setLang('en'));
  })();

  /* ── Theme ────────────────────────────────────────────────── */

  const themeBtn = $('#theme-toggle');
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const commit = () => { root.setAttribute('data-theme', next); try { localStorage.setItem('theme', next); } catch (e) {} };
    if (!document.startViewTransition || reduceMotion) { commit(); return; }
    const r = themeBtn.getBoundingClientRect();
    root.style.setProperty('--vx', `${r.left + r.width / 2}px`);
    root.style.setProperty('--vy', `${r.top + r.height / 2}px`);
    document.startViewTransition(commit);
  });

  /* ── CV dropdown ──────────────────────────────────────────── */

  const cvToggle = $('#cv-toggle'), cvMenu = $('#cv-menu');
  const closeCv = () => { cvMenu.classList.remove('open'); cvToggle.setAttribute('aria-expanded', 'false'); };
  cvToggle.addEventListener('click', e => { e.stopPropagation(); const o = cvMenu.classList.toggle('open'); cvToggle.setAttribute('aria-expanded', String(o)); });
  cvMenu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', closeCv);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCv(); });

  /* ── Window controls (traffic lights) ─────────────────────── */

  const win = $('#window'), note = $('#closed-note'), dockHome = $('#dock-home');
  const setRunning = on => dockHome.classList.toggle('running', on);
  function restore() {
    win.classList.remove('closed', 'minimized');
    note.hidden = true;
    setRunning(true);
    dockHome.classList.remove('bounce'); void dockHome.offsetWidth; dockHome.classList.add('bounce');
  }
  $('#win-close').addEventListener('click', () => { win.classList.add('closed'); note.hidden = false; setRunning(false); });
  $('#win-min').addEventListener('click', () => { win.classList.add('minimized'); });
  $('#win-zoom').addEventListener('click', () => { win.classList.toggle('zoomed'); });
  $('#win-reopen').addEventListener('click', restore);
  dockHome.addEventListener('click', () => {
    if (win.classList.contains('closed') || win.classList.contains('minimized')) restore();
    else scroller.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && (win.classList.contains('closed') || win.classList.contains('minimized'))) restore();
  });

  /* ── Scrolling inside the window ──────────────────────────── */

  const progress = $('#progress');
  const menuLinks = $$('.menu-items a');
  const sections = menuLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;

  function onScroll() {
    const max = scroller.scrollHeight - scroller.clientHeight;
    progress.style.transform = `scaleX(${max > 0 ? scroller.scrollTop / max : 0})`;
    const top = scroller.getBoundingClientRect().top;
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top - top <= scroller.clientHeight * 0.35) current = s;
    menuLinks.forEach(a => a.classList.toggle('active', !!current && a.getAttribute('href') === `#${current.id}`));
    updateTimeline();
  }
  scroller.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });

  // Anchor links in the menu bar target the inner scroller.
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (win.classList.contains('closed') || win.classList.contains('minimized')) restore();
    const y = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
    scroller.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  /* ── Reveal on scroll ─────────────────────────────────────── */

  const revealEls = $$('.reveal');
  revealEls.forEach(el => {
    const sib = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
    el.style.setProperty('--i', sib.indexOf(el));
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { root: scroller, rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ── Timeline ─────────────────────────────────────────────── */

  const timeline = $('#timeline'), tlItems = $$('.tl-item', timeline);
  function updateTimeline() {
    const sr = scroller.getBoundingClientRect();
    const r = timeline.getBoundingClientRect();
    const focus = sr.top + sr.height * 0.75;
    timeline.style.setProperty('--tl', reduceMotion ? 1 : clamp((focus - r.top) / r.height, 0, 1).toFixed(3));
    tlItems.forEach(li => li.classList.toggle('lit', reduceMotion || li.getBoundingClientRect().top + 18 <= focus));
  }

  /* ── Copy e-mail ──────────────────────────────────────────── */

  const copyBtn = $('#copy-email');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('dominik@knaup.de');
      copyBtn.classList.add('copied');
      copyBtn.textContent = lang === 'de' ? 'Kopiert ✓' : 'Copied ✓';
      setTimeout(() => { copyBtn.classList.remove('copied'); copyBtn.textContent = copyBtn.dataset[lang]; }, 1600);
    } catch (e) { window.location.href = 'mailto:dominik@knaup.de'; }
  });

  onScroll();
})();
