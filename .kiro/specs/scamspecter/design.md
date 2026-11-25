# ScamSpecter — Design

## Overview
A zero-build static web app: `index.html` + `styles.css` + `app.js` + `scoring.js`,
plus an optional service worker (`sw.js`) and web manifest. No backend, no
bundler, no framework, no database. The app opens by double-clicking
`index.html` or by serving the folder with any static server.

## Architecture
```
index.html        — page structure, loads scoring.js then app.js
styles.css        — dark Halloween theme (ghost motif, purple/teal on near-black)
scoring.js        — the rule engine (UMD: works in browser and in Node tests)
app.js            — UI wiring: input, samples, result rendering, OCR upload
sw.js             — caches the app shell for offline repeat visits (http(s) only)
manifest.webmanifest — PWA metadata
test/run-tests.js — Node test runner, no dependencies
```

## Components

### scoring.js (the Frankenstein stitching)
Four techniques stitched into one transparent engine:
1. **URL rules** — shorteners, raw IPs, brand typosquats vs an official-domain
   table, suspicious TLDs, .apk paths, HTTP, punycode, @-tricks, subdomain
   and length heuristics. Official domains earn negative points.
2. **Message patterns** — Indonesian regex patterns for urgency, OTP/PIN,
   prize lures, free-money lures, admin-fee demands, impersonation, app-install
   pushes.
3. **Combination bonuses** — shortener+prize, OTP+link, typosquat+threat.
4. **OCR** — Tesseract.js (CDN, lazy-loaded on first screenshot upload) feeds
   recognised text into the same `analyze()` function.

`analyze(text)` returns `{ score, verdict, signals, urls }`.
`scoreUrl(url)` returns `{ score, signals }` for a single URL.
Thresholds: High ≥ 6, Medium 3–5, Low ≤ 2. Scores are clamped at 0.

### app.js (UI)
- Renders verdict badge, score bar, evidence list (each signal with points
  and plain-language detail) and per-verdict advice.
- 6 built-in samples, Ctrl/Cmd+Enter shortcut, clear button.
- OCR upload: lazy-loads Tesseract.js; on failure shows an honest message
  and falls back to pasting text.

## Correctness
- The engine is covered by `test/run-tests.js` (20 checks: 18 verdict cases
  + empty-input handling + official-domain unit check). All must pass.
- Private/local addresses are explicitly excluded from the public-scam signals.

## Design choices
- **No backend**: removes hosting cost, privacy risk and demo failure modes.
- **No build step**: the app can be deployed to any static host (GitHub Pages,
  Netlify, Vercel) by uploading the folder.
- **Spooky but serious**: dark theme and ghost motif fit Kiroween; the result
  panel is plain, high-contrast and readable, because this is a security tool.

## Honest limitations
- Heuristic only: it cannot fetch or inspect the real page behind a link, and
  a "Low risk" result is not a guarantee of safety.
- OCR needs the Tesseract.js CDN on first use (internet once); scoring itself
  needs no connection.
- Brand list covers major Indonesian brands; new or niche brands may be missed.
