# UX & Accessibility Learning Journal

## 2024-05-22: Scroll-based Visibility and Interaction

- **Insight**: When using scroll-linked animations (e.g., Framer Motion `useTransform` with `scrollYProgress`), aggressive fading (opacity 1 -> 0 over a small scroll range) can lead to critical UI elements becoming non-interactive before the user has a chance to engage with them.
- **Problem**: The Hero section was disappearing too early, making the video player inaccessible.
- **Solution**: Adjusted the scroll range to maintain higher visibility (opacity and scale) during initial scroll phases and integrated a dynamic video player state to replace static placeholders.
- **Accessibility**: Ensured that the video can be triggered by multiple UI elements (buttons) and remains visible while the user is likely to interact with it.
