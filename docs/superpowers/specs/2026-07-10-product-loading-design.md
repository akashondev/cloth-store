# Product Loading Experience

## Scope

Replace the plain Home-page “Loading products...” message with a polished fashion-commerce skeleton experience. Product fetching, API behavior, product cards, and other pages remain unchanged.

## Loading presentation

While the Home product request is pending, render eight skeleton cards in the same responsive grid and with the same approximate dimensions as the real product cards. Each skeleton contains placeholders for the image, category badge, two title lines, price, and circular cart action. Matching the final layout prevents a visible page jump when data arrives.

The skeleton surfaces use restrained neutral zinc tones. A low-contrast left-to-right shimmer moves across the cards, with a small staggered delay between cards so the grid feels deliberate without becoming busy. There is no spinner or loading text.

When loading completes, the skeleton grid leaves with a short fade and the real `ProductGrid` enters with a short fade. Framer Motion coordinates the transition, while CSS provides the shimmer treatment.

## Accessibility

The loading region exposes an appropriate busy state and a concise screen-reader label. Skeleton shapes are decorative and hidden from assistive technology. Under `prefers-reduced-motion: reduce`, shimmer and transition movement are disabled, leaving static placeholders.

## Testing

Focused React Testing Library coverage will verify that eight skeleton cards and the busy state appear during a pending request, and that products replace the loading UI after a successful response. A production build will verify CSS and component compilation.
