import { render, screen } from "@testing-library/react";
import ProductGridSkeleton from "./ProductGridSkeleton";

test("renders eight decorative product skeletons in a busy region", () => {
  render(<ProductGridSkeleton />);

  expect(screen.getByRole("status", { name: "Loading products" })).toHaveAttribute(
    "aria-busy",
    "true"
  );
  expect(screen.getAllByTestId("product-skeleton")).toHaveLength(8);
});

test("uses two skeleton columns on mobile", () => {
  render(<ProductGridSkeleton />);

  expect(
    screen.getByRole("status", { name: "Loading products" }).firstElementChild
  ).toHaveClass("grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4");
});
