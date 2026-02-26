
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';

const routes = [
  '/',
  '/auth/sign-in',
  '/become-partner',
  '/app/search',
  '/app/marketplace',
  '/contact',
  '/about',
  '/privacy',
  '/terms',
  '/help',
  '/app',
  '/careers',
  '/press'
];

interface AuditResult {
  route: string;
  screenshots: {
    desktop: string;
    mobile: string;
  };
  performance: {
    navigation: any;
    paint: any;
  };
  accessibility: any;
  consoleErrors: any[];
  networkErrors: any[];
}

const auditResults: AuditResult[] = [];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  console.log('Starting audit...');

  for (const route of routes) {
    console.log(`Auditing ${route}...`);
    const page = await context.newPage();
    const consoleErrors: any[] = [];
    const networkErrors: any[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', request => {
      networkErrors.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
    });

    try {
      // Mobile Viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
      const mobileScreenshotPath = `reports/screenshots/mobile_${route.replace(/\//g, '_') || 'home'}.png`;
      fs.mkdirSync('reports/screenshots', { recursive: true });
      await page.screenshot({ path: mobileScreenshotPath });

      // Desktop Viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.reload({ waitUntil: 'networkidle' }); // Reload for desktop metrics
      const desktopScreenshotPath = `reports/screenshots/desktop_${route.replace(/\//g, '_') || 'home'}.png`;
      await page.screenshot({ path: desktopScreenshotPath });

      // Performance Metrics
      const navigationEntries = await page.evaluate(() => JSON.stringify(performance.getEntriesByType('navigation')));
      const paintEntries = await page.evaluate(() => JSON.stringify(performance.getEntriesByType('paint')));

      // Accessibility Check
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      auditResults.push({
        route,
        screenshots: {
          desktop: desktopScreenshotPath,
          mobile: mobileScreenshotPath
        },
        performance: {
          navigation: JSON.parse(navigationEntries),
          paint: JSON.parse(paintEntries)
        },
        accessibility: accessibilityScanResults.violations, // Only storing violations to save space
        consoleErrors,
        networkErrors
      });

    } catch (error) {
      console.error(`Error auditing ${route}:`, error);
      auditResults.push({
        route,
        screenshots: { desktop: '', mobile: '' },
        performance: { navigation: {}, paint: {} },
        accessibility: {},
        consoleErrors: [`Audit script error: ${error}`],
        networkErrors: []
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  fs.writeFileSync('audit-results.json', JSON.stringify(auditResults, null, 2));
  console.log('Audit complete. Results saved to audit-results.json');
})();
