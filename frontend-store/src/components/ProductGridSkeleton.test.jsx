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
