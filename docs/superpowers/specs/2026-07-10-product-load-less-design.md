# Product Load Less Control

## Scope

Extend the existing client-side ProductGrid pagination with a Load Less action. Product fetching, product ordering, cart behavior, and the 16-product page size remain unchanged.

## Behavior

Load More continues increasing the visible product count by 16 until every product is visible. Whenever more than the initial 16 products are visible, a Load Less button appears beside the Load More control. Each Load Less click reduces the visible count by 16, never below 16 and never below the number of products available when the collection contains fewer than 16 items.

When the visible count returns to the initial page, Load Less disappears. Load More remains visible only when undisplayed products remain. The controls use the existing visual style, with Load More as the primary dark action and Load Less as a quieter outlined action.

After reducing the grid, the page smoothly scrolls to the product section heading so the viewport does not remain below the shortened content. Reduced-motion preferences use an immediate scroll instead.

## Testing

Focused ProductGrid interaction tests will verify that Load More reveals the next group, Load Less appears afterward, Load Less hides the added group, and the control disappears again at the initial count.
