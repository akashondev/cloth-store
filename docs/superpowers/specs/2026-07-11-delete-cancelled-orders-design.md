# Delete Cancelled Orders

Cancelling COD deletes the Order immediately. Cancelling Stripe first completes the idempotent refund; only then is the Order deleted. Prisma cascade-deletes OrderItems. Deleted Orders disappear from User and Admin history. Refund or deletion failures preserve the Order and show an error toast. This intentionally removes cancellation audit history.
