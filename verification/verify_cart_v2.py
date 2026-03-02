from playwright.sync_api import sync_playwright, expect
import time

def verify_cart(page):
    # Go to a public page first to ensure we bypass initial auth if possible,
    # though middleware seems to redirect /app/cart to /auth/sign-in

    # Let's try to navigate to /app/marketplace which is public
    print("Navigating to /app/marketplace...")
    page.goto("http://localhost:3000/app/marketplace")
    time.sleep(5)

    # Take a screenshot of the marketplace to see the cart icon in header
    print("Taking screenshot of marketplace (header)...")
    page.screenshot(path="verification/marketplace_header.png")

    # In this environment, we might not be able to easily bypass the /app/cart auth redirect
    # unless we mock the session cookie.

    # Let's try to navigate to /app/cart anyway
    print("Navigating to /app/cart...")
    page.goto("http://localhost:3000/app/cart")
    time.sleep(3)

    # If it redirected to sign-in, we'll see the sign-in page
    if "auth/sign-in" in page.url:
        print("Redirected to sign-in page. This is expected without a session.")
        page.screenshot(path="verification/redirected_to_signin.png")
    else:
        # Wait for hydration and potential fetch
        time.sleep(5)
        # Take screenshot of the empty cart state (if we reached it)
        page.screenshot(path="verification/cart_page.png")
        print("Cart page screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set viewport to desktop
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        try:
            verify_cart(page)
        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error_state_2.png")
        finally:
            browser.close()
