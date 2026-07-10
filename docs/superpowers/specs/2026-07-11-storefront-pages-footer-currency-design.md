# Storefront Pages, Footer, Product Cards, and Currency

## Goals

Rebuild Footer, Blog, Shop, and About into one cohesive premium storefront system; remove unnecessary product category tags; and eliminate broken currency symbols through one shared formatter without changing business logic.

## Shared design language

All modified surfaces use the existing black, white, zinc, and teal palette; Poppins/Inter body typography and Styllin logo font; rounded-lg borders; restrained shadows; max-width containers; and mobile-first spacing. Framer Motion is limited to short page fades, section reveals, and small card hover lifts. Reduced-motion preferences receive static presentation.

## Footer

The Footer retains a compact newsletter section. It validates a non-empty, syntactically valid email and dispatches the existing top-right `appToast`: success confirms subscription; invalid input shows an error. This remains a local UI subscription because no newsletter backend exists.

The main black Footer contains brand copy and only valid application routes: Home, Shop, Blog, About, Cart, Orders, and Account. Fake `#` social, policy, collection, gift-card, help, address, and phone links are removed. A contact email and current-year copyright remain. Layout collapses cleanly from multi-column desktop to stacked mobile.

## Shop

Shop fetches the live `/products` catalog, normalizes array responses, and renders an editorial black/teal header, search input, category select, sort control (featured, price low-high, price high-low, title), and result count. Filtering and sorting are client-side and do not mutate catalog data. Loading uses the existing ProductGridSkeleton; errors and empty results receive themed states. Results use ProductGrid.

## Blog

Blog becomes a fashion editorial rather than a collection grid. It contains a black/teal hero, one featured style story, responsive article cards with real editorial copy, reading metadata, category labels, and a final Shop CTA. Existing remote editorial images may be reused. Cards are informational and do not imply nonexistent article routes.

## About

About includes a brand-story hero, Styllin mission, three value cards, a quality/process section, customer promise metrics, and valid Shop/About-to-account CTAs. Copy avoids unsupported operational claims and uses the same responsive design system.

## Product cards

ProductGrid removes the category badge overlay completely, including “Clothing” and fallback labels. Cards display only product image, title, formatted price, optional formatted original price, and add-to-cart action. Existing pagination, cart behavior, toast, image fallback, and restrained hover remain.

## Currency

`src/lib/utils.js` exports `formatCurrency(value, options?)` backed by `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })`. Invalid/missing values produce a safe INR placeholder rather than `?`.

Cart, AdminDashboard, Account, Orders, ProductGrid, and all other modified price displays import this function. Local duplicated currency functions and hardcoded `?`, mojibake rupee strings, and manual currency concatenation are removed.

## Testing and verification

Tests cover the shared formatter, Footer valid links/newsletter toasts, ProductGrid badge removal and formatted price, and Shop filtering/sorting/loading. Existing focused UI tests remain green. Verification includes a source scan for broken currency patterns/nonexistent Footer links, responsive-class review at mobile/tablet/desktop breakpoints, and a production build.
