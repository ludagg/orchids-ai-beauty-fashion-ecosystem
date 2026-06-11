#!/usr/bin/env bash
# Fetches the third-party libraries and webfonts the offline render harness
# needs (they are intentionally not committed). Run once before render.mjs.
set -euo pipefail
cd "$(dirname "$0")"

UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

echo "==> vendoring react / react-dom / babel-standalone"
mkdir -p vendor
curl -fsSL https://unpkg.com/react@18.3.1/umd/react.development.js          -o vendor/react.js
curl -fsSL https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js   -o vendor/react-dom.js
curl -fsSL https://unpkg.com/@babel/standalone@7.29.0/babel.min.js          -o vendor/babel.js

echo "==> vendoring Space Grotesk + JetBrains Mono webfonts"
mkdir -p fonts
curl -fsSL -A "$UA" \
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" \
  -o fonts/fonts.css
i=0
for url in $(grep -oE 'https://[^)]+\.woff2' fonts/fonts.css | sort -u); do
  curl -fsSL -A "$UA" "$url" -o "fonts/f_${i}.woff2"
  sed -i "s#${url}#f_${i}.woff2#g" fonts/fonts.css
  i=$((i+1))
done
echo "    $i font files"

echo "==> installing playwright-core + chromium"
npm install --no-save playwright-core@1.58.2
npx --yes playwright@1.58.2 install chromium

echo "==> done. Now run:  node render.mjs"
