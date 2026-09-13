# atrapfare.com

Personal website of Dominik Knaup. Static HTML/CSS/JS, no build step, no framework,
no external requests (fonts are self-hosted).

- `www/` – the site. `index.html` is the single page, `impressum/` and `datenschutz/` the legal pages.
- `www/assets/css/style.css` – all styling, light and dark theme via `data-theme`.
- `www/assets/js/main.js` – language toggle (DE/EN), theme toggle, window controls, scroll effects.
- `www/assets/js/theme.js` – runs in `<head>` so the stored theme is painted on the first frame.
- `docker-compose.yml`, `nginx.conf` – the nginx container; routing/TLS is handled by Traefik on the host.

## Deploy

```bash
git pull
./deploy.sh
```

The web root `/var/www/atrapfare` is bind-mounted into the container, so copying the files is the whole deployment.
