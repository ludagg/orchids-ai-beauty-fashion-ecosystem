import { test, expect } from '@playwright/test';

test.describe('Visual Consistency Audit', () => {
  test('Homepage visual consistency', async ({ page }) => {
    await page.goto('/');

    // Check fonts
    const bodyFont = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
    });
    console.log(`Body font: ${bodyFont}`);

    // Check headings
    const h1 = page.locator('h1').first();
    if(await h1.isVisible()){
        const h1Font = await h1.evaluate((el) => window.getComputedStyle(el).fontFamily);
        console.log(`H1 font: ${h1Font}`);
    }

    // Check colors (sample a button)
    const button = page.locator('button').first();
    if(await button.isVisible()){
        const bg = await button.evaluate((el) => window.getComputedStyle(el).backgroundColor);
        console.log(`Button bg: ${bg}`);
    }
  });

  test('Mobile Responsiveness Check', async ({ page }) => {
      await page.goto('/');
      // Verify no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance

      // Check tap targets
      const buttons = page.locator('button');
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        if (box) {
           // This is a soft check, just logging small targets
           if(box.width < 44 || box.height < 44) {
               console.warn(`Button ${i} is too small: ${box.width}x${box.height}`);
           }
        }
      }
  });
});
