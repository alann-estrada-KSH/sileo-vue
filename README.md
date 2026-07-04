<div align="center">
  <h1>sileo-vue</h1>
  <p>An opinionated toast component for Vue.</p>
  <p><a href="https://alann-estrada-ksh.github.io/sileo-vue/">Try Out</a> &nbsp; / &nbsp; <a href="docs/index.md">Docs</a></p>
  <video src="https://github.com/user-attachments/assets/a292d310-9189-490a-9f9d-d0a1d09defce"></video>
</div>

### Credits

sileo-vue is an improved fork of [Sileo](https://github.com/hiaaryan/sileo) by [@hiaaryan](https://github.com/hiaaryan), which was originally built for React. This is an independent Vue 3 implementation, extended beyond the original's scope with grouping/stacking, promise-driven lifecycles, swipe-to-dismiss, lifecycle hooks, per-field custom color theming (including a toastify-style `colored` theme), and accessibility controls.

### Installation

```bash
npm i @alann-estrada-ksh/sileo-vue
```

### Documentation

Start here:

- [Docs Index](docs/index.md)
- [Getting Started](docs/getting-started.md)
- [API Reference](docs/api-reference.md)
- [Examples](docs/examples.md)
- [Styling and Theming](docs/styling.md)
- [Advanced Features](docs/advanced-features.md)
- [Implementation Notes](docs/implementation-notes.md)
- [Migration Guide](docs/migration-guide.md)

### Local Example (In-Repo)

You can run a demo app directly from this repository to validate behavior locally:

```bash
npm run example:install
npm run example:dev
```

The example lives in `example/` and imports the package from local source so you can validate animations, icons, grouping, promise flow, swipe behavior, hooks and accessibility without publishing.

### Landing Page

A promotional site with a live playground, feature overview, and documentation links lives in `landing/`:

```bash
npm run landing:install
npm run landing:dev
```

It's deployed to GitHub Pages automatically on every push to `main` that touches `landing/` or `src/` (see `.github/workflows/deploy-landing.yml`). Enable Pages under repo Settings → Pages → Source: "GitHub Actions" for the first deploy to take effect.

### Getting Started

```ts
import { sileo, Toaster } from "@alann-estrada-ksh/sileo-vue";
```

```ts

const notify = () => {
  sileo.info({
    title: "Saved",
    description: "Your changes were stored.",
  });
};
```

```vue
<template>
  <Toaster position="top-right" />
  <button @click="notify">Show toast</button>
</template>
```

### Actionable Toast Philosophy

Buttons in toasts should be used for immediate, high-value follow-up actions.

- Good: actions directly related to the event, such as "Open", "Undo", or "Share" when the toast represents shareable content.
- Avoid: unrelated or low-value actions that belong in full UI flows (dialogs, pages, settings panes).
- Rule of thumb: if the action cannot be understood without extra context, it should not live inside a toast button.

### Grouping and Stacking

To avoid notification overload, `Toaster` can group bursts of toasts:

```vue
<Toaster :grouping="true" :group-threshold="3" />
```

### Custom Colors

Every color the toast uses can be overridden per-field, on any theme:

```vue
<Toaster
  theme="custom"
  :colors="{
    background: '#1b1030',
    foreground: '#f4e9ff',
    success: '#7dffb3',
    error: '#ff6b81',
  }"
/>
```

See [Styling and Theming](docs/styling.md) for the full `SileoColors` reference, or run the local example and switch to the "custom" theme to try it with live color pickers.

Prefer a toastify-style look where each toast is filled with its own state color? Use `theme="colored"`:

```vue
<Toaster theme="colored" />
```

`colors` still composes on top — override just one state (`:colors="{ success: '#059669' }"`) or set `colors.background` to flatten every state to one brand color while keeping the light-foreground styling.

### Render In Custom Container

You can choose where the toaster is teleported (useful for modal/root stacking conflicts):

```vue
<Toaster :container="'#sileo-toaster'" />
```

### Methods

- `sileo.info`, `sileo.success`, `sileo.warning`, `sileo.error`, `sileo.action`
- `sileo.loading` for independent loading notifications
- `sileo.promise` for async lifecycle notifications
- `sileo.dismiss(id?)` and `sileo.clear(position?)`
- `sileo.configure(...)` for persistent global defaults

### New Runtime Enhancements

- Dynamic content height animation (no fixed collapse spacing)
- Swipe-to-dismiss for touch devices (`swipeToDismiss` per toast)
- Accessibility live-region control (`aria-live` on `Toaster`)
- Lifecycle hooks (`hooks.onShow`, `hooks.onExpand`, `hooks.onCollapse`, `hooks.onDismiss`)

### Lifecycle Hooks

```ts
sileo.success({
  title: "Saved",
  description: "All changes stored.",
  hooks: {
    onShow: (ctx) => console.log("show", ctx),
    onExpand: (ctx) => console.log("expand", ctx),
    onCollapse: (ctx) => console.log("collapse", ctx),
    onDismiss: (ctx) => console.log("dismiss", ctx),
  },
});
```

### Accessibility

```vue
<Toaster aria-live="polite" />
```

Allowed values:
- `polite` (default)
- `assertive`
- `off`

### Swipe To Dismiss

```ts
sileo.info({
  title: "Upload complete",
  swipeToDismiss: true,
});
```

Disable per toast:

```ts
sileo.action({
  title: "Pinned alert",
  swipeToDismiss: false,
});
```

For detailed docs, click here: https://alann-estrada-ksh.github.io/sileo-vue/
