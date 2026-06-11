// Renders "UrbanOS Video Utilisateur" to a sequence of JPEG frames, then
// encodes them to MP4 with ffmpeg. The animation is a pure function of the
// timeline clock, so frames are stepped deterministically (no real-time rAF).
//
//   node render.mjs                 # render frames + encode mp4
//   FPS=30 node render.mjs          # override frame rate (default 30)
//   SAMPLE=0,12,30 node render.mjs  # render only those timestamps (debug)
//   CHROME=/path/to/chrome node render.mjs   # override browser binary
//
// Requires: a Chromium/Chrome binary, ffmpeg, and `npm i playwright-core`
// plus the vendored libs/fonts (run ./setup.sh first).
import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const FRAMES = path.join(ROOT, 'frames');
const PORT = Number(process.env.PORT || 8099);
const FPS = Number(process.env.FPS || 30);
const OUT = process.env.OUT || path.join(ROOT, 'UrbanOS-Video-Utilisateur.mp4');

function findChrome() {
  if (process.env.CHROME && fs.existsSync(process.env.CHROME)) return process.env.CHROME;
  const candidates = [];
  // Playwright-managed builds.
  for (const base of ['/opt/pw-browsers', path.join(process.env.HOME || '', '.cache/ms-playwright')]) {
    try {
      for (const d of fs.readdirSync(base)) {
        if (d.startsWith('chromium-')) {
          for (const exe of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
            const p = path.join(base, d, exe);
            if (fs.existsSync(p)) candidates.push(p);
          }
        }
      }
    } catch {}
  }
  // System installs.
  for (const c of ['google-chrome', 'chromium', 'chromium-browser']) {
    try { candidates.push(execSync(`command -v ${c}`).toString().trim()); } catch {}
  }
  return candidates.find(Boolean) || null;
}

const MIME = {
  '.html': 'text/html', '.jsx': 'text/babel', '.js': 'text/javascript',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(ROOT, u === '/' ? 'render-harness.html' : u);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

await new Promise((r) => server.listen(PORT, r));

const EXE = findChrome();
if (!EXE) { console.error('No Chromium/Chrome binary found. Set CHROME=/path/to/chrome'); process.exit(1); }
console.log(`chrome:  ${EXE}`);
console.log(`server:  http://localhost:${PORT}`);

fs.mkdirSync(FRAMES, { recursive: true });
for (const f of fs.readdirSync(FRAMES)) if (f.endsWith('.jpg')) fs.unlinkSync(path.join(FRAMES, f));

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--disable-gpu', '--force-color-profile=srgb', '--hide-scrollbars'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });

await page.goto(`http://localhost:${PORT}/render-harness.html`, { waitUntil: 'load' });
await page.waitForFunction('window.__harnessReady === true', null, { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800); // settle font/first paint

const DURATION = await page.evaluate(() => window.__DURATION);
const SAMPLE = process.env.SAMPLE ? process.env.SAMPLE.split(',').map(Number) : null;
const frame = page.locator('#frame');

async function shoot(t, name) {
  await page.evaluate((tt) => {
    window.__renderFrame(tt);
    // two rAFs: let React commit + the browser lay out/paint before capture
    return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
  }, t);
  await frame.screenshot({ path: name, type: 'jpeg', quality: 92 });
}

if (SAMPLE) {
  for (const t of SAMPLE) { await shoot(t, path.join(FRAMES, `sample_t${t}.jpg`)); console.log(`  sample t=${t}s`); }
  await browser.close(); server.close();
  console.log('sample done'); process.exit(0);
}

const TOTAL = Math.round(DURATION * FPS);
console.log(`render:  ${TOTAL} frames @ ${FPS}fps (${DURATION}s)`);
const t0 = Date.now();
for (let f = 0; f < TOTAL; f++) {
  await shoot(f / FPS, path.join(FRAMES, `f_${String(f).padStart(5, '0')}.jpg`));
  if (f % 60 === 0 || f === TOTAL - 1) {
    const pct = (((f + 1) / TOTAL) * 100).toFixed(1);
    const el = ((Date.now() - t0) / 1000).toFixed(0);
    console.log(`  frame ${f + 1}/${TOTAL} (${pct}%) ${el}s`);
  }
}
await browser.close();
server.close();

// ── Encode ────────────────────────────────────────────────────────────────
console.log(`encode:  ${OUT}`);
const ff = spawnSync('ffmpeg', [
  '-y',
  '-framerate', String(FPS),
  '-i', path.join(FRAMES, 'f_%05d.jpg'),
  '-c:v', 'libx264',
  '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-level', '4.2',
  '-crf', '18',
  '-preset', 'slow',
  '-movflags', '+faststart',
  OUT,
], { stdio: 'inherit' });
if (ff.status !== 0) { console.error('ffmpeg failed'); process.exit(1); }
console.log('done');
