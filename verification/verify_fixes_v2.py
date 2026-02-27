from playwright.sync_api import sync_playwright

def verify_fixes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1. Verify Cookie Banner Fix
        print("Verifying Cookie Banner...")
        page = browser.new_page()
        page.goto("http://localhost:3000")
        try:
            page.wait_for_selector("text=Reject All", timeout=5000)
            page.screenshot(path="verification/cookie_banner.png")
            print("Cookie banner screenshot taken.")
        except Exception as e:
            print(f"Cookie banner verification failed: {e}")

        # 2. Verify Forgot Password Page
        print("Verifying Forgot Password Page...")
        try:
            page.goto("http://localhost:3000/auth/forgot-password")
            page.wait_for_selector("input[type=email]", timeout=5000)
            page.screenshot(path="verification/forgot_password.png")
            print("Forgot password page screenshot taken.")
        except Exception as e:
            print(f"Forgot password page verification failed: {e}")

        # 3. Verify Geolocation Error Handling
        print("Verifying Search Page Geolocation...")
        try:
            page.goto("http://localhost:3000/app/search")
            # Try clicking Filters button if available
            try:
                page.click("text=Filters", timeout=3000)
                print("Clicked Filters button.")
            except:
                print("Filters button not found or not clickable.")

            try:
                # Look for "Near Me" button specifically
                page.click("text=Near Me", timeout=3000)
                print("Clicked Near Me button.")
                page.wait_for_timeout(2000)
                page.screenshot(path="verification/geolocation_handling.png")
                print("Geolocation handling screenshot taken.")
            except Exception as e:
                print(f"Near Me button issue: {e}")
        except Exception as e:
            print(f"Geolocation verification failed: {e}")

        # 4. Verify Autocomplete Attributes
        print("Verifying Autocomplete Attributes...")
        try:
            page.goto("http://localhost:3000/auth/sign-in")
            password_input = page.locator("input[id=password]")
            autocomplete_attr = password_input.get_attribute("autocomplete")
            print(f"Sign-in password autocomplete: {autocomplete_attr}")

            page.goto("http://localhost:3000/auth/sign-up")
            signup_password_input = page.locator("input[id=password]") # Assuming id="password" exists
            signup_autocomplete = signup_password_input.get_attribute("autocomplete")
            print(f"Sign-up password autocomplete: {signup_autocomplete}")

            if autocomplete_attr == "current-password" and signup_autocomplete == "new-password":
                 print("✅ Autocomplete attributes verified.")
            else:
                 print("❌ Autocomplete attributes verification FAILED.")

        except Exception as e:
             print(f"Autocomplete verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_fixes()
