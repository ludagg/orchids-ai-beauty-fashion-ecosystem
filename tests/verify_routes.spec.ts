import { test, expect } from '@playwright/test';

test.describe('Conversations and Bookings Verification', () => {
  test('Conversations page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/app/conversations');
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
  });

  test('Conversation detail page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/app/conversations/1');
    // Check for chat name in the header (h2 inside main area)
    await expect(page.locator('h2').filter({ hasText: 'Studio Épure' })).toBeVisible();
    // Check for "Messages" sidebar
    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
    await page.screenshot({ path: 'conversation_detail.png' });
  });

  test('Bookings page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/app/bookings');
    await expect(page.getByRole('heading', { name: 'Reservations & Orders' })).toBeVisible();
  });

  test('Booking detail page loads', async ({ page }) => {
    // We navigate to BK-1024
    await page.goto('http://localhost:3000/app/bookings/BK-1024');

    // Check for salon name
    await expect(page.getByRole('heading', { name: 'Aura Luxury Spa' })).toBeVisible();

    // Check for back link
    await expect(page.getByText('Back to Bookings')).toBeVisible();
    await page.screenshot({ path: 'booking_detail.png' });
  });
});
