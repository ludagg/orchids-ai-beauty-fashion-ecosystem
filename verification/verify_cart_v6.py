from playwright.sync_api import sync_playwright, expect
import time

def verify_cart_v6():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print('Navigating to http://localhost:3000/app/cart...')
            # Use a longer timeout and wait until network is idle
            page.goto('http://localhost:3000/app/cart', wait_until='networkidle', timeout=30000)

            print(f'Final URL: {page.url}')

            # Wait a bit more for client-side rendering
            time.sleep(5)

            # Take a screenshot
            page.screenshot(path='verification/cart_final_v6.png', full_page=True)
            print('Screenshot saved to verification/cart_final_v6.png')

            # Check content
            content = page.content()
            if "Your cart is empty" in content:
                print('Success: Found "Your cart is empty" text')
            else:
                print('Failure: "Your cart is empty" text NOT found')

        except Exception as e:
            print(f'Verification failed: {e}')
        finally:
            browser.close()

if __name__ == "__main__":
    verify_cart_v6()
