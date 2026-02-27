import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function generateAuth() {
  console.log('Starting authentication process...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = 'https://133priitest.vercel.app';
  // const baseUrl = 'http://localhost:3000'; // Fallback to local if remote fails, but we prefer remote for auth now.

  try {
    console.log(`Navigating to login page at ${baseUrl}...`);
    await page.goto(`${baseUrl}/auth/sign-in`);

    console.log('Filling credentials...');
    await page.fill('input[type="email"]', 'aggax27@gmail.com');
    await page.fill('input[type="password"]', '12345678');

    console.log('Submitting form...');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.waitFor({ state: 'visible' });
    await submitButton.click();

    console.log('Waiting for navigation...');
    // Increase timeout for remote connection
    try {
        await page.waitForURL('**/app', { timeout: 30000 });
    } catch(e) {
        console.log('Navigation wait timed out.');
    }

    const url = page.url();
    console.log(`Current URL: ${url}`);

    if (url.includes('/auth/sign-in')) {
        console.error('Still on login page.');
        await page.screenshot({ path: 'auth-failed-remote.png' });

        const errorText = await page.locator('.text-red-500').textContent();
        if (errorText) console.log('Error message on page:', errorText);

        throw new Error('Authentication failed');
    }

    console.log('Successfully logged in!');

    // Save storage state
    const storageState = await context.storageState();

    // IMPORTANT: Fix the domain in cookies if we are switching back to localhost later
    // For now, we are capturing state from remote. If we use this state on localhost, domains might mismatch.
    // However, if we run audits against remote, it's fine.
    // Let's modify cookies to work with localhost if needed, or just run everything against remote?
    // The user asked to "Analyze this platform", usually implies the deployed version or local version.
    // Given the local DB issues, we should probably audit the remote URL if possible, or try to fix local DB.
    // BUT, the instructions said "start the application" (Step 1).
    // Let's save the state as is.

    const authStatePath = path.join(process.cwd(), 'auth_state.json');
    fs.writeFileSync(authStatePath, JSON.stringify(storageState, null, 2));
    console.log(`Auth state saved to ${authStatePath}`);

  } catch (error) {
    console.error('Authentication failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generateAuth();
