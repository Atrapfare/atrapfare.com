/* Runs synchronously in <head> so the language is right on the first frame (no English flash for German visitors). */
(function () {
  var root = document.documentElement;
  var lang = null;
  try { lang = localStorage.getItem('lang'); } catch (e) {}
  if (lang !== 'de' && lang !== 'en') lang = (navigator.language || '').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  root.lang = lang;
})();
