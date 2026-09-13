'use strict';
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const commit = () => { root.setAttribute('data-theme', next); try { localStorage.setItem('theme', next); } catch (e) {} };
    if (!document.startViewTransition || reduce) { commit(); return; }
    const r = btn.getBoundingClientRect();
    root.style.setProperty('--vx', `${r.left + r.width / 2}px`);
    root.style.setProperty('--vy', `${r.top + r.height / 2}px`);
    document.startViewTransition(commit);
  });
  const win = document.getElementById('window');
  const home = () => { win.classList.add('closed'); setTimeout(() => { window.location.href = '/'; }, 300); };
  document.getElementById('win-close').addEventListener('click', home);
  document.getElementById('win-min').addEventListener('click', home);
  document.getElementById('win-zoom').addEventListener('click', () => win.classList.toggle('zoomed'));
})();
