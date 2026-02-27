
import { test, expect } from '@playwright/test';

test('Shop Page Filter Test', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:3000/auth/sign-in');
  await page.fill('input[type="email"]', 'aggax27@gmail.com');
  await page.fill('input[type="password"]', '12345678');
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/app/, { timeout: 30000 });

  // Go to the shop page
  await page.goto('http://localhost:3000/app/shop');

  // Wait for "All Products" section which should always be there.
  await expect(page.locator('h2').filter({ hasText: 'All Products' })).toBeVisible({ timeout: 15000 });

  // Open Filters
  await page.getByRole('button', { name: 'Filters' }).click();

  // Verify Filter Sheet is open
  await expect(page.getByRole('heading', { name: 'Filter Products' })).toBeVisible();

  // Interact with filters: Toggle "In Stock Only"
  // Assuming Switch component has a role of switch or checkbox
  await page.locator('button[role="switch"]').click();

  // Apply Filters
  await page.getByRole('button', { name: 'Show Results' }).click();

  // Verify "All Products" section is gone (Filtering Mode active)
  await expect(page.locator('h2').filter({ hasText: 'All Products' })).not.toBeVisible();

  // Verify "Filtered Results" or similar header appears
  await expect(page.locator('h2').filter({ hasText: 'Filtered Results' })).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'shop-filter-test.png', fullPage: true });
});
