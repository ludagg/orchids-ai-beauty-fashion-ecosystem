import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface WebVitals {
  lcp: number;
  cls: number;
  inp?: number;
  ttfb: number;
  fcp: number;
}

interface PerformanceResult {
  url: string;
  viewport: string;
  vitals: WebVitals;
  resourceCount: number;
  totalPageSize: number;
  jsSize: number;
  status: 'passed' | 'warning' | 'failed';
}

const performanceResults: PerformanceResult[] = [];

const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  cls: { good: 0.1, poor: 0.25 },
  ttfb: { good: 600, poor: 800 },
  fcp: { good: 1800, poor: 3000 },
};

async function measureWebVitals(page: Page): Promise<WebVitals> {
  return await page.evaluate(() => {
    return new Promise<WebVitals>((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1] as PerformanceEntry;
        
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        const fcpEntry = paint.find(p => p.name === 'first-contentful-paint');

        resolve({
          lcp: lcpEntry?.startTime || 0,
          cls: 0,
          ttfb: navigation?.responseStart || 0,
          fcp: fcpEntry?.startTime || 0,
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      setTimeout(() => {
        observer.disconnect();
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        const fcpEntry = paint.find(p => p.name === 'first-contentful-paint');
        
        resolve({
          lcp: 0,
          cls: 0,
          ttfb: navigation?.responseStart || 0,
          fcp: fcpEntry?.startTime || 0,
        });
      }, 5000);
    });
  });
}

async function measurePerformance(page: Page, url: string, viewport: string): Promise<PerformanceResult> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const vitals = await measureWebVitals(page);

  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      size: (r as PerformanceResourceTiming).transferSize || 0,
      type: r.initiatorType,
    }));
  });

  const resourceCount = resources.length;
  const totalPageSize = resources.reduce((acc, r) => acc + r.size, 0);
  const jsSize = resources
    .filter(r => r.type === 'script' || r.name.endsWith('.js'))
    .reduce((acc, r) => acc + r.size, 0);

  const status: 'passed' | 'warning' | 'failed' = 
    vitals.lcp > THRESHOLDS.lcp.poor || vitals.ttfb > THRESHOLDS.ttfb.poor
      ? 'failed'
      : vitals.lcp > THRESHOLDS.lcp.good || vitals.ttfb > THRESHOLDS.ttfb.good
      ? 'warning'
      : 'passed';

  return {
    url,
    viewport,
    vitals,
    resourceCount,
    totalPageSize,
    jsSize,
    status,
  };
}

test.describe('Performance Audit', () => {
  test.afterAll(async () => {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: performanceResults.length,
      passed: performanceResults.filter(r => r.status === 'passed').length,
      warning: performanceResults.filter(r => r.status === 'warning').length,
      failed: performanceResults.filter(r => r.status === 'failed').length,
      averageLCP: Math.round(
        performanceResults.reduce((acc, r) => acc + r.vitals.lcp, 0) / performanceResults.length
      ),
      averageTTFB: Math.round(
        performanceResults.reduce((acc, r) => acc + r.vitals.ttfb, 0) / performanceResults.length
      ),
      results: performanceResults,
    };

    fs.writeFileSync(
      path.join(reportsDir, 'performance-audit.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n⚡ Performance Audit Summary:');
    console.log(`Total tests: ${summary.totalTests}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`⚠️ Warning: ${summary.warning}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`📊 Average LCP: ${summary.averageLCP}ms`);
    console.log(`📊 Average TTFB: ${summary.averageTTFB}ms`);
  });

  const criticalPages = ['/', '/app', '/app/shop', '/auth/sign-in'];

  for (const page of criticalPages) {
    test(`Performance: ${page} (Desktop)`, async ({ page: p }) => {
      await p.setViewportSize({ width: 1920, height: 1080 });
      const result = await measurePerformance(p, page, '1920x1080');
      performanceResults.push(result);

      console.log(`\n📄 ${page} (${result.viewport}):`);
      console.log(`   LCP: ${result.vitals.lcp.toFixed(0)}ms ${result.vitals.lcp > THRESHOLDS.lcp.good ? '⚠️' : '✅'}`);
      console.log(`   TTFB: ${result.vitals.ttfb.toFixed(0)}ms ${result.vitals.ttfb > THRESHOLDS.ttfb.good ? '⚠️' : '✅'}`);
      console.log(`   Resources: ${result.resourceCount}`);
      console.log(`   Page size: ${(result.totalPageSize / 1024 / 1024).toFixed(2)}MB`);

      expect(result.status).not.toBe('failed');
    });
  }
});
