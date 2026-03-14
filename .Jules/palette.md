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

## 2026-02-21 - Accessible Icon-Only Actions
**Learning:** Icon-only buttons (like "Chat", "Call", "Video") are invisible to screen readers without labels. Wrapping them in `Tooltip` components not only provides a visual hover state but also ensures the `aria-label` is reinforced by the tooltip text. Also, `Link` components rendering anchor tags cannot contain `<button>` elements; replacing them with styled `<span>` elements maintains validity and accessibility.
**Action:** Audit all icon-only buttons for `aria-label` and `Tooltip` wrappers. Ensure `Link` children are not interactive elements like `button`.

## 2026-02-26 - Unified Search UX with Keyboard Shortcuts
**Learning:** A truly delightful search experience combines visual cues (custom clear buttons) with power-user features (global '/' shortcut). Hiding native browser decorations in CSS and implementing a visibility-aware shortcut listener ensures the feature feels native and polished across all screen sizes without UI duplication.
**Action:** Use `::-webkit-search-cancel-button` to hide native clear buttons. Implement a global `keydown` listener for '/' that checks `offsetParent !== null` to target only the visible search instance.

## 2026-03-01 - Consistent Labeling for AI Interaction
**Learning:** Even advanced features like an AI Stylist can be overlooked if they lack visual and programmatic labeling. Integrating icon-only triggers with the established Tooltip system and adding specific ARIA labels to chat controls (upload, input, send) ensures the feature is accessible and consistent with the rest of the application's premium header.
**Action:** Wrap AI triggers in `Tooltip` components and ensure all internal chat buttons have descriptive `aria-label` attributes.

## 2026-03-10 - Themed Confirmation Dialogs
**Learning:** Native `confirm()` dialogs are non-themeable, vary by browser, and can be easily blocked. Replacing them with an `AlertDialog` component ensures a consistent design language, better accessibility (focus trapping, ARIA roles), and prevents "confirm fatigue" where users accidentally dismiss alerts.
**Action:** Audit destructive actions (delete, remove) using `confirm()` and replace them with the `AlertDialog` UI component. Always add a loading state and guard against double-submissions in the confirmation action.

## 2026-03-12 - Marketplace Product Accessibility
**Learning:** Adding `aria-label` to icon-only quantity controls and `aria-live="polite"` to the value display ensures that screen reader users are informed of state changes during selection. Likewise, `aria-current` on image thumbnails helps users understand which view is active in a gallery.
**Action:** Always wrap icon-only actions in `Tooltip` components and provide explicit ARIA labels. Use `aria-live` for numerical values that change via user interaction.

## 2026-03-05 - Accessible Checkout Feedback
**Learning:** In high-stakes flows like checkout, static loading text ("Processing...") can feel disconnected. Replacing it with a synchronized 'Spinner' component provides a stronger visual cue of progress. Additionally, ensuring all secondary actions (like promo code removal) have both ARIA labels and visual tooltips prevents user hesitation and improves screen reader transparency.
**Action:** Use the centralized 'Spinner' component for all primary async actions and wrap icon-only buttons in 'Tooltip' + 'aria-label' pairs consistently across the application.

## 2026-03-14 - Semantic Notifications List
**Learning:** For lists where items trigger actions (like marking as read or navigating), using semantic `<button>` elements instead of `div` with `onClick` is essential for keyboard accessibility. Combining this with a descriptive `aria-label` that includes the read status and content ensures a transparent experience for screen reader users.
**Action:** Always refactor interactive list items to semantic `<button>` elements. Use a pattern like `aria-label="${isRead ? '' : 'Unread: '}${title}. ${message}"` for content-rich notification items.

## 2026-03-15 - Themed Deletion Confirmation
**Learning:** Replacing native browser `confirm()` with themed `AlertDialog` components not only improves visual consistency but also provides a better UX by allowing for integrated loading states (spinners) directly on the confirmation action. This prevents "double-click" issues and gives users clear feedback that their destructive action is being processed.
**Action:** Replace `confirm()` with `AlertDialog`. Always include a `disabled` state and a loading indicator on the primary action button during asynchronous operations.

## 2026-03-13 - [Admin UX Consistency]
**Learning:** Admin salon management actions (Approve, Suspend, Reject) were using native browser `confirm()` dialogs, which felt disconnected from the application's design system and lacked descriptive context or loading feedback.
**Action:** Replace native `confirm()` with themed `AlertDialog` components. Ensure each action has a tailored title and description to provide clear context for destructive or critical operations. Include `Loader2` spinners in confirmation buttons to signal asynchronous processing.
