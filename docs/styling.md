# Styling and Theming

sileo-vue exposes a small number of styling hooks so you can keep the defaults or build a branded variant.

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

sileo-vue uses CSS variables for the main state palette and sizing tokens.

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
<Toaster theme="custom" :colors="myColors" />
<Toaster theme="colored" />
```

- `light` uses light viewport tokens.
- `dark` uses dark viewport tokens.
- `system` resolves from OS preference.
- `custom` starts from the light palette and is meant to be paired with the `colors` prop below. Without `colors`, it renders identically to `light`.
- `colored` fills each toast's own background with its state color — success is green, error is red, warning is amber, info is blue, action is violet, loading is gray — the same idea as react-toastify's `colored` theme. Title, description, badge, and dismiss button automatically switch to a light foreground so they stay readable against the colored fill.

### Colored Theme + Custom Colors

`colored` and `colors` compose. Override one state's color, or replace all of them, without losing the "background matches state" behavior:

```vue
<script setup lang="ts">
import type { SileoColors } from "@alann-estrada-ksh/sileo-vue";

// Only success is overridden — error, warning, etc. keep the built-in colored fills.
const colors: SileoColors = { success: "#059669" };
</script>

<template>
  <Toaster theme="colored" :colors="colors" />
</template>
```

Setting `colors.background` instead overrides every state with the same flat color, opting back out of per-state coloring entirely — useful if you want the light-foreground styling of `colored` but a single brand fill.

## Custom Colors (`colors` prop)

Pass a `colors` object to `Toaster` to override any part of the palette without writing CSS. Every field is optional — anything you don't set falls back to the active theme's default.

```vue
<script setup lang="ts">
import type { SileoColors } from "@alann-estrada-ksh/sileo-vue";

const brandColors: SileoColors = {
  background: "#1b1030",
  foreground: "#f4e9ff",
  description: "#c9b8e8",
  dismissBackground: "#4b3869",
  success: "#7dffb3",
  error: "#ff6b81",
  warning: "#ffd166",
  info: "#7dc4ff",
  action: "#c792ff",
  loading: "#a0a0c0",
};
</script>

<template>
  <Toaster theme="custom" :colors="brandColors" />
</template>
```

| Key | Overrides |
| --- | --- |
| `background` | Toast fill color (same slot as per-toast `fill`, but viewport-wide) |
| `foreground` | Title text color |
| `description` | Description text color |
| `dismissBackground` | Dismiss button background (both resting and hover) |
| `success` / `error` / `warning` / `info` / `action` / `loading` | Per-state badge, title, and action-button accent color |

`colors` works with any `theme` value, not just `custom` — for example `<Toaster theme="dark" :colors="{ success: '#22c55e' }" />` keeps the dark theme but recolors only the success state. Use `theme="custom"` when you want a fully bespoke palette instead of tweaking an existing theme.

Under the hood, `colors` sets CSS custom properties (`--sileo-bg-color`, `--sileo-fg-color`, `--sileo-state-success`, etc.) on the toast viewport, so it composes with the CSS variables listed above — you can mix `colors` for per-consumer branding with a global stylesheet override for app-wide defaults.

Run `npm run example:dev` and switch to the "custom" theme button to try every field live with color pickers.

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
