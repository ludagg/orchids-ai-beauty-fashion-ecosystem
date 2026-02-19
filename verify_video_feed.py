from playwright.sync_api import sync_playwright

def verify_video_feed():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the video feed page
        page.goto("http://localhost:3000/app/videos-creations")

        # Wait for the video feed to load
        page.wait_for_selector("video")

        # Check if the "Like" button is visible
        like_button = page.get_by_role("button", name="0").first
        if like_button.is_visible():
            print("Like button found.")
        else:
            print("Like button not found.")

        # Check if the "Comment" button is visible
        comment_button = page.get_by_role("button", name="Comment").first
        if comment_button.is_visible():
            print("Comment button found.")
        else:
            print("Comment button not found.")

        # Check for explicit scroll buttons
        # They are hidden by default, so we need to hover over the feed
        feed_container = page.locator(".group\\/feed")
        feed_container.hover()

        # Now check for ChevronDown button
        # The button itself doesn't have text, but contains an icon.
        # We can find it by the lucide icon class or the container
        scroll_next_button = page.locator("button:has(.lucide-chevron-down)")
        if scroll_next_button.is_visible():
             print("Scroll Next button found.")
        else:
             print("Scroll Next button not visible.")

        # Take a screenshot
        page.screenshot(path="/home/jules/verification/video_feed_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_video_feed()
