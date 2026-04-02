# Styling and Theming

Sileo exposes a small number of styling hooks so you can keep the defaults or build a branded variant.

## CSS Classes You Can Override

Use the `styles` field to attach custom classes to specific parts of a toast.

```ts
sileo.success({
  title: "Custom styled",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
    badge: "bg-white/20!",
    button: "bg-white/10!",
    toast: "shadow-2xl!",
  },
});
```

Available keys:
- `title`
- `description`
- `badge`
- `button`
- `toast`

## Color Model

Sileo uses CSS variables for the main state palette and sizing tokens.

| Variable | Purpose |
| --- | --- |
| `--sileo-state-success` | Success state color |
| `--sileo-state-loading` | Loading state color |
| `--sileo-state-error` | Error state color |
| `--sileo-state-warning` | Warning state color |
| `--sileo-state-info` | Info state color |
| `--sileo-state-action` | Action state color |
| `--sileo-width` | Viewport width cap |
| `--sileo-gap` | Gap between toasts |
| `--sileo-bg` | Surface background |
| `--sileo-fg` | Primary foreground |
| `--sileo-muted` | Secondary text color |

## Fill Strategy

Use the `fill` option when you want a specific toast to depart from the default theme.

```ts
sileo.success({
  title: "Saved",
  fill: "#171717",
  styles: {
    title: "text-white!",
    description: "text-white/75!",
  },
});
```

## Roundness

`roundness` controls the toast border radius.

```ts
sileo.success({
  title: "Sharp corners",
  roundness: 12,
});
```

A value around `16` balances aesthetics and rendering cost.

## Theme Prop on `Toaster`

```vue
<Toaster theme="dark" />
<Toaster theme="light" />
<Toaster theme="system" />
```

- `light` uses light viewport tokens.
- `dark` uses dark viewport tokens.
- `system` resolves from OS preference.

## Container Placement

If you need a specific mount point, use `container`.

```vue
<Toaster container="#sileo-toaster" />
```

Useful for:
- Modal stacking conflicts
- Embedded applications
- Layout shells with custom portals

## Best Practices

- Prefer `styles` for component-specific overrides.
- Prefer `fill` for semantic state differentiation.
- Prefer global CSS variables for app-wide branding.
- Keep action button labels short and direct.
