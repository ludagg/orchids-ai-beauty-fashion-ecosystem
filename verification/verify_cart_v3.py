from playwright.sync_api import sync_playwright, expect
import time

def verify_cart(page, context):
    # Set a dummy session cookie to bypass middleware redirect
    print("Setting dummy session cookie...")
    context.add_cookies([{
        'name': 'better-auth.session_token',
        'value': 'dummy-token',
        'domain': 'localhost',
        'path': '/'
    }])

    # Navigate to the cart page
    print("Navigating to /app/cart...")
    page.goto("http://localhost:3000/app/cart")

    # Wait for hydration and potential fetch (which might fail but the UI should show something)
    time.sleep(5)

    # Take screenshot of the cart page
    print("Taking screenshot of cart page...")
    page.screenshot(path="verification/cart_page_with_cookie.png")

    # Check if empty state is visible
    try:
        expect(page.get_by_text("Your cart is empty")).to_be_visible(timeout=5000)
        print("Empty cart state verified!")
    except Exception as e:
        print(f"Empty cart state not found or error: {e}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set viewport to desktop
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        try:
            verify_cart(page, context)
        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error_state_3.png")
        finally:
            browser.close()
