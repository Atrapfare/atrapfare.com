/* Runs synchronously in <head> so theme and language are right on the first frame. */
(function () {
  var root = document.documentElement;
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  var theme = get('theme');
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.setAttribute('data-theme', theme);

  // Only bilingual pages (marked with data-i18n) switch language; legal pages stay German.
  if (root.hasAttribute('data-i18n')) {
    var lang = get('lang');
    if (lang !== 'de' && lang !== 'en') lang = (navigator.language || '').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
    root.lang = lang;
  }
})();
