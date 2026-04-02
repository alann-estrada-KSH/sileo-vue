# Sileo Advanced Features

This document covers the latest runtime enhancements added to the Vue implementation.

## 1. Dynamic Content Height

`Sileo` now measures the real content height per toast and animates expand/collapse using that value.

What this fixes:
- No fixed-height clipping for long descriptions.
- No residual bottom spacing when content collapses.

No extra setup is required.

## 2. Swipe To Dismiss (Mobile-Friendly)

Toasts can be dismissed with vertical swipe gestures.

Default behavior:
- Enabled for every toast.
- Disabled automatically for `loading` state.
- Action button and dismiss button are excluded from swipe capture.

Per-toast control:

```ts
sileo.info({
  title: "Upload complete",
  description: "Swipe up/down to dismiss",
  swipeToDismiss: true,
});
```

Disable for a specific toast:

```ts
sileo.action({
  title: "Critical action",
  description: "Do not allow swipe dismiss",
  swipeToDismiss: false,
});
```

## 3. Accessibility Controls

`Toaster` now supports configurable live-region behavior:

```vue
<Toaster aria-live="assertive" />
```

Supported values:
- `polite` (default)
- `assertive`
- `off`

Runtime output:
- `role="status"`
- `aria-live="..."`
- `aria-atomic="true"`

## 4. Lifecycle Hooks

You can attach lifecycle callbacks to each toast through `hooks`.

```ts
sileo.success({
  title: "Saved",
  description: "Changes were persisted",
  hooks: {
    onShow: (ctx) => console.log("show", ctx),
    onExpand: (ctx) => console.log("expand", ctx),
    onCollapse: (ctx) => console.log("collapse", ctx),
    onDismiss: (ctx) => console.log("dismiss", ctx),
  },
});
```

Hook payload shape:

```ts
interface SileoLifecycleContext {
  id: string;
  instanceId: string;
  state: SileoState;
}
```

When each hook fires:
- `onShow`: toast is created (or replaced with same `id`).
- `onExpand`: content expands.
- `onCollapse`: content collapses.
- `onDismiss`: toast enters dismissal flow.

## Suggested QA Checklist

- Trigger `info`, `action`, and `promise` toasts with long descriptions.
- Verify no spacing remains after collapse.
- Verify swipe dismissal on mobile/touch simulation.
- Verify action button still works while swipe is enabled.
- Verify `aria-live` mode in browser accessibility tree.
- Verify lifecycle hooks fire in expected order.
