# ScamSpecter — Test Report

Date: 14 Nov 2026. Runner: `node test/run-tests.js` (plain Node, no dependencies).

## Unit tests: 20/20 passed

| # | Case | Expected | Got (score) |
|---|---|---|---|
| 1 | Typosquat BCA login page | high | high (8) |
| 2 | APK download from fake BCA domain | high | high (8) |
| 3 | Raw IP login page over HTTP | high | high (8) |
| 4 | Prize lure + shortened link | high | high (7) |
| 5 | OTP phishing posing as BCA | high | high (17) |
| 6 | Typosquat Tokopedia prize page | high | high (7) |
| 7 | Fake DANA free-balance lure | high | high (11) |
| 8 | Official BCA website | low | low (0) |
| 9 | Google search link | low | low (0) |
| 10 | Official Shopee product page | low | low (0) |
| 11 | Plain delivery message, no link | low | low (0) |
| 12 | GitHub project page | low | low (0) |
| 13 | Official PLN page with urgency wording | low | low (0) |
| 14 | Shopee free-shipping promo on official domain | low | low (0) |
| 15 | Shortened link alone (uncertain) | medium | medium (3) |
| 16 | Private IP router admin page | low | low (0) |
| 17 | WhatsApp official short link | low | low (0) |
| 18 | Punycode look-alike domain | high | high (9) |
| 19 | Empty input returns clean "empty" result | pass | pass |
| 20 | scoreUrl official BCA domain is negative | pass | pass (score −2) |

## Bug found and fixed during testing
- **Private-IP false positive**: the first run was 19/20 — `http://192.168.1.1/admin`
  scored Medium (HTTP +2, "many subdomains" +1). Fixed in `scoring.js`: private
  and local addresses (10.x, 192.168.x, 172.16–31.x, localhost) now return an
  explicit "local/private address" result with 0 points. Re-run: 20/20.

## Built-in sample cases (UI): 6/6 correct
Verified through the same engine the UI calls:
- OTP scam (BCA) → high (17) ✓
- Prize lure (bit.ly) → high (7) ✓
- Fake APK download → high (8) ✓
- Official BCA site → low (0) ✓
- Official Shopee page → low (0) ✓
- Plain delivery message → low (0) ✓

## Local serving check
`python3 -m http.server` in the project folder, then `curl`:
- `index.html` 200, `styles.css` 200, `app.js` 200, `scoring.js` 200,
  `sw.js` 200, `manifest.webmanifest` 200.
- `index.html` references `scoring.js` and `app.js` correctly.

## Not tested (honest gaps)
- **OCR end-to-end**: Tesseract.js loads from a CDN at runtime; it was not
  executed in this environment (no browser automation here). The code path is
  written with a clear fallback message if the library cannot load, and the
  scoring of OCR output is the same tested `analyze()` function. Verify once
  in a real browser before recording the demo video.
- **Service worker offline behaviour**: the worker is registered only over
  http(s) and caches the app shell; repeat-visit offline use was not exercised
  in a browser here. The app works without the worker (it is optional).
- **Kiro agentic chat**: not used in this build (needs the entrant's own
  AWS Builder ID sign-in). Kiro CLI 3.3.0 binary installed and version-verified.
