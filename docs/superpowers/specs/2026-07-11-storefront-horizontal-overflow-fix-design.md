# Storefront Horizontal Overflow Fix

## Goal

Remove the unwanted horizontal scrollbar from every storefront page on mobile without changing the existing hamburger navigation, desktop layout, routes, or backend behavior.

## Root cause and scope

The shared footer appears on every storefront route. Its newsletter form forces the email input and Subscribe button into one row at all viewport widths, allowing the footer to exceed narrow phone screens. The fix is limited to the shared footer and a document-level overflow safeguard. The admin and login layouts remain unchanged.

## Responsive footer

At phone widths, stack the newsletter input and Subscribe button vertically. Both controls use the available width, and footer grid children are explicitly allowed to shrink and wrap inside the viewport. At the existing small-screen breakpoint and above, restore the current horizontal form layout and button sizing so tablet and desktop presentation stays consistent.

## Overflow safeguard

Constrain horizontal overflow at the document level with clipping. This prevents transient animation or subpixel rounding from creating a page-wide scrollbar, while the footer changes fix the actual oversized content rather than merely hiding it.

## Navigation

Keep the current storefront hamburger trigger and full-width dropdown behavior unchanged.

## Testing and verification

Add a focused footer regression test that asserts the newsletter form and Subscribe button use mobile-safe responsive classes. Run the frontend test suite and production build. Inspect the final diff and repository status before committing and pushing to `origin`.

## Non-goals

No admin sidebar, navbar behavior, page content, API, authentication, backend, or unrelated styling changes are included.
