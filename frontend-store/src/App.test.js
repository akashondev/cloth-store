import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock(
  "react-router-dom",
  () => ({
    BrowserRouter: ({ children }) => <>{children}</>,
    Routes: ({ children }) => <>{children}</>,
    Route: ({ element }) => element,
    useLocation: () => ({ pathname: "/" }),
  }),
  { virtual: true },
);

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock("./components/Navbar", () => () => <header>Store navigation</header>);
jest.mock("./components/Footer", () => () => <footer>Store footer</footer>);
jest.mock("./components/AppToast", () => () => null);
jest.mock("./components/ScrollTopBtn", () => () => null);
jest.mock("./components/SmoothScroll", () => () => null);
jest.mock("./pages/Home", () => () => <main>Home page</main>);
jest.mock("./pages/About", () => () => null);
jest.mock("./pages/Shop", () => () => null);
jest.mock("./pages/Blog", () => () => null);
jest.mock("./pages/Cart", () => () => null);
jest.mock("./pages/Login", () => () => null);
jest.mock("./pages/AdminDashboard", () => () => null);
jest.mock("./components/VerifyEmailPage", () => () => null);
jest.mock("./pages/Orders", () => () => null);
jest.mock("./pages/Account", () => () => null);

test("renders the shared storefront layout", () => {
  window.scrollTo = jest.fn();
  render(<App />);

  expect(screen.getByText("Store navigation")).toBeInTheDocument();
  expect(screen.getByText("Home page")).toBeInTheDocument();
  expect(screen.getByText("Store footer")).toBeInTheDocument();
});
