import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }),
  { virtual: true },
);

test("keeps the newsletter controls within narrow mobile screens", () => {
  render(<Footer />);

  const input = screen.getByLabelText("Email address");
  const form = input.closest("form");
  const button = screen.getByRole("button", { name: /subscribe/i });

  expect(form).toHaveClass("min-w-0", "flex-col", "sm:flex-row");
  expect(button).toHaveClass("w-full", "sm:w-auto");
});
