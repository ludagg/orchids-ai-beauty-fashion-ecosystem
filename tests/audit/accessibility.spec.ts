import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

interface AccessibilityResult {
  url: string;
  viewport: string;
  violations: AxeViolation[];
  passes: number;
  incomplete: number;
  status: 'passed' | 'warning' | 'failed';
}

const accessibilityResults: AccessibilityResult[] = [];

async function runAxe(page: Page): Promise<{ violations: AxeViolation[]; passes: number; incomplete: number }> {
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js',
  });

  await page.waitForFunction(() => typeof (window as any).axe !== 'undefined');

  return await page.evaluate(async () => {
    const axe = (window as any).axe;
    const results = await axe.run(document, {
      rules: {
        'color-contrast': { enabled: true },
        'image-alt': { enabled: true },
        'label': { enabled: true },
        'link-name': { enabled: true },
        'button-name': { enabled: true },
        'heading-order': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true },
      },
    });

    return {
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
    };
  });
}

async function auditAccessibility(page: Page, url: string, viewport: string): Promise<AccessibilityResult> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const { violations, passes, incomplete } = await runAxe(page);

  const criticalOrSerious = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  const status: 'passed' | 'warning' | 'failed' = 
    criticalOrSerious.length > 0 ? 'failed' : violations.length > 0 ? 'warning' : 'passed';

  return {
    url,
    viewport,
    violations,
    passes,
    incomplete,
    status,
  };
}

test.describe('Accessibility Audit', () => {
  test.afterAll(async () => {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: accessibilityResults.length,
      passed: accessibilityResults.filter(r => r.status === 'passed').length,
      warning: accessibilityResults.filter(r => r.status === 'warning').length,
      failed: accessibilityResults.filter(r => r.status === 'failed').length,
      totalViolations: accessibilityResults.reduce((acc, r) => acc + r.violations.length, 0),
      criticalViolations: accessibilityResults.reduce(
        (acc, r) => acc + r.violations.filter(v => v.impact === 'critical').length, 0
      ),
      results: accessibilityResults,
    };

    fs.writeFileSync(
      path.join(reportsDir, 'accessibility-audit.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n♿ Accessibility Audit Summary:');
    console.log(`Total tests: ${summary.totalTests}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`⚠️ Warning: ${summary.warning}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`🚨 Total violations: ${summary.totalViolations}`);
    console.log(`🔴 Critical violations: ${summary.criticalViolations}`);
  });

  const pagesToTest = ['/', '/auth/sign-in', '/app', '/about'];

  for (const page of pagesToTest) {
    test(`Accessibility: ${page} (Desktop)`, async ({ page: p }) => {
      await p.setViewportSize({ width: 1920, height: 1080 });
      const result = await auditAccessibility(p, page, '1920x1080');
      accessibilityResults.push(result);

      console.log(`\n📄 ${page} (${result.viewport}):`);
      console.log(`   Violations: ${result.violations.length} ${result.violations.length > 0 ? '⚠️' : '✅'}`);
      console.log(`   Passes: ${result.passes}`);

      if (result.violations.length > 0) {
        console.log('   Issues:');
        result.violations.forEach(v => {
          console.log(`   - [${v.impact}] ${v.description}`);
        });
      }

      expect(result.status).not.toBe('failed');
    });
  }
});
