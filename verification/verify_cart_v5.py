from playwright.sync_api import sync_playwright, expect
import time

def verify_cart():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context with dummy cookie
        context = browser.new_context()
        context.add_cookies([{
            'name': 'better-auth.session_token',
            'value': 'dummy-token',
            'domain': 'localhost',
            'path': '/',
        }])

        page = context.new_page()

        try:
            print('Navigating to http://localhost:3000/app/cart...')
            page.goto('http://localhost:3000/app/cart')

            # Wait for hydration/rendering
            time.sleep(5)

            # Check for the empty cart title
            print('Checking for "Your cart is empty" title...')
            empty_title = page.locator('text=Your cart is empty')
            if empty_title.is_visible():
                print('Found empty cart title!')
            else:
                print('Empty cart title not visible. Taking error screenshot.')
                page.screenshot(path='verification/cart_error_v5.png')
                # If we are redirected to auth, the title won't be there
                if "/auth/sign-in" in page.url:
                    print(f'Redirected to sign-in: {page.url}')

            # Take a screenshot of whatever is there
            page.screenshot(path='verification/cart_final_v5.png', full_page=True)
            print('Screenshot saved to verification/cart_final_v5.png')

        except Exception as e:
            print(f'Verification failed: {e}')
            page.screenshot(path='verification/cart_exception_v5.png')
        finally:
            browser.close()

if __name__ == "__main__":
    verify_cart()
