# Tech steering — ScamSpecter

- **Stack**: plain HTML/CSS/JS. No build step, no framework, no backend, no npm dependencies at runtime.
- **Scoring engine** (`scoring.js`): UMD module — the same file runs in the browser and in the Node test runner. Never duplicate the rules in a second file.
- **Tests**: plain Node, no test framework. Run with `node test/run-tests.js`. All tests must pass before any commit.
- **OCR**: Tesseract.js from the jsDelivr CDN, lazy-loaded only when the user uploads a screenshot. If it fails to load, show an honest fallback message — never silently pretend OCR worked.
- **Offline**: service worker caches the app shell (`sw.js`); scoring itself makes zero network calls.
- **Style**: keep functions small and named after what they check. Every signal carries a label, points and a plain-language detail string — the UI renders exactly that.
