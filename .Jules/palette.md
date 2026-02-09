## 2026-02-03 - [Landing Page Accessibility Audit]
**Learning:** Found several common accessibility gaps: non-semantic elements used for buttons (divs), hover-only interactions that are invisible to keyboard users, and missing descriptive ARIA labels for icon-only components.
**Action:** Always check for interactive elements that don't use `<button>` or `<a>` tags. Ensure all `group-hover` effects that reveal information or controls have corresponding `focus-within` or `focus` states. Include a 'Skip to Content' link in every layout.
