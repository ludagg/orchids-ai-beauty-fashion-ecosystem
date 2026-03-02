from playwright.sync_api import sync_playwright, expect
import time

def verify_cart(page):
    # Go to the application dashboard first to ensure we are in the app layout
    print("Navigating to /app...")
    page.goto("http://localhost:3000/app")

    # Wait for the page to load
    time.sleep(5)

    # Take a screenshot of the dashboard to see the cart icon in header
    print("Taking screenshot of dashboard (header)...")
    page.screenshot(path="verification/dashboard_header.png")

    # Navigate to the cart page
    print("Navigating to /app/cart...")
    page.goto("http://localhost:3000/app/cart")

    # Wait for hydration and potential fetch
    time.sleep(5)

    # Check for empty cart state
    print("Verifying empty cart state...")
    expect(page.get_by_text("Your cart is empty")).to_be_visible()

    # Take screenshot of the empty cart state
    page.screenshot(path="verification/empty_cart.png")
    print("Empty cart screenshot saved.")

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
            # Take a screenshot of the error state if possible
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()
