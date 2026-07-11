# Storefront Horizontal Overflow Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove mobile horizontal scrolling caused by the shared storefront footer while preserving the current hamburger dropdown and desktop footer layout.

**Architecture:** Fix the oversized content at its source by making the footer newsletter controls stack and shrink on narrow screens, then restore the row layout at Tailwind's `sm` breakpoint. Add document-level horizontal clipping as a defensive boundary for animation and subpixel overflow.

**Tech Stack:** React 19, Tailwind CSS 3, Jest, React Testing Library, Create React App

## Global Constraints

- Keep the current storefront hamburger trigger and full-width dropdown behavior unchanged.
- Do not modify the admin sidebar, page content, API, authentication, backend, or unrelated styles.
- Preserve the existing tablet and desktop footer presentation from the `sm` breakpoint upward.

---

### Task 1: Responsive Footer Regression

**Files:**
- Create: `frontend-store/src/components/Footer.test.jsx`
- Modify: `frontend-store/src/components/Footer.jsx`

**Interfaces:**
- Consumes: the existing default `Footer` React component and its newsletter form.
- Produces: a newsletter form that stacks at the base breakpoint and changes to a row at `sm`, plus shrink-safe footer content.

- [ ] **Step 1: Write the failing test**

```jsx
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `$env:CI='true'; npm test -- --runInBand src/components/Footer.test.jsx`

Expected: FAIL because the form lacks `min-w-0 flex-col sm:flex-row` and the button lacks `w-full sm:w-auto`.

- [ ] **Step 3: Implement the minimum responsive footer classes**

In `Footer.jsx`, make the newsletter content shrink-safe and use these form/button responsive class patterns:

```jsx
<div className="min-w-0">
  {/* existing newsletter copy */}
</div>
<form className="flex min-w-0 w-full max-w-md flex-col gap-2 sm:flex-row md:w-[28rem]">
  {/* existing label and input */}
  <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-sm font-semibold hover:bg-black sm:w-auto">
    <Send size={16} />
    Subscribe
  </button>
</form>
```

Add `min-w-0` to the three direct content columns in the dark footer grid so text and links can shrink within their grid tracks.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `$env:CI='true'; npm test -- --runInBand src/components/Footer.test.jsx`

Expected: PASS with 1 test passing.

### Task 2: Document Overflow Boundary

**Files:**
- Modify: `frontend-store/src/index.css`

**Interfaces:**
- Consumes: the browser document root and body.
- Produces: a viewport-wide clipping boundary without changing vertical scrolling.

- [ ] **Step 1: Add the horizontal clipping rule**

Add the following before the existing `body` declaration:

```css
html {
  max-width: 100%;
  overflow-x: clip;
}
```

Add `max-width: 100%;` and `overflow-x: clip;` to the existing `body` rule.

- [ ] **Step 2: Run all frontend tests**

Run: `$env:CI='true'; npm test -- --runInBand`

Expected: all suites pass with zero failed tests.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0 and a production bundle in `frontend-store/build`.

- [ ] **Step 4: Inspect and commit the implementation**

Run: `git diff --check` and `git diff -- frontend-store/src/components/Footer.jsx frontend-store/src/components/Footer.test.jsx frontend-store/src/index.css`

Expected: no whitespace errors; diff contains only the responsive footer, regression test, and document overflow boundary.

```bash
git add frontend-store/src/components/Footer.jsx frontend-store/src/components/Footer.test.jsx frontend-store/src/index.css docs/superpowers/plans/2026-07-11-storefront-horizontal-overflow-fix.md
git commit -m "fix: prevent mobile storefront overflow"
```

### Task 3: Deploy to GitHub

**Files:**
- No file changes.

**Interfaces:**
- Consumes: verified commits on the current branch and the configured `origin` remote.
- Produces: the current branch published to GitHub.

- [ ] **Step 1: Confirm repository state and destination**

Run: `git status --short; git branch --show-current; git remote -v`

Expected: clean tracked implementation state, current branch `main`, and `origin` set to `https://github.com/akashondev/cloth-store.git`.

- [ ] **Step 2: Push the verified branch**

Run: `git push origin main`

Expected: GitHub accepts the new design and implementation commits.

- [ ] **Step 3: Confirm local and remote commit agreement**

Run: `git rev-parse HEAD; git ls-remote origin refs/heads/main`

Expected: both commands report the same commit hash.
