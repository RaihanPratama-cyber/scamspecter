/**
 * ScamSpecter test runner — plain Node, no dependencies.
 * Run: node test/run-tests.js
 */
const { analyze, scoreUrl } = require('../scoring.js');

const CASES = [
  // --- High-risk scams ---
  { name: 'Typosquat BCA login page', input: 'https://bca-secure-login.xyz/verify', expect: 'high' },
  { name: 'APK download from fake BCA domain', input: 'https://update-apk.top/bca-mobile.apk', expect: 'high' },
  { name: 'Raw IP login page over HTTP', input: 'http://103.147.8.22/login-bca', expect: 'high' },
  { name: 'Prize lure + shortened link', input: 'Selamat! Anda menang undian Rp10.000.000, klaim hadiah di https://bit.ly/abc123', expect: 'high' },
  { name: 'OTP phishing posing as BCA', input: 'Kami dari BCA, akun Anda akan diblokir, kirim kode OTP Anda ke https://bca-verify.click', expect: 'high' },
  { name: 'Typosquat Tokopedia prize page', input: 'https://tokopedia-claim-prize.xyz', expect: 'high' },
  { name: 'Fake DANA free-balance lure', input: 'DANA KAGET! Saldo gratis Rp500.000, ambil di https://dana-promo.top/klaim', expect: 'high' },
  // --- Clean ---
  { name: 'Official BCA website', input: 'https://www.bca.co.id/id/informasi', expect: 'low' },
  { name: 'Google search link', input: 'https://www.google.com/search?q=jadwal+kereta', expect: 'low' },
  { name: 'Official Shopee product page', input: 'https://shopee.co.id/product/123', expect: 'low' },
  { name: 'Plain delivery message, no link', input: 'Halo, paket Anda sudah sampai di rumah, terima kasih', expect: 'low' },
  { name: 'GitHub project page', input: 'https://github.com/RaihanPratama-cyber/scamspecter', expect: 'low' },
  { name: 'Official PLN page with urgency wording', input: 'Segera bayar tagihan listrik Anda sebelum terlambat di https://pln.co.id', expect: 'low' },
  { name: 'Shopee free-shipping promo on official domain', input: 'Gratis ongkir hari ini! Belanja di https://shopee.co.id/flash-sale', expect: 'low' },
  // --- Edge / uncertain ---
  { name: 'Shortened link alone (uncertain)', input: 'https://bit.ly/abc', expect: 'medium' },
  { name: 'Private IP router admin page (not a public scam)', input: 'http://192.168.1.1/admin', expect: 'low' },
  { name: 'WhatsApp official short link', input: 'https://wa.me/6281234567890', expect: 'low' },
  { name: 'Punycode look-alike domain', input: 'https://xn--bca-9ya.co.id/login', expect: 'high' },
];

let passed = 0;
let failed = 0;
for (const c of CASES) {
  const r = analyze(c.input);
  const ok = r.verdict === c.expect;
  if (ok) passed++; else failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${r.verdict} score=${r.score}] expected ${c.expect} — ${c.name}`);
  if (!ok) {
    console.log('      signals:', r.signals.map(s => `${s.label} (+${s.points})`).join(' | '));
  }
}

// Empty input must be handled, not crash.
const empty = analyze('   ');
const emptyOk = empty.error === 'empty' && empty.verdict === 'none';
console.log(`${emptyOk ? 'PASS' : 'FAIL'}  empty input returns a clean "empty" result`);
if (emptyOk) passed++; else failed++;

// scoreUrl unit check: official domain must score below 0 (clean boost).
const official = scoreUrl('https://www.bca.co.id/');
const officialOk = official.score < 0;
console.log(`${officialOk ? 'PASS' : 'FAIL'}  scoreUrl official BCA domain is negative (score=${official.score})`);
if (officialOk) passed++; else failed++;

console.log(`\n${passed}/${passed + failed} tests passed.`);
process.exit(failed === 0 ? 0 : 1);
