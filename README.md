<div align="center">
  <h1>Sileo</h1>
  <p>An opinionated toast component for Vue.</p>
  <p><a href="https://sileo.aaryan.design">Try Out</a> &nbsp; / &nbsp; <a href="https://sileo.aaryan.design/docs">Docs</a></p>
  <video src="https://github.com/user-attachments/assets/a292d310-9189-490a-9f9d-d0a1d09defce"></video>
</div>

### Installation

```bash
npm i sileo
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

### Getting Started

```ts
import { sileo, Toaster } from "@alann-estrada-KSH/sileo-vue";
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

For detailed docs, click here: https://sileo.aaryan.design
