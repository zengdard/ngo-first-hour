# 9:14 — The First Hour

A phone-first, bilingual (EN/FR) incident-response game for NGO training.

- **Group game:** two scenarios — clicked phishing link, stolen laptop.
- **Scenario A is a point-and-click desk:** laptop, clickable papers, phone, incident log. **Scenario B** is a stolen-device/files screen.
- **Individual game:** fraudulent bank transaction, with a four-field log sheet
  (name, time, description, affected).
- **Presenter mode** and **player mode** share the same content.
- **No questionnaire:** the app shows simulations of familiar app screens (mail, bank login, phone, messages); the presenter asks the questions and the room decides orally.
- **Score & control:** a decision tree scores recognition, containment, calls, record and communication, then shows the path and the missed branches.
- Scenario A includes a **fake bank login screen imitation**, shown only after a wrong click, to make the consequence tangible.
- **No account, no backend, no data stored.** Everything runs in the browser.
- **Legal clocks:** GDPR/CNPD 72 h; NIS2 24 h / 72 h / 1 month only if in scope; CIRCL ASAP. See [`docs/LEGAL-5-STEPS.md`](docs/LEGAL-5-STEPS.md).

## Direct URLs for QR codes

- `/#/phishing` — Scenario A, player mode
- `/#/presenter/phishing` — Scenario A, presenter mode
- `/#/laptop` — Scenario B, player mode
- `/#/presenter/laptop` — Scenario B, presenter mode
- `/#/log` — individual log sheet
- `/#/demo` — all links with copy buttons

Use these URLs to generate the QR codes for the slides.

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

## GitHub Actions

- **CI** (`.github/workflows/ci.yml`): checks the JavaScript and builds the Docker image.
- **Deploy** (`.github/workflows/deploy.yml`): on push to `main`, SSH to the VPS, pulls the repo and runs `docker compose up -d --build`.

Secrets to add in GitHub → Settings → Secrets and variables → Actions:

| Secret | Example |
|---|---|
| `VPS_HOST` | `203.0.113.10` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | private key with access to the VPS |
| `VPS_PORT` | `22` (optional) |
| `VPS_APP_DIR` | `/opt/ngo-first-hour` |
| `GAME_DOMAIN` | `game.yourdomain.org` |

The VPS must have the repository cloned at `VPS_APP_DIR`, with Docker and Compose installed.

## Data

No account, no database, no analytics, no personal data. The game state lives in
the browser (`localStorage` only for the chosen language).
