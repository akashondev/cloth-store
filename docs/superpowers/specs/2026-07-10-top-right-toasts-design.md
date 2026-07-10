# Top-right Toast Placement

## Scope

Standardize application toast notifications in the top-right corner to match the Login page.

## Behavior

The shared `AppToast` host moves from bottom-right to top-right, offset below the sticky navbar. Add-to-cart, Stripe-opening, payment-cancelled, and checkout-error notifications retain their current content, tones, dismissal controls, replacement behavior, and automatic timeout. Existing Login and Orders notifications remain top-right.

On narrow screens, the toast keeps its viewport-safe width and right margin.

## Testing

The shared toast test will verify the top positioning classes and confirm rendering/dismissal behavior remains unchanged.
