# atrapfare.com

Personal website of Dominik Knaup. Static HTML/CSS/JS, no build step, no framework,
no external requests (fonts are self-hosted).

- `www/` – the site. `index.html` is the single page, `impressum/` and `datenschutz/` the legal pages.
- `www/assets/css/style.css` – all styling, light and dark theme via `data-theme`.
- `www/assets/js/main.js` – theme toggle on every page; language toggle (DE/EN) and copy-e-mail on the index.
- `www/assets/js/theme.js` – runs in `<head>` so theme and language are right on the first frame (language only on pages marked `data-i18n`).
- `docker-compose.yml`, `nginx.conf` – the nginx container; routing/TLS is handled by Traefik on the host.

## Deploy

```bash
git pull
./deploy.sh
```

The web root `/var/www/atrapfare` is bind-mounted into the container, so copying the files is the whole deployment.
