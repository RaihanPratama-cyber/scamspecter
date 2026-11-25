# Structure steering — ScamSpecter

```
scamspecter/
├── index.html                  # page structure
├── styles.css                  # theme
├── app.js                      # UI wiring + OCR upload
├── scoring.js                  # rule engine (browser + Node)
├── sw.js                       # offline app-shell cache
├── manifest.webmanifest        # PWA metadata
├── test/
│   └── run-tests.js            # Node test runner (no dependencies)
├── .kiro/
│   ├── specs/scamspecter/      # requirements.md, design.md, tasks.md
│   ├── steering/               # product.md, tech.md, structure.md
│   └── hooks/
│       └── test-on-save.json   # run tests on save (Kiro hook)
├── submission/
│   └── DEVPOST-DRAFT.md        # Devpost story, tags, Kiro write-up, video script
├── docs/
│   └── TEST-REPORT.md          # exact test results
├── README.md
├── LICENSE                     # MIT
└── .gitignore                  # MUST NOT exclude .kiro
```

- Never put `.kiro` in `.gitignore` — Kiroween disqualifies repos that hide it.
- Keep the app at the repo root so static hosts (GitHub Pages, Netlify, Vercel) serve it by uploading the folder.
- No credentials, no API keys, no secrets anywhere in the repo.
