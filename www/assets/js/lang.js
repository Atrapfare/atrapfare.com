/* Runs synchronously in <head> so the language is right on the first frame. Default is English; only an explicit DE/EN choice is remembered. */
(function () {
  var lang = null;
  try { lang = localStorage.getItem('lang'); } catch (e) {}
  document.documentElement.lang = lang === 'de' ? 'de' : 'en';
})();
