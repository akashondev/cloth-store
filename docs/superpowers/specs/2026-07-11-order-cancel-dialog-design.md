# Simple Order Cancellation Dialog

## Scope

Replace the browser `window.confirm` prompt on Orders with a small confirmation dialog matching the existing white, zinc, and teal design system.

## Behavior

Clicking Cancel Order opens a centered white card with a subtle zinc border and shadow. It shows “Cancel order?” and one concise message: Stripe Orders mention that the refund returns to the original payment method; COD Orders state that the Order will simply be cancelled.

The dialog has “Keep Order” and teal “Confirm Cancel” buttons. While the cancellation request runs, actions are disabled and the confirmation label becomes “Cancelling…”. Keep Order, Escape, or backdrop click closes an idle dialog.

No cancellation toast appears merely from opening or dismissing the dialog. The existing top-right success toast appears only after the backend confirms cancellation; failures show the existing error toast.

## Testing

Orders interaction tests verify opening, COD/Stripe message selection, dismissing, confirming, loading state, and success/error toast dispatch timing.
