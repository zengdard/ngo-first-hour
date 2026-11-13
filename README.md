# 9:14 — The First Hour

A phone-first, bilingual (EN/FR) incident-response game for NGO training.

- **Group game:** two scenarios — clicked phishing link, stolen laptop.
- **Individual game:** fraudulent bank transaction, with a four-field log sheet
  (name, time, description, affected).
- **Presenter mode** and **player mode** share the same content.
- **No account, no backend, no data stored.** Everything runs in the browser.

## Local preview

```bash
cd public
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on a VPS with a subdomain

1. Point a DNS record (A/AAAA) for your subdomain to the VPS.
2. Open ports 80 and 443.
3. Set the domain and start:

```bash
GAME_DOMAIN=game.yourdomain.org docker compose up -d --build
```

Caddy obtains and renews the HTTPS certificate automatically.

### If you already have Traefik, Nginx or another reverse proxy

Remove the `caddy` service from `docker-compose.yml`, expose the game on localhost:

```yaml
  game:
    build: .
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:80"
```

Then proxy `https://game.yourdomain.org` to `http://127.0.0.1:8080`.

### QR code

```bash
qrencode -o qr.png "https://game.yourdomain.org"
```

## Structure

```text
public/
  index.html      entry point
  styles.css      mobile-first styles + print sheet
  content.js      all EN/FR content
  app.js          game logic and views
Dockerfile        static Nginx image
nginx.conf        static server config
docker-compose.yml
Caddyfile
```

## Edit the content

- **Translations and scenarios:** `public/content.js` (`en` and `fr` objects).
- **Logic, scoring, views:** `public/app.js`.
- **Look and print layout:** `public/styles.css`.

The log sheet is printable from the individual game result screen
(“Print / save as PDF”).

## Data

No account, no database, no analytics, no personal data. The game state lives in
the browser (`localStorage` only for the chosen language).
