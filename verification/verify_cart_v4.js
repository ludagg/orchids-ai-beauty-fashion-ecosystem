import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Add a dummy session cookie to bypass middleware
  await context.addCookies([{
    name: 'better-auth.session_token',
    value: 'dummy-token',
    domain: 'localhost',
    path: '/',
  }]);

  const page = await context.newPage();

  try {
    console.log('Navigating to http://localhost:3000/app/cart...');
    await page.goto('http://localhost:3000/app/cart');

    // Wait for the empty state to appear
    console.log('Waiting for "Your cart is empty" text...');
    await page.waitForSelector('text=Your cart is empty', { timeout: 15000 });

    // Check for the premium styling elements
    const radialGrid = await page.locator('.bg-\\[radial-gradient\\]').count();
    console.log(`Found ${radialGrid} radial grid elements`);

    const animatedBlob = await page.locator('.bg-rose-500.rounded-full.blur-\\[100px\\]').count();
    console.log(`Found ${animatedBlob} animated blob elements`);

    const startShoppingButton = await page.locator('button:has-text("Start Shopping")');
    const buttonHref = await startShoppingButton.evaluate(el => el.textContent);
    console.log('Found Start Shopping button');

    // Take a screenshot
    await page.screenshot({ path: 'verification/cart_empty_state.png', fullPage: true });
    console.log('Screenshot saved to verification/cart_empty_state.png');

  } catch (error) {
    console.error('Verification failed:', error);
    await page.screenshot({ path: 'verification/cart_error.png' });
  } finally {
    await browser.close();
  }
}

verify();
