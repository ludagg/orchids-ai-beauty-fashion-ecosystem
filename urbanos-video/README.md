# UrbanOS — Vidéo Utilisateur (MP4)

« Une journée avec UrbanOS » — a 74-second, 1920×1080 motion piece told from a
driver's point of view (Amina, Yaoundé). It comes from the Claude Design handoff
bundle as an interactive HTML/React prototype; this folder turns that prototype
into a real **MP4** file.

## The film

| time      | scene                                                                 |
|-----------|-----------------------------------------------------------------------|
| 0–56 s    | Continuous map act: morning commute, accident alert + detour, a user-reported flood, peer confirmations, the city responding |
| 56–66 s   | Benefits: time saved · safer trips · a more responsive city           |
| 66–74 s   | Signature: UrbanOS logo + tagline                                     |

## Output

- **`UrbanOS-Video-Utilisateur.mp4`** — H.264, 1920×1080, 30 fps, ~74 s.
- A web-served copy lives at `public/urbanos-video-utilisateur.mp4`.

## How it's rendered

The prototype's animation kit (`src/animations.jsx`) drives everything off a
single timeline clock, and every visual is a **pure function of that clock** — no
randomness, no real-time `requestAnimationFrame` dependence. So instead of
screen-recording playback, `render.mjs`:

1. serves a headless harness (`render-harness.html`) that mounts the three
   scenes inside a `TimelineContext` we control;
2. steps the clock frame-by-frame (`__renderFrame(t)`), waiting two animation
   frames per step so React commits and the browser paints;
3. screenshots the 1920×1080 stage to a JPEG per frame via headless Chromium;
4. encodes the frames to MP4 with `ffmpeg` (CRF 18, `+faststart`).

This yields a clean, deterministic capture at exact authored geometry.

## Regenerating

Prerequisites: Node 18+, `ffmpeg`, and network access for the one-time
`setup.sh` (which vendors React/Babel and the webfonts locally, and installs a
headless Chromium). For crisp emoji glyphs, install a color-emoji font, e.g.
`sudo apt-get install fonts-noto-color-emoji`.

```bash
cd urbanos-video
./setup.sh                 # one-time: fetch libs/fonts + chromium
node render.mjs            # render frames + encode the mp4
# options:
FPS=60 node render.mjs               # smoother / larger file
SAMPLE=0,12,30,58,72 node render.mjs # debug: only these timestamps
CHROME=/path/to/chrome node render.mjs
```

## Files

- `src/` — the original design files (the source of truth):
  `UrbanOS Video Utilisateur.html`, `animations.jsx`, `video-kit.jsx`,
  `video-kit-light.jsx`, `video-user-scenes.jsx`.
- `render-harness.html` — offline, deterministic mount of the scenes.
- `render.mjs` — frame stepper + ffmpeg encode.
- `setup.sh` — fetches vendored libs/fonts + Chromium (git-ignored output).
