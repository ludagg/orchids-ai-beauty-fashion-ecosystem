## 2025-05-15 - [Keyboard Accessibility Foundations]
**Learning:** For landing pages with many interactive elements, default focus states are often insufficient or missing. A "Skip to Content" link paired with consistent `focus-visible` ring indicators significantly improves the experience for power users and those with accessibility needs without affecting the visual design for mouse users.
**Action:** Always implement a "Skip to Content" link as the first element in `layout.tsx` and ensure interactive elements (buttons, links, inputs) have visible focus states using `focus-visible:ring-2`.
