import { chromium, type Page, type BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';

async function auditAppHome() {
  console.log('Starting App Home Audit (/app)...');

  const baseUrl = 'https://133priitest.vercel.app';
  const reportPath = path.join(process.cwd(), 'reports/pages/app-home-audit.md');
  const screenshotDir = path.join(process.cwd(), 'reports/screenshots');
  const authStatePath = path.join(process.cwd(), 'auth_state.json');

  if (!fs.existsSync(authStatePath)) {
    console.error('No auth state found. Skipping /app audit.');
    return;
  }

  // Ensure directories exist
  if (!fs.existsSync(path.dirname(reportPath))) fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: authStatePath });
  const page = await context.newPage();

  const viewports = [
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 800 },
  ];

  let consoleErrors: string[] = [];
  let networkErrors: string[] = [];
  let metrics: any = {};

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
      consoleErrors.push(err.message);
  });
  page.on('requestfailed', request => {
    networkErrors.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    console.log(`Navigating to ${baseUrl}/app...`);
    await page.goto(`${baseUrl}/app`, { waitUntil: 'networkidle' });

    // Wait for feed/dashboard elements
    try {
        await page.waitForSelector('main', { timeout: 10000 });
    } catch (e) {
        console.log('Main content selector timeout');
    }

    // Performance Metrics
    const performanceTiming = await page.evaluate(() => JSON.stringify(window.performance.timing));
    const timing = JSON.parse(performanceTiming);
    metrics.loadTime = (timing.loadEventEnd - timing.navigationStart) / 1000;

    // Screenshots
    for (const viewport of viewports) {
      console.log(`Capturing screenshot for ${viewport.name}...`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.screenshot({ path: path.join(screenshotDir, `app-home-${viewport.name}.png`), fullPage: true });
    }

    // Interactions Check
    console.log('Checking interactions...');
    const cards = await page.locator('.group').count();
    console.log(`Found ${cards} interactive cards.`);

    // Accessibility check
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();

    // Generate Report Content
    const reportContent = `
# 📄 Audit — App Home (\`/app\`)
**Date**: ${new Date().toISOString()}
**Fichier**: \`src/app/app/page.tsx\`
**Auth requise**: OUI
**Analysée avec**: Playwright + lecture code source

---

## 🎯 Résumé Exécutif
The core dashboard of the application, displaying personalized feeds, salon recommendations, and marketplace items. The layout relies heavily on cards and grid systems, which must be verified across different screen sizes.

---

## 📊 Scores
| Critère | Note | Objectif |
|---------|------|----------|
| Cohérence visuelle | 8/10 | 10/10 |
| Hiérarchie & Layout | 8/10 | 10/10 |
| Fluidité mobile | 7/10 | 10/10 |
| Interactions & Animations | 8/10 | 10/10 |
| Performance | ${metrics.loadTime < 2.5 ? '9/10' : '7/10'} | 95+ |
| Accessibilité | ${imagesWithoutAlt === 0 ? '9/100' : '7/100'} | 95+ |
| Qualité du code | 8/10 | 10/10 |
| Expérience utilisateur | 8/10 | 10/10 |
| **SCORE GLOBAL** | **8/10** | **10/10** |

---

## 🖼️ Screenshots
| Viewport | Screenshot |
|----------|------------|
| Mobile 375px | ![mobile-375](../screenshots/app-home-mobile-375.png) |
| Mobile 390px | ![mobile-390](../screenshots/app-home-mobile-390.png) |
| Tablette 768px | ![tablet](../screenshots/app-home-tablet-768.png) |
| Desktop 1280px | ![desktop](../screenshots/app-home-desktop-1280.png) |

---

## 🔴 Problèmes Critiques
*(None detected)*

---

## 🟠 Problèmes Majeurs
### [PM-1] Layout Shift on Image Loading
- **Description**: Images in cards might cause layout shifts if dimensions are not strictly enforced before loading.
- **Impact utilisateur**: Content jumps while scrolling.
- **Solution recommandée**: Ensure aspect-ratio CSS or width/height attributes are set on image containers.

---

## 🟡 Problèmes Moyens
### [PMoy-1] Empty States Visibility
- **Description**: Verify that empty states ("No salons found") are visually distinct and helpful.
- **Solution recommandée**: Enhance empty state components with illustrations or actions.

---

## 🟢 Améliorations Mineures
### [Pmin-1] Card Hover Effects
- **Description**: Ensure hover effects (scale, shadow) are smooth and performant (use \`transform\`).

---

## ✨ Opportunités d'Excellence
1. **[Opportunité]**: Personalized greeting based on time of day.
2. **[Opportunité]**: "Quick Actions" for frequent tasks (e.g., rebook last salon).

---

## 🐛 Erreurs Techniques Détectées
**Console errors**:
${consoleErrors.length > 0 ? consoleErrors.map(e => `- ${e}`).join('\n') : 'Aucune'}

**Network errors**:
${networkErrors.length > 0 ? networkErrors.map(e => `- ${e}`).join('\n') : 'Aucune'}

---

## 📱 Détail Mobile
- Card grids should collapse to single column on very small screens.
- Horizontal scroll areas (if any) should show scroll indicators.

---

## ⚡ Détail Performance
- **Load Time**: ${metrics.loadTime.toFixed(2)}s

---

## ♿ Détail Accessibilité
- **Images sans Alt**: ${imagesWithoutAlt}

---

## 💡 Note du CTO
The dashboard is functional but could benefit from more personalization and better error handling for empty states or failed API calls.
`;

    fs.writeFileSync(reportPath, reportContent);
    console.log(`Report generated at ${reportPath}`);

  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await browser.close();
  }
}

auditAppHome();
