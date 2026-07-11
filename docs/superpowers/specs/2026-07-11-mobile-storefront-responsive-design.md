# Mobile Storefront Responsive Design

## Goal

Improve the storefront on phone-sized screens without changing desktop behavior, application routes, API behavior, authentication, or backend code.

## Scope

The change covers `Navbar`, the home-page hero, `ProductGrid`, and `ProductGridSkeleton`. Tablet and desktop presentation should remain consistent with the current design.

## Mobile navigation

Keep the existing top row with the brand, cart, account control, and menu trigger. Make spacing and hit targets suitable for narrow screens. The menu trigger communicates whether the menu is open and switches between menu and close icons.

The expanded navigation is a full-width panel beneath the top row. Links use comfortable vertical spacing and a clear active-page state. Selecting a destination closes the menu. Escape closes the menu, and changing routes must not leave it open. Existing cart and account behavior remains unchanged.

## Mobile hero

Reduce the hero from a near-full viewport presentation to a compact mobile-first height while retaining the current taller desktop treatment. Add a mobile gradient overlay so text remains readable over either existing hero image. Use a deliberate mobile image position, smaller responsive headline, tighter content spacing, and a compact CTA. Keep slider indicators visible inside the hero and preserve existing animation behavior with restrained mobile spacing.

## Product cards

Render two product cards per row at phone widths, with two, three, and four columns at the existing larger breakpoints. Reduce mobile container padding, gaps, image height, typography, and action-button size enough for two cards to fit without horizontal overflow. Preserve product content, add-to-cart behavior, currency formatting, load controls, and desktop card dimensions.

The loading skeleton must mirror the same responsive columns, spacing, and approximate card proportions to prevent layout shifts.

## Accessibility and interaction

Navigation controls retain semantic buttons and links, descriptive labels, expanded state, keyboard Escape handling, and visible focus behavior. Product actions keep their existing accessible labels. Text and controls must maintain usable contrast over the hero image.

## Testing and verification

Add or update focused tests for mobile-menu open/close behavior and the responsive two-column product and skeleton grids. Run the relevant tests and `npm run build`. Existing unrelated warnings or user changes are outside this task unless they prevent the build.

## Non-goals

No route, API, request, authentication, backend, product-data, desktop information architecture, or unrelated page changes are included.
