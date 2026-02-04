# Learning Journal

## UX/Accessibility Insights

- **Scroll-triggered animations & Interactivity:** When using `framer-motion` for scroll-triggered transforms, it's critical to ensure that interactive elements (like buttons) don't fade out or scale down too early. Adjusting `useTransform` ranges (e.g., from `[0, 0.5]` to `[0.8, 1]`) preserves visibility and functionality for a better user experience.
- **Video Placeholders:** Using a high-quality placeholder image with a clear "Play" icon improves perceived performance and provides a clear call to action before the video (e.g., YouTube iframe) is loaded.
