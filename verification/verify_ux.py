from playwright.sync_api import Page, expect, sync_playwright
import time

def test_search_bar_ux(page: Page):
    page.set_viewport_size({"width": 1280, "height": 800})
    page.goto("http://localhost:3000/app/marketplace")
    page.wait_for_load_state("networkidle")

    search_input = page.locator("header").nth(1).get_by_label("Search")
    search_input.wait_for(state="visible")

    search_bar_container = search_input.locator("..")

    # 1. kbd hint
    kbd_hint = search_bar_container.locator("kbd")
    expect(kbd_hint).to_be_visible()

    # 2. Focus
    page.keyboard.press("Escape")
    page.keyboard.press("/")
    expect(search_input).to_be_focused()

    # 3. Clear button
    search_input.fill("test search")
    clear_button = search_bar_container.get_by_label("Clear search")
    expect(clear_button).to_be_visible()

    # 4. Clear action
    clear_button.click()
    expect(search_input).to_have_value("")

    # 5. Sidebar toggle (this one I kept)
    sidebar_toggle = page.get_by_label("Collapse sidebar")
    expect(sidebar_toggle).to_be_visible()
    sidebar_toggle.click()
    time.sleep(0.5)
    expect(page.get_by_label("Expand sidebar")).to_be_visible()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_search_bar_ux(page)
        finally:
            browser.close()
