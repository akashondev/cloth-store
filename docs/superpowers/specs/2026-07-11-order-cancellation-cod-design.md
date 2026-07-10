# COD, Order Cancellation, Refunds, and Admin Delivery

## Scope

Add Cash on Delivery, allow users to cancel eligible Orders, refund paid Stripe Orders, and ensure Admin can see a Mark Delivered action for every eligible non-cancelled Order.

## Payment methods

Orders persist `paymentMethod` as either `STRIPE` or `COD`, defaulting to `STRIPE` for existing records. Cart presents Online Payment and Cash on Delivery choices after login, address confirmation, and authoritative quote calculation.

Online Payment continues creating a Stripe Checkout Session. Cash on Delivery creates the Order directly from the same server-authoritative cart, coupon, platform-fee, address, and total calculation. COD Orders start as `PROCESSING`, set `placedAt` normally, and receive `deliverAt = placedAt + 48 hours`. No Stripe session is created.

## User cancellation

Orders page shows Cancel Order only for `PAID` or `PROCESSING` Orders. `SHIPPED`, `DELIVERED`, `CANCELLED`, and unpaid abandoned Stripe Orders cannot be cancelled through the user action.

Cancellation sends both the stored user ID and Order ID. The backend verifies ownership and eligibility. COD cancellation atomically marks the Order `CANCELLED` with `cancelledAt` and returns a simple cancellation message.

For paid Stripe Orders, the backend retrieves the stored Checkout Session, requires a PaymentIntent, creates an idempotent Stripe refund, then marks the Order `CANCELLED`, stores `cancelledAt` and `stripeRefundId`, and returns: “Order cancelled. Your refund has been initiated and will be transferred to your original payment method.” Repeated cancellation returns the existing result without creating another refund.

## Admin delivery action

Admin displays Mark Delivered for every Order except `DELIVERED` and `CANCELLED`. The backend still rejects invalid transitions: a Stripe Order must be paid, while a COD Order may be `PROCESSING` or `SHIPPED`. A successful action marks the Order delivered and shows the existing top-right success toast.

## Testing

Backend tests cover COD creation mapping, ownership, eligibility, COD cancellation, Stripe refund creation, repeated refund idempotency, and delivery transition rules. Frontend tests cover payment-method selection, COD order creation, conditional Cancel Order buttons, cancellation confirmation/messages, Orders refresh, and Admin button visibility.
