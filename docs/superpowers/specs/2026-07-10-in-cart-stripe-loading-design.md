# In-Cart Stripe Session Loading

## Scope

Create the Stripe Checkout Session directly from Cart so the user remains on the visible Cart page until Stripe is ready. Remove the intermediate Payment route and page.

## Behavior

The Proceed to Payment action first performs existing login, saved-address, cart, and quote checks. It then sets a local checkout-loading state, disables the payment button, changes its label to “Preparing secure checkout…”, and dispatches the top-right “Opening secure checkout…” toast.

Cart posts the current user ID, normalized cart quantities, and applied coupon code directly to `/payment/create-checkout-session`. When a valid Stripe URL returns, the browser navigates directly from Cart to Stripe. No internal route change or separate loading screen occurs.

If session creation fails, Cart remains visible, restores the button, and shows a top-right error toast containing the backend error when available. Repeated clicks while loading cannot create duplicate sessions.

The `/payment` route, Payment page, and Payment-specific tests are removed. Stripe cancellation continues returning to Cart with its existing toast.

## Testing

Cart tests verify request payload, loading/disabled state, duplicate-click prevention, direct Stripe URL assignment, and error recovery. App routing tests or source assertions verify the Payment route is absent. Focused UI tests and the production build verify integration.
