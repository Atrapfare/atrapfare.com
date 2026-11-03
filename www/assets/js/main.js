'use strict';

(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const store = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── Theme ────────────────────────────────────────────────── */

  const themeBtn = $('#theme-toggle');
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const commit = () => { root.setAttribute('data-theme', next); store('theme', next); };
    if (!document.startViewTransition || reduceMotion) commit();
    else document.startViewTransition(commit);
  });

  /* ── Language (index only) ────────────────────────────────── */

  if (!root.hasAttribute('data-i18n')) return;

  const textNodes = document.querySelectorAll('[data-de][data-en]');
  const btnDe = $('#btn-de'), btnEn = $('#btn-en');
  let lang = root.lang === 'de' ? 'de' : 'en';

  function applyLang(next) {
    lang = next;
    root.lang = next;
    textNodes.forEach(el => { el.textContent = el.dataset[next]; });
    themeBtn.setAttribute('aria-label', themeBtn.dataset[`${next}Label`]);
    btnDe.classList.toggle('active', next === 'de');
    btnEn.classList.toggle('active', next === 'en');
    btnDe.setAttribute('aria-pressed', String(next === 'de'));
    btnEn.setAttribute('aria-pressed', String(next === 'en'));
  }
  applyLang(lang);
  btnDe.addEventListener('click', () => { applyLang('de'); store('lang', 'de'); });
  btnEn.addEventListener('click', () => { applyLang('en'); store('lang', 'en'); });

  /* ── Copy e-mail ──────────────────────────────────────────── */

  const copyBtn = $('#copy-email');
  let copyTimer;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('dominik@knaup.de');
      copyBtn.classList.add('done');
      copyBtn.textContent = lang === 'de' ? 'Kopiert' : 'Copied';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copyBtn.classList.remove('done'); copyBtn.textContent = copyBtn.dataset[lang]; }, 1600);
    } catch (e) { window.location.href = 'mailto:dominik@knaup.de'; }
  });
})();
