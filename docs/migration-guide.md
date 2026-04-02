# Migration Guide

If you are upgrading from an earlier React-based version or from an older Vue snapshot, use this guide to avoid regressions.

## What Changed

- Runtime is Vue-first.
- `Toaster` is a Vue component.
- `description` and `icon` accept Vue nodes.
- `autopilot` controls the expand/collapse lifecycle.
- Grouping now supports `groupKey`.
- Toast hooks are available for lifecycle integration.

## What Stayed the Same

- Imperative `sileo.*()` API.
- `dismiss(id?)` and `clear(position?)`.
- Toast state semantics: success, loading, error, warning, info, action.

## Migration Checklist

1. Replace React imports with Vue imports.
2. Ensure your app renders one `Toaster`.
3. Move any JSX description content to Vue nodes.
4. Add `styles.css` import once in your app bootstrap.
5. Audit any custom interactions that depended on old animation timings.
6. If you use promise flows, verify loading to success/error replacements.

## Example of a Ported Notification

```ts
sileo.action({
  title: "New lead",
  description: "Open the lead details to continue.",
  button: {
    title: "Open",
    onClick: () => openLead(),
  },
  hooks: {
    onShow: ({ id }) => console.log("toast shown", id),
  },
});
```

## Troubleshooting

### Toasts overlap or stack unexpectedly

Enable grouping and tune `groupThreshold`.

### Content hides too quickly

Tune `autopilot.expand` and `autopilot.collapse`.

### Swipe dismissal is too aggressive

Disable `swipeToDismiss` for that toast.

### Screen readers announce too much

Use `aria-live="polite"` instead of `assertive`.
