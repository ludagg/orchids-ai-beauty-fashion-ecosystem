from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Browser error: {exc}"))

    try:
        # Check robots.txt
        print("Checking robots.txt...")
        response = page.goto("http://localhost:3000/robots.txt")
        if response.status != 200:
            print(f"FAILED: robots.txt returned status {response.status}")
        else:
            print("PASSED: robots.txt accessible")

        # Check sitemap.xml
        print("Checking sitemap.xml...")
        response = page.goto("http://localhost:3000/sitemap.xml")
        if response.status != 200:
            print(f"FAILED: sitemap.xml returned status {response.status}")
        else:
            print("PASSED: sitemap.xml accessible")

        # Check Homepage
        print("Checking Homepage...")
        page.goto("http://localhost:3000/")

        # Wait for hydration
        page.wait_for_load_state("networkidle")

        # Check for cookie consent text visibility
        try:
            page.wait_for_selector("text=We use cookies", state="visible", timeout=5000)
            print("PASSED: Cookie Consent visible on screen")
        except:
            print("FAILED: Cookie Consent NOT visible on screen (but might be in DOM)")

        # Screenshot
        page.screenshot(path="verification.png")

        # Check JsonLd
        content = page.content()
        if 'application/ld+json' in content:
            print("PASSED: JSON-LD found")
        else:
            print("FAILED: JSON-LD not found")

    except Exception as e:
        print(f"Global Error: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
