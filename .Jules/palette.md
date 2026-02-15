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

## 2026-02-15 - Carousel Accessibility Improvements
**Learning:** Carousels without proper ARIA roles and labels are difficult for screen reader users to navigate and understand. Simple indicators (dots) are often read as generic buttons without context.
**Action:** Always add `role="region"`, `aria-roledescription="carousel"`, and a descriptive `aria-label` to carousel containers. Ensure navigation dots have `aria-label="Go to slide X"` and `aria-current` attributes.
