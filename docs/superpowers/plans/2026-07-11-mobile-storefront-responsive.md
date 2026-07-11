# Mobile Storefront Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile navigation and the home-page hero while rendering at least two product cards per row on phones.

**Architecture:** Preserve existing React components and behavior, changing only their responsive presentation and mobile-menu interaction. Tailwind utility classes provide breakpoint-specific layout; focused React Testing Library assertions lock down menu behavior and the two-column grids.

**Tech Stack:** React 19, React Router, Tailwind CSS, Framer Motion, Lucide React, Jest, React Testing Library.

## Global Constraints

- Do not change routes, APIs, request payloads, authentication, backend code, or unrelated pages.
- Preserve the existing tablet and desktop storefront presentation.
- Preserve cart, account, product, slider, and load-more behavior.
- Maintain semantic controls, keyboard support, focus styles, and readable contrast.
- Do not overwrite the user's existing `src/pages/Blog.jsx` changes.

---

### Task 1: Mobile navigation

**Files:**
- Modify: `frontend-store/src/components/Navbar.jsx`
- Test: `frontend-store/src/components/Navbar.test.jsx`

**Interfaces:**
- Consumes: React Router `Link` and `useLocation`; existing `cartCount` prop and stored-user helpers.
- Produces: an accessible `Open navigation menu` / `Close navigation menu` button and a mobile panel with unchanged route destinations.

- [ ] **Step 1: Write failing interaction tests**

Add tests that click the button by accessible name, assert the mobile navigation appears, click `Shop`, and assert the panel closes. Add a second test that opens the panel, sends `Escape`, and asserts it closes.

```jsx
test("opens mobile navigation and closes it after selecting a destination", async () => {
  const user = userEvent.setup();
  renderNavbar();
  await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
  expect(screen.getByRole("navigation", { name: /mobile navigation/i })).toBeInTheDocument();
  await user.click(within(screen.getByRole("navigation", { name: /mobile navigation/i })).getByRole("link", { name: "Shop" }));
  expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
});

test("closes mobile navigation with Escape", async () => {
  const user = userEvent.setup();
  renderNavbar();
  await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- --watchAll=false src/components/Navbar.test.jsx`

Expected: FAIL because the menu button and mobile panel do not yet expose the required accessible names and Escape does not close the panel.

- [ ] **Step 3: Implement the minimal navigation behavior**

Import `X` and `useLocation`. Close the menu when `location.pathname` changes and when Escape is pressed. Give the trigger `aria-expanded`, `aria-controls`, and a state-dependent label. Render `Menu` or `X`. Give the panel `role="navigation"`, `aria-label="Mobile navigation"`, larger tap targets, and close it in every link's `onClick`. Use `NavLink` or pathname comparisons for the active-page style without changing destinations.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npm test -- --watchAll=false src/components/Navbar.test.jsx`

Expected: PASS with all navbar tests green.

### Task 2: Mobile hero composition

**Files:**
- Modify: `frontend-store/src/pages/Home.jsx`
- Test: `frontend-store/src/pages/Home.test.jsx`

**Interfaces:**
- Consumes: existing hero slide data and Framer Motion variants.
- Produces: responsive hero classes and a mobile contrast overlay; no data-flow changes.

- [ ] **Step 1: Write a failing hero-layout test**

Add a stable `data-testid="home-hero"` to the desired contract and assert it uses a compact mobile minimum height plus the existing taller desktop breakpoint. Assert a `data-testid="hero-overlay"` element exists.

```jsx
test("uses a compact mobile hero with a contrast overlay", () => {
  render(<Home />);
  expect(screen.getByTestId("home-hero")).toHaveClass("min-h-[68svh]", "md:min-h-[91vh]");
  expect(screen.getByTestId("hero-overlay")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --watchAll=false src/pages/Home.test.jsx`

Expected: FAIL because the test IDs, mobile height, and overlay are absent.

- [ ] **Step 3: Implement the responsive hero**

Use `min-h-[68svh] md:min-h-[91vh]` on the section and matching mobile/desktop heights on its content wrapper. Position the existing image for phones with a breakpoint-specific desktop position. Add an absolute gradient overlay between the image and content. Reduce phone padding, spacing, eyebrow tracking, headline size, body size, CTA padding, and indicator offset while retaining current `md:` and `lg:` values. Preserve slides, content, links, and animations.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `npm test -- --watchAll=false src/pages/Home.test.jsx`

Expected: PASS with all home tests green.

### Task 3: Two-column phone product and skeleton grids

**Files:**
- Modify: `frontend-store/src/components/ProductGrid.jsx`
- Modify: `frontend-store/src/components/ProductGridSkeleton.jsx`
- Test: `frontend-store/src/components/ProductGrid.test.jsx`
- Test: `frontend-store/src/components/ProductGridSkeleton.test.jsx`

**Interfaces:**
- Consumes: existing product arrays and optional `handleAdd` callback.
- Produces: two phone columns with compact phone cards and unchanged larger-breakpoint columns.

- [ ] **Step 1: Write failing responsive-grid tests**

Add `data-testid="product-grid"` to the real grid and use the existing loading status to find the skeleton grid. Assert both use `grid-cols-2`, `md:grid-cols-3`, and `lg:grid-cols-4`.

```jsx
expect(screen.getByTestId("product-grid")).toHaveClass("grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4");
expect(screen.getByRole("status").firstElementChild).toHaveClass("grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4");
```

- [ ] **Step 2: Run both tests and verify RED**

Run: `npm test -- --watchAll=false src/components/ProductGrid.test.jsx src/components/ProductGridSkeleton.test.jsx`

Expected: FAIL because both grids currently use one phone column.

- [ ] **Step 3: Implement compact mobile cards**

Set both grids to `grid-cols-2` from the smallest breakpoint, keep three and four columns at `md` and `lg`, and remove the redundant `sm:` column rule. Use smaller phone padding and gap with `sm:` restoration. Use a shorter phone image height with the current height restored at `sm:`. Compact phone card padding, title, price, and cart button sizes while preserving current values at `sm:`. Apply matching proportions to skeleton cards.

- [ ] **Step 4: Run component tests and verify GREEN**

Run: `npm test -- --watchAll=false src/components/ProductGrid.test.jsx src/components/ProductGridSkeleton.test.jsx`

Expected: PASS with all product-grid tests green.

### Task 4: Full verification

**Files:**
- Verify only; do not broaden scope to unrelated warnings.

**Interfaces:**
- Consumes: completed Tasks 1–3.
- Produces: evidence that focused behavior and the production bundle are valid.

- [ ] **Step 1: Run all affected tests**

Run: `npm test -- --watchAll=false src/components/Navbar.test.jsx src/pages/Home.test.jsx src/components/ProductGrid.test.jsx src/components/ProductGridSkeleton.test.jsx`

Expected: PASS with zero failing tests.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit code 0. Existing unrelated warnings may remain.

- [ ] **Step 3: Audit the diff**

Run: `git diff --check` and `git diff -- frontend-store/src/components/Navbar.jsx frontend-store/src/pages/Home.jsx frontend-store/src/components/ProductGrid.jsx frontend-store/src/components/ProductGridSkeleton.jsx frontend-store/src/components/Navbar.test.jsx frontend-store/src/pages/Home.test.jsx frontend-store/src/components/ProductGrid.test.jsx frontend-store/src/components/ProductGridSkeleton.test.jsx`

Expected: no whitespace errors; only the approved responsive behavior and tests are present.
