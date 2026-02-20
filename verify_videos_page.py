from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Set context with cookies - assuming "better-auth.session_token" based on docs
    # If not working, I'll try just "session_token"
    context = browser.new_context()
    context.add_cookies([
        {
            "name": "better-auth.session_token",
            "value": "hrzRlAl6nR8EoRCDSHiC3",
            "domain": "localhost",
            "path": "/"
        }
    ])

    page = context.new_page()

    # 1. Navigate to Videos Page
    print("Navigating to /app/videos-creations...")
    page.goto("http://localhost:3000/app/videos-creations")

    # Wait for content to load
    try:
        page.wait_for_load_state("networkidle", timeout=10000)
    except:
        print("Timeout waiting for networkidle, proceeding...")

    # Check for redirection (if login failed)
    if "auth" in page.url or "login" in page.url:
        print("Redirected to Login - Authentication Failed")

    # Check key elements
    # Stories Rail - My Story
    try:
        # Looking for text inside the rail
        page.wait_for_selector('text="My Story"', timeout=5000)
        print("✅ Found 'My Story' in StoriesRail")
    except Exception as e:
        print(f"❌ 'My Story' not found: {e}")

    # Popular Searches
    try:
        page.wait_for_selector('text="Popular Searches"', timeout=5000)
        print("✅ Found 'Popular Searches' section")
    except Exception as e:
        print(f"❌ 'Popular Searches' not found: {e}")

    # Tabs
    try:
        page.wait_for_selector('button:has-text("For You")', timeout=5000)
        print("✅ Found 'For You' Tab")
        page.wait_for_selector('button:has-text("Following")', timeout=5000)
        print("✅ Found 'Following' Tab")
    except Exception as e:
        print(f"❌ Tabs not found: {e}")

    # Take Screenshot
    page.screenshot(path="verification.png", full_page=True)
    print("Screenshot saved to verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
