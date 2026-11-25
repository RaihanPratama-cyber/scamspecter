# ScamSpecter 👻 — Ghost Hunter for Scam Links

**Kiroween 2026 · Frankenstein category · by Raihan Pratama (Politeknik Caltex Riau)**

Paste a suspicious link or message — ScamSpecter checks it **locally in your
browser** and explains the risk with evidence. Nothing leaves your device.

## Live demo

👻 **[raihanpratama-cyber.github.io/scamspecter](https://raihanpratama-cyber.github.io/scamspecter/)** — no install, no account, works offline after first visit.

## What it does (one core feature)

Paste a link or a message (or upload a screenshot) → risk score
**Low / Medium / High** + the exact signals that fired + what to do next.

Frankenstein stitching — four techniques in one app:
1. **URL rule engine** — shorteners, raw IPs, typosquats of Indonesian brands
   (BCA, BRI, DANA, Shopee, …), suspicious TLDs, `.apk` downloads, missing
   HTTPS, punycode, `@` tricks.
2. **Indonesian scam-message patterns** — prize lures, OTP/PIN requests,
   urgency/threat language, "admin fee" demands, impersonation claims.
3. **Screenshot OCR** — Tesseract.js reads a screenshot on your device, then
   the same rules check the text.
4. **Offline-first** — all scoring runs locally. No account, no upload, no
   tracking. A service worker caches the app shell for offline repeat visits.

## Run it

No build step, no backend. Any of these works:

```bash
# Option 1: just open it
open index.html            # double-click also works

# Option 2: serve it locally
python3 -m http.server 8000
# then open http://localhost:8000
```

## Test it

```bash
node test/run-tests.js
# 20/20 tests passed (18 verdict cases + empty-input + official-domain check)
```

The app also has **6 built-in sample cases** (3 scam, 3 clean) — one click each,
so the demo never depends on typing or the network.

## Honest limitations

- **Heuristic, not a guarantee.** ScamSpecter cannot fetch or inspect the real
  page behind a link. "Low risk" means *no strong scam signals were found* —
  stay alert anyway, especially if anything asks for an OTP, PIN or payment.
- **OCR needs internet once.** The Tesseract.js library loads from a CDN on
  first screenshot use. If it cannot load, the app says so and asks you to
  paste the text instead. Scoring itself needs no connection.
- **Brand list is finite.** It covers major Indonesian brands; new or niche
  brands may be missed. The rules are transparent — see `scoring.js`.

## How Kiro was used

The project was built with Kiro's spec-driven workflow: requirements, design
and tasks live in `.kiro/specs/scamspecter/`, steering docs in
`.kiro/steering/`, and a test-on-save hook in `.kiro/hooks/`.
Kiro CLI 3.3.0 was installed and verified on the build machine
(`kiro-cli --version` → `kiro-cli 3.3.0`). Kiro's agentic chat was **not**
used in this build environment because it requires the entrant's own
AWS Builder ID sign-in; the entrant opens this repo in Kiro IDE / Kiro CLI
and runs the spec tasks with Kiro before submitting. See
`submission/DEVPOST-DRAFT.md` for the full write-up.

## License

MIT — see `LICENSE`.
