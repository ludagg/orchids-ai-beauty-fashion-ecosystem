import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        email = f"joe.tester{int(time.time())}@example.com"
        password = "Password123!"

        print("Navigating to http://localhost:3000/auth/sign-up")
        await page.goto("http://localhost:3000/auth/sign-up")
        await page.wait_for_load_state("networkidle")

        # Click reject all cookies if present
        try:
            await page.get_by_role("button", name="Reject All").click(timeout=3000)
            print("Rejected cookies")
        except Exception:
            pass

        print(f"Filling form with {email}...")
        await page.get_by_label("First Name").fill("Joe")
        await page.get_by_label("Last Name").fill("Tester")

        # Sex dropdown
        await page.locator("button[role='combobox']").click()
        await page.get_by_role("option", name="Male", exact=True).click()

        await page.locator("input[name='phone']").fill("+15555555555")
        await page.locator("input[name='country']").fill("USA")
        await page.locator("input[name='city']").fill("New York")

        await page.get_by_label("Email").fill(email)

        await page.get_by_label("Password", exact=True).fill(password)
        await page.get_by_label("Confirm Password").fill(password)

        await page.locator("input[name='terms']").check()

        await page.get_by_role("button", name="Create Account").click()
        print("Submitted form. Waiting for navigation...")

        try:
            # Note: the signup flow in sign-up/page.tsx redirects to /app directly on success
            await page.wait_for_url("**/app**", timeout=15000)
            print("Navigated to App page directly!")
        except Exception as e:
            print("Timed out waiting for dashboard url", e)
            await page.screenshot(path="post_signup.png", full_page=True)

        await page.wait_for_timeout(3000)
        print("Taking screenshot...")
        await page.screenshot(path="dashboard.png", full_page=True)
        await browser.close()
        print("Done. Screenshot saved to dashboard.png")

if __name__ == "__main__":
    asyncio.run(main())
