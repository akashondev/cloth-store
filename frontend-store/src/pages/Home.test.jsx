import { render, screen } from "@testing-library/react";
import Home, { heroContentVariants, heroItemVariants } from "./Home";

jest.mock(
  "framer-motion",
  () => {
    const React = require("react");
    const motion = new Proxy(
      {},
      {
        get: (_, tag) =>
          React.forwardRef(
            (
              {
                children,
                variants,
                initial,
                animate,
                exit,
                transition,
                whileHover,
                whileTap,
                whileInView,
                viewport,
                ...props
              },
              ref
            ) =>
              React.createElement(
                tag,
                {
                  ref,
                  "data-variants": variants ? JSON.stringify(variants) : undefined,
                  ...props,
                },
                children
              )
          ),
      }
    );

    return {
      AnimatePresence: ({ children }) => children,
      motion,
    };
  },
  { virtual: true }
);

beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
});

test("defines a noticeable but restrained staggered hero reveal", () => {
  expect(heroContentVariants.visible.transition.staggerChildren).toBeGreaterThanOrEqual(0.1);
  expect(heroItemVariants.hidden.y).toBeGreaterThanOrEqual(20);
  expect(heroItemVariants.visible.transition.duration).toBeLessThanOrEqual(0.5);
});

test("applies animation variants to each hero content element", () => {
  render(<Home />);

  expect(screen.getByText("Styllin selected edit")).toHaveAttribute("data-variants");
  expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-variants");
  expect(
    screen.getByText("Save more with coupons & up to 70% off!")
  ).toHaveAttribute("data-variants");
  expect(screen.getByRole("link", { name: "Shop Now" })).toHaveAttribute(
    "data-variants"
  );
});

test("uses a compact mobile hero with a contrast overlay", () => {
  render(<Home />);

  expect(screen.getByTestId("home-hero")).toHaveClass(
    "min-h-[68svh]",
    "md:min-h-[91vh]"
  );
  expect(screen.getByTestId("hero-overlay")).toBeInTheDocument();
});

test("shows eight product skeletons while products are loading", () => {
  render(<Home />);

  expect(screen.getByRole("status", { name: "Loading products" })).toHaveAttribute(
    "aria-busy",
    "true"
  );
  expect(screen.getAllByTestId("product-skeleton")).toHaveLength(8);
});

test("replaces the loading skeletons with fetched products", async () => {
  global.fetch.mockResolvedValue({
    json: async () => [{ id: "1", title: "Modern Shirt", price: 1200 }],
  });

  render(<Home />);

  expect(await screen.findByText("Modern Shirt")).toBeInTheDocument();
  expect(screen.queryByRole("status", { name: "Loading products" })).not.toBeInTheDocument();
});
