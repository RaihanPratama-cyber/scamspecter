/**
 * ScamSpecter UI — wires the local scoring engine to the page.
 * No network calls for scoring. OCR is the only network use, and only
 * when the user uploads a screenshot (Tesseract.js from a CDN, first use).
 */
(function () {
  'use strict';

  var SAMPLES = [
    { label: '🔴 OTP scam (BCA)', text: 'Kami dari BCA, akun Anda akan diblokir, kirim kode OTP Anda ke https://bca-verify.click' },
    { label: '🔴 Prize lure (bit.ly)', text: 'Selamat! Anda menang undian Rp10.000.000, klaim hadiah di https://bit.ly/abc123' },
    { label: '🔴 Fake APK download', text: 'https://update-apk.top/bca-mobile.apk' },
    { label: '🟢 Official BCA site', text: 'https://www.bca.co.id/id/informasi' },
    { label: '🟢 Official Shopee page', text: 'https://shopee.co.id/product/123' },
    { label: '🟢 Plain delivery message', text: 'Halo, paket Anda sudah sampai di rumah, terima kasih' }
  ];

  var input = document.getElementById('input');
  var result = document.getElementById('result');
  var verdictBadge = document.getElementById('verdictBadge');
  var scoreFill = document.getElementById('scoreFill');
  var scoreText = document.getElementById('scoreText');
  var evidenceList = document.getElementById('evidenceList');
  var advice = document.getElementById('advice');
  var ocrStatus = document.getElementById('ocrStatus');

  function render(report) {
    result.classList.remove('hidden');
    var cls = report.verdict;
    verdictBadge.className = 'verdict ' + cls;
    verdictBadge.textContent = '👻 ' + ScamSpecter.verdictText(cls);
    var pct = Math.min(100, Math.round((report.score / 10) * 100));
    scoreFill.style.width = pct + '%';
    scoreFill.style.background = cls === 'high' ? '#ff5d73' : cls === 'medium' ? '#ffb020' : '#34d399';
    scoreText.textContent = 'Risk score: ' + report.score + ' / 10  (Low 0–2 · Medium 3–5 · High 6+)';

    evidenceList.innerHTML = '';
    if (report.signals.length === 0) {
      var li = document.createElement('li');
      li.textContent = 'No suspicious signals found in this text.';
      evidenceList.appendChild(li);
    }
    report.signals.forEach(function (s) {
      var li = document.createElement('li');
      var pts = document.createElement('span');
      pts.className = 'pts ' + (s.points > 0 ? 'pos' : s.points < 0 ? 'neg' : 'zero');
      pts.textContent = (s.points > 0 ? '+' : '') + s.points + ' — ';
      li.appendChild(pts);
      li.appendChild(document.createTextNode(s.label + ': ' + s.detail));
      evidenceList.appendChild(li);
    });
    advice.textContent = ScamSpecter.adviceFor(cls);
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function check() {
    var report = ScamSpecter.analyze(input.value);
    if (report.error === 'empty') {
      ocrStatus.textContent = 'Paste a link or message first, or load a sample below.';
      input.focus();
      return;
    }
    ocrStatus.textContent = 'Checked locally — nothing was uploaded.';
    render(report);
  }

  document.getElementById('checkBtn').addEventListener('click', check);
  document.getElementById('clearBtn').addEventListener('click', function () {
    input.value = '';
    result.classList.add('hidden');
    input.focus();
  });
  input.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') check();
  });

  var sampleBox = document.getElementById('sampleButtons');
  SAMPLES.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = s.label;
    b.addEventListener('click', function () {
      input.value = s.text;
      check();
    });
    sampleBox.appendChild(b);
  });

  // --- Screenshot OCR (lazy, opt-in) ---
  var tesseractLoaded = false;
  function loadTesseract() {
    return new Promise(function (resolve, reject) {
      if (tesseractLoaded) return resolve(window.Tesseract);
      if (window.Tesseract) { tesseractLoaded = true; return resolve(window.Tesseract); }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = function () { tesseractLoaded = true; resolve(window.Tesseract); };
      script.onerror = function () { reject(new Error('Could not load the OCR library. Check your connection and try again.')); };
      document.head.appendChild(script);
    });
  }

  document.getElementById('imageInput').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    ocrStatus.textContent = 'Reading the screenshot on your device… (first use downloads the OCR library)';
    loadTesseract().then(function (Tesseract) {
      return Tesseract.recognize(file, 'ind+eng', { logger: function () {} });
    }).then(function (res) {
      var text = (res.data.text || '').trim();
      if (!text) {
        ocrStatus.textContent = 'No text could be read from this screenshot. Try a clearer image, or paste the message text instead.';
        return;
      }
      input.value = text;
      ocrStatus.textContent = 'Text read from the screenshot — now checking it locally.';
      check();
    }).catch(function (err) {
      ocrStatus.textContent = 'OCR is unavailable offline: ' + err.message + ' You can still paste the message text instead — scoring itself needs no connection.';
    });
    e.target.value = '';
  });
})();
