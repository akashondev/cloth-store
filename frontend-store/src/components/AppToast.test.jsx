import { act, fireEvent, render, screen } from "@testing-library/react";
import AppToast from "./AppToast";

test("renders and dismisses app toast events", () => {
  render(<AppToast />);
  act(() => {
    window.dispatchEvent(new CustomEvent("appToast", { detail: { title: "Added to cart", message: "Linen Shirt", tone: "success" } }));
  });
  expect(screen.getByRole("status")).toHaveTextContent("Added to cart");
  expect(screen.getByRole("status")).toHaveClass("top-20");
  expect(screen.getByRole("status")).not.toHaveClass("bottom-5");
  expect(screen.getByRole("status")).toHaveTextContent("Linen Shirt");
  fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});
