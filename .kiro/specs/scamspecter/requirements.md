# ScamSpecter — Requirements

## Introduction
ScamSpecter is a static web app for Kiroween 2026 (Frankenstein category).
Indonesians receive scam links and messages on WhatsApp, SMS and email and
often cannot tell a real invoice, bank notice or courier message from a fake
one. ScamSpecter lets a user paste a link or message (or a screenshot) and
returns a risk score with concrete evidence — all computed locally in the
browser, with no data leaving the device.

## Glossary
- **Signal**: one transparent, explainable check (e.g. "URL shortener hides the real destination").
- **Score**: sum of signal points. Low 0–2, Medium 3–5, High 6+.
- **Verdict**: Low / Medium / High risk, plus "what to do" advice.
- **Sample case**: a built-in input the user can load with one click, so the demo never fails.

## Requirements

### Requirement 1: One core feature — paste, score, explain
**User Story:** As a WhatsApp user who just received a suspicious message, I want to paste it and immediately see whether it is risky and why, so I can decide whether to click, ignore or report it.

#### Acceptance Criteria
1. WHEN the user pastes text and presses "Hunt the ghost", THE SYSTEM SHALL show a verdict (Low/Medium/High), a numeric score, and a list of evidence within 1 second for typical inputs.
2. WHEN the input is empty, THE SYSTEM SHALL show a friendly prompt instead of crashing or scoring nothing.
3. WHEN the user presses Ctrl/Cmd+Enter, THE SYSTEM SHALL run the same check as the button.

### Requirement 2: Transparent URL rule engine
**User Story:** As a user, I want to see the exact reason a link is risky, so I can learn the pattern and trust the result.

#### Acceptance Criteria
1. THE SYSTEM SHALL score URL shorteners, raw IP hosts, typosquats of Indonesian brands, suspicious TLDs, .apk downloads, missing HTTPS, punycode and @-tricks.
2. THE SYSTEM SHALL give a negative (clean) score to official brand domains and well-known legitimate domains.
3. THE SYSTEM SHALL NOT flag private/local addresses (192.168.x.x, 10.x.x.x, localhost) as public scams.
4. THE SYSTEM SHALL list every fired signal with its points and a plain-language explanation.

### Requirement 3: Indonesian scam-message patterns
**User Story:** As an Indonesian user, I want the app to understand local scam language, so it catches "Selamat Anda menang undian" and "kirim kode OTP" messages.

#### Acceptance Criteria
1. THE SYSTEM SHALL detect urgency/threat language, OTP/PIN requests, prize lures, free-money lures, admin-fee demands, impersonation claims and app-install pushes.
2. THE SYSTEM SHALL add combination bonuses when two weak signals appear together (shortener + prize, OTP + link, typosquat + threat).

### Requirement 4: Screenshot OCR (opt-in, with honest fallback)
**User Story:** As a user who only has a screenshot of the scam message, I want to upload it and have the text checked, so I do not have to retype it.

#### Acceptance Criteria
1. WHEN the user uploads an image, THE SYSTEM SHALL read the text on the device with Tesseract.js and run the same scoring on it.
2. WHEN the OCR library cannot load (offline first visit), THE SYSTEM SHALL say so clearly and invite the user to paste the text instead.
3. THE SYSTEM SHALL NOT upload the screenshot anywhere.

### Requirement 5: Offline-first, local-only
**User Story:** As a user with weak or no internet, I want the check itself to work offline, so I can use it anywhere.

#### Acceptance Criteria
1. THE SYSTEM SHALL run all scoring with zero network calls.
2. THE SYSTEM SHALL cache the app shell with a service worker when served over http(s), so repeat visits work offline.
3. THE SYSTEM SHALL state honestly on the page that scoring is local and heuristic, not a guarantee.

### Requirement 6: Demo that cannot fail
**User Story:** As the presenter, I want one-click sample cases, so the demo works even if I mistype or lose the network.

#### Acceptance Criteria
1. THE SYSTEM SHALL provide 6 built-in samples (3 scam, 3 clean) that load and score with one click.
2. THE 6 SAMPLES SHALL produce the expected verdicts (verified by tests).

### Requirement 7: Kiroween submission artefacts
**User Story:** As the entrant, I want the repo to contain everything Kiroween requires, so the submission is not disqualified on a technicality.

#### Acceptance Criteria
1. THE REPOSITORY SHALL be public, contain an MIT LICENSE, and contain a `/.kiro` directory at the root (specs, steering, hooks).
2. THE `.gitignore` SHALL NOT exclude `.kiro`.
3. THE PROJECT SHALL include a Devpost draft, a test report and a video script (under 3 minutes).
