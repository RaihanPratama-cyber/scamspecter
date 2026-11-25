# Devpost Draft — ScamSpecter (Kiroween 2026)

> Status: DRAFT — repo not yet created, app not yet deployed, video not yet recorded.
> Deadline: **Sat 5 Dec 2026 05:00 WIB** (4 Dec 2026 2:00 PM PT).

## Title
ScamSpecter

## Tagline (116 characters, limit 200)
Check a suspicious link or message locally in your browser and see the evidence — nothing leaves your device.

## Category
**Frankenstein** — stitch together a chimera of technologies into one app.

## GitHub repo (TO BE CREATED — do not submit until this exists)
https://github.com/RaihanPratama-cyber/scamspecter

## Live demo URL (TO BE FILLED after deploy)
[TODO: deploy the static folder to GitHub Pages / Netlify / Vercel and paste the URL here]

## Built With
Kiro, HTML, CSS, JavaScript, Tesseract.js, PWA

## Story

### Inspiration
In Indonesia, scam links and messages arrive every day on WhatsApp, SMS and
email — fake bank notices, "you won a prize" messages, fake courier links,
and .apk files pretending to be banking apps. Many people cannot tell a real
BCA or Shopee message from a fake one, and one wrong click can empty a bank
account. Existing checkers send your messages to a server, or only work in
English. I wanted a tool that any Indonesian can use in seconds, in their own
language, without giving their private messages to anyone.

### What it does
ScamSpecter is a web app: paste a link or a message (or upload a screenshot)
and it returns a risk score — Low, Medium or High — with concrete evidence
for every point: which signals fired and why. It stitches four techniques
together: a transparent URL rule engine (shorteners, raw IPs, typosquats of
Indonesian brands, suspicious domain endings, .apk downloads, missing HTTPS),
Indonesian scam-language pattern matching (prize lures, OTP/PIN requests,
urgency and threats), screenshot OCR via Tesseract.js, and offline-first
behaviour — all scoring runs locally in the browser, no data leaves the device.
Six built-in sample cases (3 scam, 3 clean) load with one click, so the demo
never fails.

### How we built it
We built it with Kiro using spec-driven development. The spec lives in
`.kiro/specs/scamspecter/` (requirements, design, tasks), steering docs in
`.kiro/steering/` (product, tech, structure), and a test-on-save hook in
`.kiro/hooks/`. The app itself is plain HTML/CSS/JS with no build step and no
backend — the scoring engine is one file (`scoring.js`) shared by the browser
and the Node test runner, so the tested code is exactly the shipped code.
Kiro CLI 3.3.0 was installed and verified on the build machine. The demo
video and deployment use the same one-click samples as the tests.

### Challenges we ran into
The hardest part was calibration: a checker that flags everything is useless,
and one that misses real scams is dangerous. An early version flagged a home
router admin page (192.168.1.1) as suspicious — we fixed the engine to treat
private/local addresses as local, not as public scams. We also had to keep the
scoring honest: a "Low risk" result means "no strong signals found", not
"safe", and the app says so on the page.

### Accomplishments that we're proud of
- 20/20 unit tests pass, including 18 verdict cases (scam, clean and edge cases).
- All 6 built-in sample cases produce their expected verdicts.
- Zero network calls for scoring — the check works offline after first load.
- A fully transparent engine: every point in the score is explained in plain language.

### What we learned
Judges and users do not trust a black-box score. Showing the evidence — and
admitting what the tool cannot do — is the product. A narrow MVP (one feature
done well) beats a wide app with five half-working features.

### What's next for ScamSpecter
- Add a community-reported scam-pattern list (opt-in, local only).
- Add Bahasa Indonesia UI alongside the English UI.
- Keep the brand table updated as new scam patterns appear in Indonesia.

## How Kiro was used (required write-up — honest version)
- **Spec-driven development**: the project was planned as a Kiro spec first —
  `.kiro/specs/scamspecter/requirements.md` (7 requirements with acceptance
  criteria), `design.md` (architecture, components, honest limitations) and
  `tasks.md` (checked-off implementation tasks). The build followed the spec;
  the private-IP false positive found by the tests was fixed against
  Requirement 2.3.
- **Steering docs**: `.kiro/steering/product.md` (one core feature, honesty and
  privacy rules), `tech.md` (no build step, UMD engine, lazy OCR) and
  `structure.md` (repo layout, never ignore `.kiro`).
- **Hooks**: `.kiro/hooks/test-on-save.json` defines a Kiro hook that runs
  `node test/run-tests.js` whenever a JavaScript file is saved.
- **Kiro CLI**: Kiro CLI 3.3.0 was installed from the official installer
  (`curl -fsSL https://cli.kiro.dev/install | bash`) and verified with
  `kiro-cli --version`. Kiro's agentic chat was **not** used in this build
  environment because it requires the entrant's own AWS Builder ID sign-in.
  Before submitting, the entrant opens this repo in Kiro IDE / Kiro CLI,
  signs in with his own account, and runs the spec tasks with Kiro — the
  `.kiro/` artefacts are written so that workflow works out of the box.
- **No MCP / property-based testing / custom agents** were used in this build;
  the write-up does not claim them. The hook above is a real Kiro hook
  definition, not a faked execution log.

## Best Student Project details (bonus prize)
- Entrant: Raihan Pratama (solo)
- School: Politeknik Caltex Riau (Polytechnic Caltex Riau), Indonesia
- Program: D4 Teknologi Rekayasa Komputer (Computer Engineering Technology), Year 3
- Student email: raihan24trk@mahasiswa.pcr.ac.id
- LinkedIn: [NOT PROVIDED — do not invent one; add the real URL before submitting if available]

## Video — script + shot list (< 3 minutes, target ~2:20)
Narration in English (or English subtitles if recorded in Indonesian).

| Time | Shot | Script |
|---|---|---|
| 0:00–0:15 | Phone screen: a WhatsApp message "Selamat! Anda menang undian…" with a bit.ly link | "Every day in Indonesia, scam links arrive on WhatsApp. One click can empty a bank account. Meet ScamSpecter — the ghost hunter for scam links." |
| 0:15–0:45 | Browser: open the app, click the prize-lure sample | "Paste the message. ScamSpecter checks it right in your browser — nothing is uploaded. It scores the risk and shows exactly why: a shortened link hiding the destination, plus a prize lure." |
| 0:45–1:15 | Click the OTP-scam sample, then the fake APK sample | "An OTP request from a fake BCA domain: High risk, 17 points, every signal explained. A fake banking app download: High risk too." |
| 1:15–1:45 | Click a clean sample (official BCA site), then upload a screenshot | "A real BCA page: Low risk. And if you only have a screenshot, upload it — the text is read on your device and checked the same way." |
| 1:45–2:10 | Show the code: `scoring.js`, `.kiro/` folder, test run `node test/run-tests.js` → 20/20 | "Built with Kiro, spec-first. One shared scoring engine, 20 out of 20 tests passing, and the Kiro spec, steering docs and hooks live in the repo." |
| 2:10–2:20 | App logo + "Check before you click" | "ScamSpecter. Check before you click." |

## Submission checklist
- [ ] Create public GitHub repo `RaihanPratama-cyber/scamspecter` (MIT LICENSE + `/.kiro` at root)
- [ ] Deploy the static folder (GitHub Pages / Netlify / Vercel) and fill in the demo URL above
- [ ] Record the <3-min YouTube video (public) from the script above
- [ ] Fill in the LinkedIn URL above if available (Best Student details)
- [ ] Join the hackathon + submit on Devpost before Sat 5 Dec 2026 05:00 WIB
