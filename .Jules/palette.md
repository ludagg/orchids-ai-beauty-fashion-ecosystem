## 2025-05-14 - [Accessibility Baseline for Landing Page]
**Learning:** The landing page used several icon-only buttons (menu, carousel nav, play button) and custom interactive elements (carousel dots) without ARIA labels or explicit focus-visible states, making it difficult for screen reader and keyboard users.
**Action:** Always ensure icon-only buttons have `aria-label` and custom interactive elements have both `aria-label` and `aria-current` (or equivalent) states, along with `focus-visible:ring` for keyboard visibility.
