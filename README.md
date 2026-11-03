# atrapfare.com

Personal website of Dominik Knaup. Static HTML/CSS/JS, no build step, no framework,
no external requests (fonts are self-hosted).

- `www/` – the site. `index.html` is the single page, `impressum/` and `datenschutz/` the legal pages.
- `www/assets/css/style.css` – all styling (one dark theme, Source Sans 3 self-hosted).
- `www/assets/js/main.js` – language toggle (DE/EN) on the index, footer year.
- `www/assets/js/lang.js` – runs in `<head>` of the index so the stored/browser language is applied on the first frame.
- `docker-compose.yml`, `nginx.conf` – the nginx container; routing/TLS is handled by Traefik on the host.

## Deploy

```bash
git pull
./deploy.sh
```

The web root `/var/www/atrapfare` is bind-mounted into the container, so copying the files is the whole deployment.
