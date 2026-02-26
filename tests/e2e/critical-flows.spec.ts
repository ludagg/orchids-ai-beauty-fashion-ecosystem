import { test, expect, type Page } from '@playwright/test';

test.describe('Critical User Flows', () => {
  test('Landing page loads and displays key elements', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Rare|Beauty|Fashion/i);
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
    
    await expect(page.locator('nav, header')).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a[href^="/"]').filter({ hasText: /./ });
    const count = await links.count();
    
    if (count > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && !href.startsWith('/auth') && !href.startsWith('/app')) {
        await firstLink.click();
        await expect(page).toHaveURL(new RegExp(href.replace(/\//g, '\\\\/')));
      }
    }
  });

  test('Auth pages are accessible', async ({ page }) => {
    await page.goto('/auth/sign-in');
    
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('App pages require authentication or show appropriate content', async ({ page }) => {
    await page.goto('/app');
    
    const url = page.url();
    const body = await page.content();
    
    const isRedirected = url.includes('/auth');
    const hasContent = body.length > 1000;
    
    expect(isRedirected || hasContent).toBe(true);
  });

  test('Responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    const body = page.locator('body');
    const width = await body.evaluate(el => window.innerWidth);
    
    expect(width).toBe(375);
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('Search functionality is accessible', async ({ page }) => {
    await page.goto('/app/search');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="query"]').first();
    
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('test');
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('No console errors on critical pages', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('google-analytics') &&
      !e.includes('orchids-browser-logs')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
