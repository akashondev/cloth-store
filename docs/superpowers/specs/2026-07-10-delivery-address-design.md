# Delivery Address and Order Dates

## Scope

Add one free-text address field to user profiles, require it before checkout, snapshot it onto Orders, calculate expected delivery from the actual order placement time, and retain the Admin manual delivery action with feedback.

## Address model

User receives one nullable `address` text field. The public account response exposes it. `PUT /users/:id/address` accepts a trimmed address, requires meaningful non-empty content, updates the User, and returns the public profile.

My Account includes a delivery-address card with a textarea, Save action, inline validation, and success/error toast feedback. Existing users without an address see a clear empty state.

## Checkout gate and snapshot

Cart loads the current user profile before enabling payment. If no address exists, Cart displays a single address textarea in the checkout summary and requires the user to save it before proceeding. Existing addresses are displayed for confirmation and can be updated.

Checkout never trusts an address supplied only by the browser. The backend loads the current User, rejects checkout when `address` is empty, and copies it into the Order's delivery-address snapshot. Later profile edits do not modify existing Orders.

## Order and delivery dates

The expected delivery date is exactly `placedAt + 48 hours`. Payment confirmation persists that deadline while transitioning a paid Order. Automatic delivery reconciliation continues operating only on paid/processing/shipped Orders whose deadline is due.

Orders displays the actual placed date and expected delivery date. Delivered Orders display their delivered timestamp.

## Admin delivery action

The existing exact-Order-ID Admin action remains available for paid, processing, or shipped Orders. Successful and failed actions display top-right toast feedback, and successful delivery refreshes Admin order/customer data.

## Testing

Backend tests cover address validation/update behavior, checkout rejection without an address, order address snapshot mapping, and placedAt-plus-48-hour deadlines. Frontend tests cover Account address editing, Cart checkout blocking/saving, Orders date display, and Admin action feedback.
