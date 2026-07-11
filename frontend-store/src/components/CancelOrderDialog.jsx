import React, { useEffect } from "react";

function CancelOrderDialog({ order, loading = false, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose]);

  if (!order) return null;
  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-black/30 px-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="cancel-order-title" className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
        <h2 id="cancel-order-title" className="text-xl font-bold text-zinc-950">Cancel order?</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {order.paymentMethod === "STRIPE"
            ? "Your refund will be returned to the original payment method after cancellation."
            : "This Cash on Delivery order will be cancelled. No refund is needed."}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" disabled={loading} onClick={onClose} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">Keep Order</button>
          <button type="button" disabled={loading} onClick={onConfirm} className="rounded-lg bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60">{loading ? "Cancelling…" : "Confirm Cancel"}</button>
        </div>
      </div>
    </div>
  );
}

export default CancelOrderDialog;
