import { test, expect, type Page } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const routesToTest = [
  '/',
  '/about',
  '/blog',
  '/careers',
  '/contact',
  '/cookies',
  '/help',
  '/press',
  '/privacy',
  '/terms',
  '/auth/sign-in',
  '/auth/sign-up',
  '/app',
  '/app/search',
  '/app/shop',
  '/app/marketplace',
  '/app/ai-stylist',
  '/app/videos-creations',
];

interface PageAudit {
  url: string;
  status: 'passed' | 'failed';
  consoleErrors: string[];
  loadTime: number;
  viewport: string;
}

const auditResults: PageAudit[] = [];

async function auditPage(page: Page, url: string, viewport: string): Promise<PageAudit> {
  const consoleErrors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  const startTime = Date.now();
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  const status = response?.ok() && consoleErrors.length === 0 ? 'passed' : 'failed';

  return {
    url,
    status,
    consoleErrors,
    loadTime,
    viewport,
  };
}

test.describe('Crawl Audit', () => {
  test.afterAll(async () => {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const summary = {
      timestamp: new Date().toISOString(),
      totalPages: auditResults.length,
      passed: auditResults.filter(r => r.status === 'passed').length,
      failed: auditResults.filter(r => r.status === 'failed').length,
      averageLoadTime: Math.round(
        auditResults.reduce((acc, r) => acc + r.loadTime, 0) / auditResults.length
      ),
      results: auditResults,
    };

    fs.writeFileSync(
      path.join(reportsDir, 'crawl-audit.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n📊 Crawl Audit Summary:');
    console.log(`Total pages: ${summary.totalPages}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏱️ Average load time: ${summary.averageLoadTime}ms`);
  });

  for (const route of routesToTest) {
    test(`Desktop: ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const result = await auditPage(page, route, '1920x1080');
      auditResults.push(result);

      if (result.status === 'failed') {
        console.log(`\n❌ ${route} failed:`);
        console.log(`   Console errors: ${result.consoleErrors.length}`);
        result.consoleErrors.forEach(err => console.log(`   - ${err}`));
      }

      expect(result.status).toBe('passed');
    });

    test(`Mobile: ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      const result = await auditPage(page, route, '375x812');
      auditResults.push(result);

      if (result.status === 'failed') {
        console.log(`\n❌ ${route} (mobile) failed:`);
        console.log(`   Console errors: ${result.consoleErrors.length}`);
      }
    });
  }
});
