## 2025-05-15 - [Responsive Accessibility & Verification]
**Learning:** Elements hidden by responsive classes (e.g., `md:hidden`) require explicit mobile viewport testing in Playwright to verify accessibility. Additionally, `sr-only` elements may be considered 'visible' by automated tools if they retain 1x1 dimensions; visual verification remains the gold standard.
**Action:** Always set relevant viewports in verification scripts and use screenshots to confirm `sr-only` behavior.

## 2025-05-15 - [Semantic Interactivity]
**Learning:** Custom interactive components often use non-semantic tags like `div` with `cursor-pointer`, which are invisible to keyboard users and screen readers.
**Action:** Replace non-semantic interactive containers with `<button>` and ensure they have `aria-label` and visible focus states.
