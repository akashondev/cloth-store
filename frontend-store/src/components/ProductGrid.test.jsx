import { fireEvent, render, screen } from "@testing-library/react";
import ProductGrid from "./ProductGrid";

jest.mock(
  "framer-motion",
  () => {
    const React = require("react");
    return {
      motion: {
        div: ({ children, whileHover, transition, ...props }) => (
          <div {...props}>{children}</div>
        ),
      },
    };
  },
  { virtual: true }
);

const products = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  title: `Product ${index + 1}`,
  price: 1000 + index,
  category: index === 0 ? "Clothing" : "Essentials",
}));

test("uses two product columns on mobile", () => {
  render(<ProductGrid products={products.slice(0, 2)} />);

  expect(screen.getByTestId("product-grid")).toHaveClass(
    "grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4"
  );
});

test("shows Load Less immediately after Load More expands the grid", () => {
  render(<ProductGrid products={products} />);

  expect(screen.queryByText("Product 17")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Load Less" })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Load More" }));

  expect(screen.getByText("Product 17")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Load Less" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Load Less" }));

  expect(screen.queryByText("Product 17")).not.toBeInTheDocument();
  expect(screen.getByText("Product 16")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Load Less" })).not.toBeInTheDocument();
});

test("dispatches a product-specific toast after adding to cart", () => {
  const handler = jest.fn();
  window.addEventListener("appToast", handler);
  render(<ProductGrid products={[products[0]]} />);
  expect(screen.queryByText("Clothing")).not.toBeInTheDocument();
  expect(screen.getByText("₹1,000")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Add Product 1 to cart" }));
  expect(handler.mock.calls[0][0].detail).toEqual({
    title: "Added to cart",
    message: "Product 1",
    tone: "success",
  });
  window.removeEventListener("appToast", handler);
});
