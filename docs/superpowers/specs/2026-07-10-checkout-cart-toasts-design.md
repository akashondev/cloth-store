# Checkout Cancellation and Cart Toasts

## Scope

Remove the dedicated payment-cancellation screen and full-page payment redirect message. Introduce one compact bottom-right toast pattern for Stripe cancellation, checkout startup/failure, and add-to-cart feedback.

## Stripe cancellation and payment redirect

Stripe's cancel URL points to `/cart?payment=cancelled`. Cart consumes that query state, replaces the URL with `/cart`, and displays “Payment cancelled” with “Your cart is still saved.” The Cancel route and page are removed.

The Payment route starts checkout immediately and renders no full-page loading message. While the request is pending, it shows a small bottom-right “Opening secure checkout…” toast. If session creation fails, it navigates to `/cart?payment=error`; Cart consumes that state and shows a checkout error toast.

The Cart text “Stripe checkout uses server-side product prices for this project flow.” is removed.

## Add-to-cart feedback

ProductGrid continues updating local storage and dispatching the existing cart-count event. It additionally dispatches a dedicated notification event containing the product title. A toast host near the application root displays “Added to cart” and the product name in the bottom-right corner.

## Toast behavior

A reusable toast component supports success, informational, and error tones; includes an accessible live region and dismiss control; and automatically closes after roughly three seconds. Repeated notifications replace the current toast. Motion is short and respects reduced-motion preferences.

## Testing

Tests cover add-to-cart event payload, toast rendering/dismissal, Cart cancellation query consumption, Payment coupon propagation and error redirect, and removal of Cancel/Success routes. Focused frontend tests and the production build verify integration.
