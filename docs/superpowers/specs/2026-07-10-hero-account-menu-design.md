# Hero and Account Menu Improvements

## Scope

Improve three interactions in the existing React storefront without changing the surrounding navigation or product sections:

1. Make the Framer Motion animation in the Home hero clearly visible while keeping it restrained.
2. Display a distinct filled account icon whenever a stored user is logged in.
3. Dismiss the account dropdown when the user clicks outside it or presses Escape.

## Hero animation

The current two-slide hero and manual slide indicators remain. Each initial render and slide selection will animate the background image with a soft fade and slight scale settle. The content will reveal in a short staggered sequence: eyebrow, heading, highlighted heading line, description, and call-to-action. The sequence will complete in roughly one second, making the motion noticeable without delaying interaction or creating excessive movement.

The hero will continue using Framer Motion. Motion outside the hero, including the product-section reveal, is outside this change.

## Account icon and dropdown

The navbar will continue reading the stored user through the existing storage helper. Logged-out visitors will see the current outline `User` icon. Logged-in users will see Lucide's filled-style `CircleUserRound` account icon, with an accessible label reflecting the current state.

The account button and dropdown will share a wrapper reference. While the dropdown is open, document-level listeners will close it when a pointer event occurs outside that wrapper or when Escape is pressed. Interactions within the dropdown will not be treated as outside clicks. Existing dropdown navigation actions will continue closing it explicitly.

## State and data flow

No backend or authentication API changes are required. Login state remains sourced from local storage, and the navbar naturally re-renders after the existing post-login navigation. The dropdown remains local navbar state.

## Accessibility

The account trigger will expose `aria-expanded`, `aria-haspopup`, and a descriptive label. Escape dismissal will return focus to the account trigger. Decorative hero imagery will retain an empty alternative description, while slide controls keep their existing descriptive labels.

## Testing

Focused React Testing Library tests will verify:

- the logged-out outline icon state;
- the logged-in filled account icon state;
- outside pointer interaction closes an open dropdown;
- inside interaction does not incorrectly trigger outside dismissal;
- Escape closes the dropdown;
- the hero renders Framer Motion animation configuration for its staged content.

After focused tests pass, the complete frontend test suite and production build will be run to catch regressions.
