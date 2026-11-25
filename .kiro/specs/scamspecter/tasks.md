# ScamSpecter — Implementation Tasks

- [x] 1. Create the project layout and scoring engine
  - [x] 1.1 Create `scoring.js` with URL rules, Indonesian message patterns and combination bonuses
  - [x] 1.2 Write `test/run-tests.js` with 18 verdict cases + empty-input + official-domain checks
  - [x] 1.3 Run the tests, fix the private-IP false positive, confirm 20/20 pass
- [x] 2. Build the web app UI
  - [x] 2.1 Create `index.html` (input, samples, result panel, how-it-works)
  - [x] 2.2 Create `styles.css` (dark Halloween theme, readable result panel)
  - [x] 2.3 Create `app.js` (check flow, samples, evidence rendering, OCR upload with fallback)
  - [x] 2.4 Add `sw.js` service worker and `manifest.webmanifest` for offline repeat visits
- [x] 3. Verify the app end to end
  - [x] 3.1 Serve the folder locally and confirm all assets return HTTP 200
  - [x] 3.2 Confirm all 6 built-in samples produce their expected verdicts
  - [x] 3.3 Confirm no console-blocking errors in the core flow (scoring path has no network calls)
- [x] 4. Write the Kiro spec-driven artefacts
  - [x] 4.1 `.kiro/specs/scamspecter/requirements.md`, `design.md`, `tasks.md`
  - [x] 4.2 `.kiro/steering/product.md`, `tech.md`, `structure.md`
  - [x] 4.3 `.kiro/hooks/test-on-save.json` (run tests on save)
  - [x] 4.4 Install and verify Kiro CLI 3.3.0 (binary only; agentic chat needs the entrant's own AWS Builder ID sign-in — not done here)
- [x] 5. Write submission artefacts
  - [x] 5.1 `README.md` (honest: what works, limits, how to run/test)
  - [x] 5.2 `LICENSE` (MIT) and `.gitignore` (does NOT exclude `.kiro`)
  - [x] 5.3 `submission/DEVPOST-DRAFT.md` (story, tags, student details, Kiro write-up, video script)
  - [x] 5.4 `docs/TEST-REPORT.md` (exact test results)

## Remaining work for the entrant (NOT done by this build)
- [ ] Open the repo in Kiro IDE / Kiro CLI and run the spec tasks with Kiro (sign in with your own AWS Builder ID), so the Kiro-usage write-up is fully lived, not just specified.
- [ ] Create the public GitHub repo `RaihanPratama-cyber/scamspecter` and push this folder.
- [ ] Deploy the static folder to GitHub Pages / Netlify / Vercel and fill in the live demo URL.
- [ ] Record the <3-minute YouTube demo video using the script in `submission/DEVPOST-DRAFT.md`.
- [ ] Submit on Devpost before Sat 5 Dec 2026 05:00 WIB.
