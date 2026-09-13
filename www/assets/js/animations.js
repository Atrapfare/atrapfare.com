'use strict';

let currentLang = 'en';

function setLang(lang) {
  if (lang === currentLang) return;
  currentLang = lang;

  document.getElementById('btn-de').classList.toggle('active', lang === 'de');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.documentElement.lang = lang;

  const hero = document.querySelector('.hero');
  hero.classList.add('transitioning');
  hero.classList.remove('visible');

  setTimeout(() => {
    document.querySelectorAll('[data-de][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    hero.classList.remove('transitioning');
    hero.classList.add('visible');
  }, 160);
}

document.addEventListener('DOMContentLoaded', () => {
  // Language toggle
  document.getElementById('btn-de').addEventListener('click', () => setLang('de'));
  document.getElementById('btn-en').addEventListener('click', () => setLang('en'));

  // CV dropdown
  const cvToggle = document.getElementById('cv-toggle');
  const cvMenu   = document.getElementById('cv-menu');

  cvToggle.addEventListener('click', e => {
    e.stopPropagation();
    cvMenu.classList.toggle('open');
  });
  cvMenu.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => cvMenu.classList.remove('open'));

  // Timeline — trigger after fade-in completes
  setTimeout(() => document.getElementById('timeline')?.classList.add('animated'), 700);

  // Unlock language transition after CSS entry animations finish
  setTimeout(() => {
    document.querySelectorAll('.hero > *').forEach(el => {
      el.style.animation = 'none';
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    document.querySelector('.hero').classList.add('visible');
  }, 1200);
});
