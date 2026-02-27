from playwright.sync_api import sync_playwright

def verify_fixes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Verify Cookie Banner Fix
        print("Verifying Cookie Banner...")
        page.goto("http://localhost:3000")
        page.wait_for_selector("text=Reject All", timeout=5000)
        page.screenshot(path="verification/cookie_banner.png")
        print("Cookie banner screenshot taken.")

        # 2. Verify Forgot Password Page
        print("Verifying Forgot Password Page...")
        page.goto("http://localhost:3000/auth/forgot-password")
        page.wait_for_selector("input[type=email]", timeout=5000)
        page.screenshot(path="verification/forgot_password.png")
        print("Forgot password page screenshot taken.")

        # 3. Verify Geolocation Error Handling (Simulated by not granting permission in headless)
        # Note: Headless browsers usually default to denying or asking, and our code should handle the denial/timeout gracefully.
        print("Verifying Search Page Geolocation...")
        page.goto("http://localhost:3000/app/search")
        # Click "Near Me" to trigger geolocation request
        page.click("text=Near Me")
        # Expect a toast error or at least no crash
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/geolocation_handling.png")
        print("Geolocation handling screenshot taken.")

        # 4. Verify Autocomplete Attributes
        print("Verifying Autocomplete Attributes...")
        page.goto("http://localhost:3000/auth/sign-in")
        password_input = page.locator("input[type=password]")
        autocomplete_attr = password_input.get_attribute("autocomplete")
        print(f"Sign-in password autocomplete: {autocomplete_attr}")
        if autocomplete_attr == "current-password":
            print("✅ Sign-in autocomplete is correct.")
        else:
            print("❌ Sign-in autocomplete is INCORRECT.")

        page.goto("http://localhost:3000/auth/sign-up")
        signup_password_input = page.locator("input[name=password]")
        signup_autocomplete = signup_password_input.get_attribute("autocomplete")
        print(f"Sign-up password autocomplete: {signup_autocomplete}")
        if signup_autocomplete == "new-password":
            print("✅ Sign-up autocomplete is correct.")
        else:
             print("❌ Sign-up autocomplete is INCORRECT.")

        browser.close()

if __name__ == "__main__":
    verify_fixes()
