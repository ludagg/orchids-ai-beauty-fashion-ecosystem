## 2026-02-10 - Enhancing Hero Background
**Learning:** Adding subtle background decorations like a dotted grid and animated blurred blobs can significantly improve the "premium" feel of a hero section without requiring complex assets or distracting the user.
**Action:** Use CSS radial-gradients for grids and framer-motion with blur filters for blobs to fill empty space elegantly.

## 2025-02-11 - Transition from Waitlist to App Experience
**Learning:** Transitioning from a "Waitlist" model to a "Get Started" model requires not just updating buttons, but creating a functional entry point that provides immediate value to guest users while maintaining the brand's premium aesthetic.
**Action:** Use high-quality dashboard layouts with Bento-style sections and guest-specific branding for application entry points to ensure a smooth onboarding experience.

## 2025-02-12 - Mobile-First Navigation with BottomNav
**Learning:** For complex SaaS or marketplace applications, a sidebar alone is insufficient for mobile. A fixed Bottom Navigation bar combined with horizontal-scrolling categories provides a much more "cool" and native app-like experience.
**Action:** Implement `BottomNav` components for mobile viewports and use horizontal scrolling (`overflow-x-auto`) for secondary navigation/categories to keep the UI compact and easy to navigate with one thumb.
## 2025-05-14 - Dark Mode Implementation with next-themes
**Learning:** When implementing dark mode in Next.js with `next-themes`, use `resolvedTheme` instead of `theme` to account for system settings. Ensure hydration safety by checking a `mounted` state. Refactor hardcoded hex colors to semantic CSS variables early to ensure global consistency.
**Action:** Always prefer `resolvedTheme` for icon logic and toggle states. Use semantic classes like `bg-background` and `text-foreground` in new components from the start.

## 2026-02-20 - Semantic HTML for Interactive Lists
**Learning:** Using `div` with `onClick` for interactive list items (like notifications or dropdown options) completely breaks keyboard accessibility and screen reader interaction. Converting these to semantic `<button>` elements with `type="button"` instantly fixes focus management and key handling without complex JavaScript.
**Action:** Always verify interactive list items are buttons or links. Use `w-full text-left` utility classes to maintain the visual appearance of a list item while gaining native button behavior.

## 2026-02-21 - Accessible Dynamic Forms
**Learning:** Dynamic form fields (like variants) often lack associated labels, making them invisible to screen readers. Adding `aria-label` to these inputs and icon-only buttons is a critical micro-UX fix that instantly improves accessibility without changing the visual design.
**Action:** Always check dynamic inputs for visible labels; if missing, add descriptive `aria-label` attributes. Wrap icon-only delete actions in Tooltips for clarity.

## 2026-02-22 - Semantic Buttons for Interactive Avatars
**Learning:** Wrapping a decorative avatar component in a semantic `<button>` instead of a `div` instantly makes it accessible to keyboard and screen reader users, transforming a static image into a functional "Change Profile Picture" control without complex custom event handlers.
**Action:** Always check if "clickable" divs (like avatars, cards) should be semantic `<button>` elements to get native focus and keyboard support for free.

