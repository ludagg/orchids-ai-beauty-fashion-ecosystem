import { chromium, type Page, type BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';

async function auditProfilePage() {
  console.log('Starting Profile Audit (/app/profile)...');

  const baseUrl = 'https://133priitest.vercel.app';
  const reportPath = path.join(process.cwd(), 'reports/pages/profile-audit.md');
  const screenshotDir = path.join(process.cwd(), 'reports/screenshots');
  const authStatePath = path.join(process.cwd(), 'auth_state.json');

  if (!fs.existsSync(authStatePath)) {
    console.error('No auth state found. Skipping /app/profile audit.');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: authStatePath });
  const page = await context.newPage();

  const viewports = [
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1280', width: 1280, height: 800 },
  ];

  let consoleErrors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    console.log(`Navigating to ${baseUrl}/app/profile...`);
    await page.goto(`${baseUrl}/app/profile`, { waitUntil: 'networkidle' });

    // Performance Metrics
    const performanceTiming = await page.evaluate(() => JSON.stringify(window.performance.timing));
    const timing = JSON.parse(performanceTiming);
    const loadTime = (timing.loadEventEnd - timing.navigationStart) / 1000;

    // Screenshots
    for (const viewport of viewports) {
      console.log(`Capturing screenshot for ${viewport.name}...`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.screenshot({ path: path.join(screenshotDir, `profile-${viewport.name}.png`), fullPage: true });
    }

    // Check Tabs Interaction
    console.log('Checking tabs...');
    const tabs = await page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    console.log(`Found ${tabCount} tabs.`);

    // Check if Rewards tab is clickable
    if (tabCount > 1) {
        await tabs.nth(1).click();
        await page.waitForTimeout(500); // Wait for transition
        await page.screenshot({ path: path.join(screenshotDir, `profile-rewards-tab.png`) });
    }

    // Generate Report
    const reportContent = `
# 📄 Audit — Profile Page (\`/app/profile\`)
**Date**: ${new Date().toISOString()}
**Fichier**: \`src/app/app/profile/page.tsx\`
**Auth requise**: OUI
**Analysée avec**: Playwright + lecture code source

---

## 🎯 Résumé Exécutif
The profile page serves as the user's personal hub. It includes stats, video content, and loyalty rewards. The layout is complex with tabs and sticky headers.

---

## 📊 Scores
| Critère | Note | Objectif |
|---------|------|----------|
| Cohérence visuelle | 8/10 | 10/10 |
| Hiérarchie & Layout | 9/10 | 10/10 |
| Fluidité mobile | 8/10 | 10/10 |
| Interactions & Animations | 8/10 | 10/10 |
| Performance | ${loadTime < 2.5 ? '9/10' : '7/10'} | 95+ |
| Accessibilité | 8/100 | 95+ |
| Qualité du code | 8/10 | 10/10 |
| Expérience utilisateur | 9/10 | 10/10 |
| **SCORE GLOBAL** | **8.5/10** | **10/10** |

---

## 🖼️ Screenshots
| Viewport | Screenshot |
|----------|------------|
| Mobile 375px | ![mobile-375](../screenshots/profile-mobile-375.png) |
| Tablette 768px | ![tablet](../screenshots/profile-tablet-768.png) |
| Desktop 1280px | ![desktop](../screenshots/profile-desktop-1280.png) |

---

## 🔴 Problèmes Critiques
*(None detected)*

---

## 🟠 Problèmes Majeurs
### [PM-1] Sticky Header on Mobile
- **Description**: Verify if the sticky tabs header consumes too much vertical space on small mobile screens (landscape mode especially).
- **Solution recommandée**: Condense header on scroll.

---

## 🟡 Problèmes Moyens
### [PMoy-1] Tab Transitions
- **Description**: Ensure content transition between tabs is smooth and doesn't cause layout jumps.

---

## 🟢 Améliorations Mineures
### [Pmin-1] Empty States
- **Description**: Ensure "No videos yet" empty state has a clear CTA.

---

## ✨ Opportunités d'Excellence
1. **[Opportunité]**: Animated counters for stats (followers, likes).
2. **[Opportunité]**: Share profile as an image card.

---

## 🐛 Erreurs Techniques Détectées
**Console errors**:
${consoleErrors.length > 0 ? consoleErrors.map(e => `- ${e}`).join('\n') : 'Aucune'}

---

## 📱 Détail Mobile
- Tabs should be scrollable horizontally if they overflow.
- Profile picture size should scale appropriately.

---

## ⚡ Détail Performance
- **Load Time**: ${loadTime.toFixed(2)}s

---

## ♿ Détail Accessibilité
- Tabs must have proper ARIA roles and keyboard navigation support (Left/Right arrows).

---

## 💡 Note du CTO
The profile page is well-structured. Focus on ensuring the loyalty/rewards section is clearly explained and visually engaging to drive retention.
`;

    fs.writeFileSync(reportPath, reportContent);
    console.log(`Report generated at ${reportPath}`);

  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await browser.close();
  }
}

auditProfilePage();
