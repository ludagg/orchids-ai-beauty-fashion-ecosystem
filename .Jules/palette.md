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

## 2026-02-18 - Global Search Interaction & Accessibility
**Learning:** Adding a global keyboard shortcut (`/`) and a "Clear" button to the search bar significantly improves the "native" feel and usability of the application. Using ARIA labels on icon-only buttons (like sidebar toggles and mobile menus) is essential for screen reader users and should be part of the standard component kit.
**Action:** Always include `aria-label` for icon-only buttons. Use a global keydown listener for the `/` shortcut but ensure it filters for visible inputs using `offsetParent !== null` to handle multiple instances of the search bar in responsive layouts.
