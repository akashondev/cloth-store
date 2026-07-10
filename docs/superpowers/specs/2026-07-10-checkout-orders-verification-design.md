# Checkout, Orders, Delivery, and Verification

## Goals

Bring Orders into the storefront design system, make discounted Stripe charges authoritative and correct, replace the dedicated success page with an Orders toast flow, automate delivery after 48 hours while retaining an Admin override, and require proof of mailbox access before verification.

## Server-authoritative checkout

The backend is the only authority for product prices, coupon validity, the ₹10 platform fee, discounts, and final totals. It supports exactly two coupon codes: `SAVE10` for 10% off the merchandise subtotal and `FLAT50` for ₹50 off. A discount cannot reduce the payable amount below the platform fee.

A quote endpoint accepts cart product IDs, quantities, and an optional coupon code. It loads current product prices, rejects invalid products or coupons, and returns normalized items plus subtotal, discount, platform fee, and total. The Cart uses this response for its displayed summary. Checkout sends cart and coupon data again; the server recalculates rather than trusting totals from the browser.

Stripe Checkout line items represent merchandise after discount plus the ₹10 platform fee, with integer paise amounts whose sum equals the authoritative final total. The pending Order stores subtotal, discount, platform fee, coupon code, and total. Platform Fee remains visible in the Cart/checkout summary and part of the charge, but it is not stored or displayed as a fake purchased product.

## Payment completion

Stripe redirects successful checkouts directly to `/orders?session_id={CHECKOUT_SESSION_ID}`. Orders calls an idempotent backend confirmation endpoint. The endpoint retrieves the Stripe session, requires a paid payment status, validates its amount and currency against the stored Order, and transitions that Order to paid exactly once. It never creates a second Order.

After confirmation, Orders removes payment query parameters, refreshes history, and displays a dismissible success toast. The dedicated `/success` route and Success page are removed.

A Stripe webhook endpoint handles `checkout.session.completed` through the same idempotent confirmation service when `STRIPE_WEBHOOK_SECRET` is configured. Without that separate webhook secret, redirect confirmation remains functional. The existing Stripe secret key does not substitute for webhook signature verification.

## Order data and Orders page

Order responses expose subtotal, discount, platform fee, coupon code, placed time, delivery due time, paid time, delivered time, delivery address, and actual purchased items. Platform fee remains available for accounting but is not rendered as an order item or a separate product-style section in order details.

The Orders page uses the current storefront system: black editorial hero, teal accents, zinc backgrounds, the existing font stack, rounded-lg cards, subtle borders/shadows, shared badges, and responsive layouts. It includes polished skeleton loading, authentication and empty states, current and historical orders, status badges, delivery timing, item thumbnails/details, delivery address, and a clear charged total. Motion is restrained and respects reduced-motion preferences.

## Delivery lifecycle

Paid Orders receive `deliverAt = placedAt + 48 hours`. A backend scheduler runs every minute and atomically changes due paid/processing/shipped orders to `DELIVERED`, setting `deliveredAt`. Order read endpoints also reconcile overdue Orders, covering backend downtime between scheduler runs.

The Admin action targets an Order by its actual Order ID, not a user ID. It may transition any non-cancelled, non-delivered paid Order to `DELIVERED` early and then refresh Admin data. Repeated requests are idempotent.

## Email verification

Registration validates normalized email syntax and checks that the domain has mail-routing DNS records before attempting delivery. These checks reject obvious invalid input but do not claim the mailbox exists. Every new user is stored with `verified = false`.

The backend sends a time-limited, signed, single-purpose verification link. Only successful consumption of that token changes `verified` to true. Email-send failure never verifies the user; registration returns a clear retryable error. Login remains blocked until verification succeeds. Duplicate registration and expired/invalid token responses are explicit and do not leak credentials.

The existing email-link approach is retained. OTP entry is outside scope.

## Testing

Backend tests cover coupon calculations, rounding, invalid coupons/products, Stripe line-item totals, idempotent paid confirmation, webhook signature handling, 48-hour delivery boundaries, manual delivery transitions, and verification remaining false on email failure.

Frontend tests cover server quote display, checkout coupon propagation, Orders success confirmation/toast/history refresh, removal of platform-fee pseudo-items, Orders themed states, and Admin delivery action targeting the Order ID.

Verification includes focused frontend and backend tests plus production builds. Existing unrelated warnings and the known CRA Jest/React Router resolver mismatch are reported separately rather than hidden.
