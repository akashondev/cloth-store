import { fireEvent, render, screen } from "@testing-library/react";
import CancelOrderDialog from "./CancelOrderDialog";

test("shows Stripe refund copy and confirms cancellation", () => {
  const onConfirm = jest.fn();
  render(<CancelOrderDialog order={{ paymentMethod: "STRIPE" }} onClose={jest.fn()} onConfirm={onConfirm} />);
  expect(screen.getByText(/refund will be returned/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Confirm Cancel" }));
  expect(onConfirm).toHaveBeenCalled();
});

test("shows COD copy and supports keeping the order", () => {
  const onClose = jest.fn();
  render(<CancelOrderDialog order={{ paymentMethod: "COD" }} onClose={onClose} onConfirm={jest.fn()} />);
  expect(screen.getByText(/no refund is needed/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Keep Order" }));
  expect(onClose).toHaveBeenCalled();
});

test("disables actions while cancellation is running", () => {
  render(<CancelOrderDialog order={{ paymentMethod: "COD" }} loading onClose={jest.fn()} onConfirm={jest.fn()} />);
  expect(screen.getByRole("button", { name: "Cancelling…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Keep Order" })).toBeDisabled();
});
