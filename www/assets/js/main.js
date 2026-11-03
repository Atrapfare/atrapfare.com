'use strict';

(() => {
  const root = document.documentElement;
  const $ = s => document.querySelector(s);

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── Language (index only; legal pages are German) ────────── */

  const btnDe = $('#btn-de'), btnEn = $('#btn-en');
  if (!btnDe) return;

  const textNodes = document.querySelectorAll('[data-de][data-en]');
  const labelNodes = document.querySelectorAll('[data-de-label][data-en-label]');

  function applyLang(next) {
    root.lang = next;
    textNodes.forEach(el => { el.textContent = el.dataset[next]; });
    labelNodes.forEach(el => { el.setAttribute('aria-label', el.dataset[`${next}Label`]); el.title = el.dataset[`${next}Label`]; });
    btnDe.classList.toggle('active', next === 'de');
    btnEn.classList.toggle('active', next === 'en');
    btnDe.setAttribute('aria-pressed', String(next === 'de'));
    btnEn.setAttribute('aria-pressed', String(next === 'en'));
  }
  const pick = next => { applyLang(next); try { localStorage.setItem('lang', next); } catch (e) {} };

  applyLang(root.lang === 'de' ? 'de' : 'en');
  btnDe.addEventListener('click', () => pick('de'));
  btnEn.addEventListener('click', () => pick('en'));
})();
