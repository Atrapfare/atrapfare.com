self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('cache').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.php',
       '/impressum.html',
       '/datenschutz.html',
       '/admin/css/styles.css',
       '/admin/bootstrap/css/bootstrap.css',
       '/admin/bootstrap/img/hamburger.svg',
       '/admin/bootstrap/js/bootstrap.js',
       '/admin/favicon/favicon.png',
       '/admin/favicon/sfavicon.png',
       '/admin/favicon/brand.png',
       '/admin/fonts/source-code-pro.woff',
       '/admin/fonts/source-code-pro.woff2',
       '/admin/img/html.webp',
       '/admin/img/intro.webp',
       '/admin/img/java.webp',
       '/admin/img/raspiardu.webp',
       '/admin/js/app.js',
       '/manifest.json',


     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
 });  