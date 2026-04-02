# Sileo Documentation

Sileo is a Vue toast library built for expressive notifications, grouped stacks, async flows, and touch-friendly interactions.

## Start Here

- [Getting Started](getting-started.md)
- [API Reference](api-reference.md)
- [Examples](examples.md)
- [Styling and Theming](styling.md)
- [Advanced Features](advanced-features.md)

## What Sileo Is Good At

- Fast imperative notifications from anywhere in your app.
- Async `promise` flows with loading/success/error/action states.
- Grouping bursts of notifications to avoid overload.
- Custom markup in `description` and `icon`.
- Mobile-friendly swipe dismissal.
- Lifecycle hooks for analytics, logging, or custom orchestration.

## Package Entry Points

- `import { sileo, Toaster } from "@alann-estrada-KSH/sileo-vue";`
- `import "sileo/styles.css"`

## Recommended Flow

1. Add a single `<Toaster />` near the app root.
2. Import `sileo` anywhere you need to emit a toast.
3. Start with `info`, `success`, or `promise`.
4. Add `hooks`, `swipeToDismiss`, or `grouping` only where needed.
