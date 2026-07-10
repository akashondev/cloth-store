# Signed-in Navbar Avatar

## Scope

Replace the current solid white logged-in account icon with a compact initial avatar. Logged-out icon behavior, authentication storage, and dropdown content remain unchanged.

## Presentation

When a stored user is available, the navbar account trigger displays a 32-pixel teal circular avatar containing the uppercase first visible character of the user's trimmed name. The avatar uses white text, a subtle lighter teal ring, and a restrained hover treatment suitable for the black navbar. If the stored user has no usable name, the avatar displays a generic `User` icon instead of an empty initial.

Logged-out visitors continue seeing the existing outline account icon. The trigger retains its accessible label, expanded state, outside-click dismissal, and Escape behavior.

## Testing

Navbar tests will verify that a named logged-in user receives the correct uppercase initial, whitespace is ignored, a nameless user receives the fallback icon, and the logged-out icon state remains unchanged.
