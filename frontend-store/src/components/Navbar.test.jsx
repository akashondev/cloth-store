import { fireEvent, render, screen, within } from "@testing-library/react";
import Navbar from "./Navbar";

jest.mock(
  "react-router-dom",
  () => ({
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }),
  { virtual: true }
);

function renderNavbar(user = null) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");

  return render(
    <>
      <Navbar cartCount={0} />
      <main data-testid="page-content">Page content</main>
    </>
  );
}

afterEach(() => localStorage.clear());

test("shows the outline account icon when logged out", () => {
  renderNavbar();
  expect(screen.getByRole("button", { name: "Open account menu" })).toHaveAttribute(
    "data-account-state",
    "logged-out"
  );
});

test("shows the filled account icon when logged in", () => {
  renderNavbar({ name: "Asha", email: "asha@example.com" });
  expect(
    screen.getByRole("button", { name: "Open account menu for Asha" })
  ).toHaveAttribute("data-account-state", "logged-in");
  expect(screen.getByTestId("account-avatar")).toHaveTextContent("A");
});

test("uses the first visible uppercase character for the account avatar", () => {
  renderNavbar({ name: "  ravi", email: "ravi@example.com" });
  expect(screen.getByTestId("account-avatar")).toHaveTextContent("R");
});

test("uses an icon fallback when the stored user has no name", () => {
  renderNavbar({ name: "   ", email: "member@example.com" });
  expect(screen.getByRole("button", { name: "Open account menu" })).toHaveAttribute(
    "data-account-state",
    "logged-in"
  );
  expect(screen.getByTestId("account-avatar-fallback")).toBeInTheDocument();
});

test("closes the account menu after an outside pointer event", () => {
  renderNavbar();
  fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));
  expect(screen.getByText("Sign in to view orders")).toBeInTheDocument();

  fireEvent.pointerDown(screen.getByTestId("page-content"));

  expect(screen.queryByText("Sign in to view orders")).not.toBeInTheDocument();
});

test("keeps the account menu open after an inside pointer event", () => {
  renderNavbar();
  fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));
  fireEvent.pointerDown(screen.getByText("Sign in to view orders"));
  expect(screen.getByText("Sign in to view orders")).toBeInTheDocument();
});

test("closes the account menu with Escape and returns focus", () => {
  renderNavbar();
  const trigger = screen.getByRole("button", { name: "Open account menu" });
  fireEvent.click(trigger);

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByText("Sign in to view orders")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("does not show duplicate settings link in the account menu", () => {
  renderNavbar({ name: "Asha", email: "asha@example.com" });
  fireEvent.click(screen.getByRole("button", { name: "Open account menu for Asha" }));

  expect(screen.queryByText("Settings")).not.toBeInTheDocument();
});

test("opens mobile navigation and closes it after selecting a destination", () => {
  renderNavbar();
  fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));
  const mobileNavigation = screen.getByRole("navigation", {
    name: /mobile navigation/i,
  });

  fireEvent.click(within(mobileNavigation).getByRole("link", { name: "Shop" }));

  expect(
    screen.queryByRole("navigation", { name: /mobile navigation/i })
  ).not.toBeInTheDocument();
});

test("closes mobile navigation with Escape", () => {
  renderNavbar();
  fireEvent.click(screen.getByRole("button", { name: /open navigation menu/i }));

  fireEvent.keyDown(document, { key: "Escape" });

  expect(
    screen.queryByRole("navigation", { name: /mobile navigation/i })
  ).not.toBeInTheDocument();
});
