from playwright.sync_api import sync_playwright, expect
import time

def verify_marketplace():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print('Navigating to http://localhost:3000/app/marketplace...')
            page.goto('http://localhost:3000/app/marketplace')

            # Wait for hydration
            time.sleep(5)

            print(f'Current URL: {page.url}')

            # Check for CartIcon in the header
            # It should have the new icon (ShoppingCart) and aria-label
            cart_button = page.locator('a[href="/app/cart"]').first
            if cart_button.is_visible():
                print('Found CartIcon!')
                aria_label = cart_button.get_attribute('aria-label')
                print(f'CartIcon aria-label: {aria_label}')
            else:
                print('CartIcon not found.')

            # Take a screenshot
            page.screenshot(path='verification/marketplace_header.png')
            print('Screenshot saved to verification/marketplace_header.png')

        except Exception as e:
            print(f'Verification failed: {e}')
        finally:
            browser.close()

if __name__ == "__main__":
    verify_marketplace()
