/**
 * ScamSpecter — transparent, local-only scam scoring engine.
 *
 * Everything runs in the browser. No network calls, no data leaves the device.
 * The engine is deliberately a HEURISTIC: it flags suspicious patterns and
 * explains them. It is not a guarantee that a link is safe or a scam.
 *
 * Scoring: every fired signal adds (or subtracts) points.
 *   score >= 6  -> High risk
 *   score 3..5  -> Medium risk (uncertain — verify through another channel)
 *   score <= 2  -> Low risk
 *
 * Works in the browser (window.ScamSpecter) and in Node (module.exports).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ScamSpecter = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var SHORTENERS = [
    'bit.ly', 'tinyurl.com', 't.co', 's.id', 'gg.gg', 'cutt.ly',
    'shorturl.at', 'rb.gy', 'is.gd', 'tiny.cc', 'shrtco.de', 'rebrand.ly',
    'bl.ink', 'v.gd', 'ow.ly', 'buff.ly'
  ];

  var SUSPICIOUS_TLDS = [
    'xyz', 'top', 'click', 'live', 'online', 'site', 'shop', 'tk', 'ml',
    'ga', 'cf', 'gq', 'buzz', 'fun', 'icu', 'cyou', 'sbs', 'quest', 'cam'
  ];

  // brand token -> official domain(s). If the host contains the brand token
  // but is NOT the official domain (or a subdomain of it), it is a
  // typosquat / impersonation signal.
  var BRANDS = {
    bca: ['bca.co.id'],
    bri: ['bri.co.id'],
    mandiri: ['bankmandiri.co.id'],
    bni: ['bni.co.id'],
    dana: ['dana.id'],
    ovo: ['ovo.id'],
    gopay: ['gopay.co.id', 'gojek.com'],
    shopee: ['shopee.co.id'],
    tokopedia: ['tokopedia.com'],
    lazada: ['lazada.co.id'],
    whatsapp: ['whatsapp.com', 'wa.me'],
    telegram: ['telegram.org', 't.me'],
    telkomsel: ['telkomsel.com'],
    indosat: ['indosat.com', 'myim3.com'],
    xl: ['xl.co.id'],
    jne: ['jne.co.id'],
    jnt: ['jnt.co.id', 'jet.co.id'],
    anteraja: ['anteraja.id'],
    sicepat: ['sicepat.com'],
    pln: ['pln.co.id'],
    bpjs: ['bpjs-kesehatan.go.id', 'bpjs.go.id'],
    ojk: ['ojk.go.id'],
    gojek: ['gojek.com'],
    grab: ['grab.com'],
    kominfo: ['kominfo.go.id'],
    bukalapak: ['bukalapak.com'],
    blibli: ['blibli.com']
  };

  var SAFE_HOSTS = [
    'google.com', 'youtube.com', 'github.com', 'wikipedia.org',
    'microsoft.com', 'apple.com', 'amazon.com', 'cloudflare.com',
    'stackoverflow.com', 'w3.org', 'mozilla.org', 'wa.me', 't.me'
  ];

  var PATH_KEYWORDS = [
    'login', 'verify', 'verifikasi', 'otp', 'claim', 'klaim', 'prize',
    'hadiah', 'free', 'gratis', 'update', 'secure', 'account', 'suspended',
    'blocked', 'unlock', 'confirm', 'konfirmasi'
  ];

  function hostOf(url) {
    try {
      var u = new URL(url);
      return { host: u.hostname.toLowerCase(), protocol: u.protocol, path: (u.pathname + u.search).toLowerCase(), raw: url };
    } catch (e) {
      return null;
    }
  }

  function isOfficialHost(host, brand) {
    return BRANDS[brand].some(function (d) {
      return host === d || host.endsWith('.' + d);
    });
  }

  function isSafeHost(host) {
    return SAFE_HOSTS.some(function (d) {
      return host === d || host.endsWith('.' + d);
    });
  }

  function isPrivateIp(host) {
    return /^10\./.test(host) || /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) || host === 'localhost';
  }

  /**
   * Score a single URL. Returns { score, signals: [{label, points, detail}] }.
   */
  function scoreUrl(rawUrl) {
    var signals = [];
    var parsed = hostOf(rawUrl);
    if (!parsed) {
      signals.push({ label: 'Not a valid URL', points: 0, detail: 'The text does not look like a web address.' });
      return { score: 0, signals: signals };
    }
    var host = parsed.host;

    if (isPrivateIp(host)) {
      return { score: 0, signals: [{ label: 'Local/private address (your own network)', points: 0, detail: host + ' is a private address on your own network, not a public website.' }] };
    }

    if (SHORTENERS.indexOf(host) !== -1) {
      signals.push({ label: 'URL shortener hides the real destination', points: 3, detail: host + ' shortens the link, so you cannot see where it really goes.' });
    }
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && !isPrivateIp(host)) {
      signals.push({ label: 'Website address is a raw IP number', points: 4, detail: 'Real companies use a domain name, not a bare IP address.' });
    }
    if (parsed.protocol === 'http:') {
      signals.push({ label: 'Not using HTTPS', points: 2, detail: 'The connection is not encrypted.' });
    }
    if (/\.apk(\?|$)/.test(parsed.path) || /\.apk$/i.test(rawUrl)) {
      signals.push({ label: 'Link downloads an Android app file (.apk)', points: 4, detail: 'Scammers distribute fake banking apps as .apk files outside the Play Store.' });
    }
    var tld = host.split('.').pop();
    if (SUSPICIOUS_TLDS.indexOf(tld) !== -1) {
      signals.push({ label: 'Suspicious cheap/free domain ending (.' + tld + ')', points: 2, detail: 'This domain ending is frequently abused for phishing pages.' });
    }
    if (host.indexOf('xn--') !== -1) {
      signals.push({ label: 'Punycode domain (look-alike characters)', points: 3, detail: 'The domain uses encoded characters that can imitate a real brand.' });
    }
    if (rawUrl.indexOf('@') !== -1) {
      signals.push({ label: 'URL contains an @ sign', points: 3, detail: 'Everything before the @ is ignored by the browser — a classic redirect trick.' });
    }

    var brandHit = null;
    Object.keys(BRANDS).forEach(function (brand) {
      if (brandHit) return;
      if (host.indexOf(brand) !== -1 && !isOfficialHost(host, brand)) brandHit = brand;
    });
    if (brandHit) {
      signals.push({ label: 'Imitates "' + brandHit + '" but is not its official domain', points: 5, detail: 'The official domain is ' + BRANDS[brandHit].join(' or ') + ', not ' + host + '.' });
    } else if (isSafeHost(host)) {
      signals.push({ label: 'Well-known legitimate domain', points: -2, detail: host + ' is a widely used legitimate service.' });
    } else {
      // Official brand domain check for the clean boost.
      var official = Object.keys(BRANDS).find(function (b) { return isOfficialHost(host, b); });
      if (official) {
        signals.push({ label: 'Official domain of ' + official, points: -3, detail: host + ' matches the official domain of ' + official + '.' });
      }
    }

    var labels = host.split('.');
    if (labels.length >= 4) {
      signals.push({ label: 'Unusually many subdomains', points: 1, detail: host + ' has ' + labels.length + ' parts — phishing pages often stack subdomains.' });
    }
    if (host.length > 30) {
      signals.push({ label: 'Unusually long domain name', points: 1, detail: 'Long, random-looking domains are a common phishing pattern.' });
    }
    if (PATH_KEYWORDS.some(function (k) { return parsed.path.indexOf(k) !== -1; })) {
      signals.push({ label: 'Suspicious words in the link path (login / verify / claim / prize)', points: 1, detail: 'The link path uses words scammers use to create urgency or lure.' });
    }

    var score = signals.reduce(function (s, x) { return s + x.points; }, 0);
    return { score: score, signals: signals };
  }

  var URL_RE = /https?:\/\/[^\s"'<>]+/gi;

  function extractUrls(text) {
    var m = text.match(URL_RE);
    return m ? m : [];
  }

  /**
   * Score a full message / pasted text. Returns a full report object.
   */
  function analyze(input) {
    var text = (input || '').trim();
    if (!text) {
      return { error: 'empty', score: 0, verdict: 'none', signals: [], urls: [] };
    }
    var lower = text.toLowerCase();
    var signals = [];
    var urls = extractUrls(text);

    // --- URL signals (cap the total URL contribution at 10) ---
    var urlScore = 0;
    urls.forEach(function (u) {
      var r = scoreUrl(u);
      urlScore += r.score;
      r.signals.forEach(function (s) { signals.push(s); });
    });
    if (urlScore > 10) urlScore = 10;

    // --- Message-pattern signals (Indonesian scam language) ---
    function add(re, label, points, detail) {
      if (re.test(lower)) signals.push({ label: label, points: points, detail: detail });
    }
    add(/segera|akun.*(diblokir|ditangguhkan|ditutup|dinonaktifkan)|dalam 24 jam|batas waktu|segera hubungi|sebelum.*(diblokir|ditutup|hangus)/,
      'Urgency / threat language', 2, 'The message pressures you to act fast or lose your account.');
    add(/kode otp|minta otp|kirim.*otp|\botp\b.*(anda|kamu)|pin anda|password anda|kata sandi anda/,
      'Asks for your OTP / PIN / password', 3, 'No bank or official service ever asks for your OTP or PIN by chat.');
    add(/selamat.*(menang|mendapatkan)|anda menang|klaim hadiah|undian berhadiah|hadiah.*rp|voucher gratis/,
      'Prize / lottery lure', 2, 'A "you won a prize" message with a link is a classic scam pattern.');
    add(/dana kaget|saldo gratis|uang tunai gratis/,
      'Free-money lure', 2, 'Promises of free balance or cash are a common bait.');
    add(/\bgratis\b/,
      'Free-offer wording', 1, 'The message leans on the word "free" to attract a click.');
    add(/biaya admin|transfer.*rp|bayar.*sekarang|ongkir.*rp/,
      'Asks you to transfer money / pay a fee', 1, 'Real deliveries and prizes do not ask you to pay an "admin fee" first.');
    add(/(kami dari|atas nama|petugas).*(bank|bca|bri|ojk|polisi|kurir|jne|jnt|shopee|tokopedia|dana|pln|bpjs)/,
      'Claims to be from a bank, official body or courier', 1, 'The sender claims authority — verify through the official app or number, not this link.');
    add(/\.apk|unduh aplikasi|install aplikasi|download apk|unduh apk/,
      'Pushes you to install an app file', 2, 'Installing apps from a chat link is how fake banking apps get on phones.');

    // --- Combination bonuses: two weak signals together are much stronger ---
    var hasShortener = signals.some(function (s) { return s.label.indexOf('URL shortener') === 0; });
    var hasPrize = signals.some(function (s) { return s.label === 'Prize / lottery lure'; });
    var hasOtp = signals.some(function (s) { return s.label.indexOf('OTP') !== -1; });
    var hasTyposquat = signals.some(function (s) { return s.label.indexOf('Imitates') === 0; });
    if (hasShortener && hasPrize) {
      signals.push({ label: 'Shortened link + prize lure together', points: 2, detail: 'A hidden destination combined with a prize promise is a strong scam combination.' });
    }
    if (hasOtp && urls.length > 0) {
      signals.push({ label: 'OTP request + a link in the same message', points: 2, detail: 'Asking for an OTP and giving you a link to "enter" it is the core of account-takeover scams.' });
    }
    if (hasTyposquat && signals.some(function (s) { return s.label === 'Urgency / threat language'; })) {
      signals.push({ label: 'Fake brand domain + threat language together', points: 2, detail: 'An impersonated brand plus a threat is a strong scam combination.' });
    }

    var msgScore = signals.reduce(function (s, x) { return s + x.points; }, 0);
    // URL points were already added into `signals` above, so msgScore already
    // includes them; the cap is applied by recomputing from the capped parts:
    // (we keep it simple and honest: cap only applies when URL part > 10)
    var total = msgScore;
    if (urlScore > 10) total = msgScore - (urlScore - 10);
    if (total < 0) total = 0;

    var verdict = total >= 6 ? 'high' : total >= 3 ? 'medium' : 'low';
    return { score: total, verdict: verdict, signals: signals, urls: urls, input: text };
  }

  function verdictText(v) {
    return { high: 'High risk', medium: 'Medium risk', low: 'Low risk', none: 'No input' }[v] || v;
  }

  function adviceFor(v) {
    if (v === 'high') return 'Do NOT click the link, do NOT send any OTP/PIN/password, and do NOT install anything from it. If it claims to be your bank or a courier, open the official app yourself (do not use the link) or call the official number. Report and block the sender.';
    if (v === 'medium') return 'Do not trust it yet. Verify through another channel: open the official app or website by typing the address yourself, or call the official number. Never enter an OTP on a page you reached from a chat link.';
    return 'No strong scam signals were found, but this is a heuristic check, not a guarantee. Stay alert: if anything asks for an OTP, a PIN or a payment, stop and verify through the official channel.';
  }

  return {
    analyze: analyze,
    scoreUrl: scoreUrl,
    extractUrls: extractUrls,
    verdictText: verdictText,
    adviceFor: adviceFor
  };
});
