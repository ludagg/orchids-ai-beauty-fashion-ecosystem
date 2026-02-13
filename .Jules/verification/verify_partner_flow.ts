import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for a desktop-like experience
  await page.setViewportSize({ width: 1280, height: 720 });

  try {
    // Navigate to the Creator Studio page
    // Note: In a real app with auth, we might need to bypass login or mock it.
    // For this prototype, we assume the page is accessible or we can visit it directly.
    // Adjust the URL if the dev server port is different.
    await page.goto('http://localhost:3000/app/creator-studio', { waitUntil: 'networkidle' });

    console.log('Navigated to Creator Studio');

    // 1. Check for "Become a Partner" button
    const partnerBtn = page.getByRole('button', { name: 'Become a Partner' });
    if (await partnerBtn.isVisible()) {
        console.log('"Become a Partner" button is visible');

        // 2. Click the button to open the dialog
        await partnerBtn.click();
        console.log('Clicked "Become a Partner"');

        // 3. Fill out the form
        await page.getByLabel('Business Name').fill('My Awesome Salon');

        // Select 'Salon' type (it might be a select dropdown)
        // Radix UI Selects are a bit tricky, often requiring clicking the trigger then the option.
        const typeTrigger = page.locator('button[role="combobox"]');
        if(await typeTrigger.isVisible()) {
            await typeTrigger.click();
            await page.getByRole('option', { name: 'Salon (Services)' }).click();
        }

        await page.getByLabel('Description').fill('The best salon in town.');
        await page.getByLabel('Address').fill('123 Main St');
        await page.getByLabel('Phone').fill('555-0123');

        console.log('Filled form');

        // 4. Submit the form
        await page.getByRole('button', { name: 'Submit Application' }).click();
        console.log('Submitted form');

        // Wait for UI to update (Badge should change to Partner, Services tab should appear)
        await page.waitForTimeout(1000);

        // 5. Verify status change
        // We look for the badge text. It was 'Creator' before, now should be 'Partner'
        const badge = page.locator('.badge'); // simplified selector, might need adjustment
        // Or check text directly
        const partnerBadge = page.getByText('Partner', { exact: true });
        if(await partnerBadge.isVisible()) {
            console.log('Partner badge is visible');
        } else {
             console.log('Partner badge NOT visible');
        }

        // 6. Check for "Services" tab
        const servicesTab = page.getByRole('tab', { name: 'Services' });
        if(await servicesTab.isVisible()) {
            console.log('Services tab is visible');
            await servicesTab.click();
            await page.waitForTimeout(500);

            // 7. Click "Add Service"
            // Since window.prompt is used, we need to handle the dialog
            page.on('dialog', async dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                await dialog.accept('Test Service'); // Accept first prompt (Name)
                 // Note: The code calls prompt twice. Playwright might handle them sequentially if we set up handlers.
                 // However, simpler to just verify the button exists for now.
            });

             // Triggering the add service flow might be complex with double prompts in a script without careful event handling.
             // We'll just verify the "Add Service" button is there.
             const addServiceBtn = page.getByRole('button', { name: 'Add Service' });
             if(await addServiceBtn.isVisible()) {
                 console.log('"Add Service" button found');
             }
        }

    } else {
        console.log('"Become a Partner" button NOT found (maybe already partner?)');
    }

    // Take a screenshot of the final state
    await page.screenshot({ path: '.Jules/verification/partner_flow.png', fullPage: true });
    console.log('Screenshot saved to .Jules/verification/partner_flow.png');

  } catch (error) {
    console.error('Error during test:', error);
     await page.screenshot({ path: '.Jules/verification/error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
