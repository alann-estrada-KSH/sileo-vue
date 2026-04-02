# Examples

This page focuses on real-world usage patterns.

## 1. Simple success message

```ts
sileo.success({
  title: "Saved",
  description: "Your changes were applied.",
});
```

## 2. Action toast

```ts
sileo.action({
  title: "New comment",
  description: "Open the thread to reply.",
  button: {
    title: "Open",
    onClick: () => router.push("/thread/123"),
  },
});
```

## 3. Loading to success flow

```ts
await sileo.promise(saveProfile(), {
  loading: {
    title: "Saving profile",
    description: "Please wait...",
  },
  success: () => ({
    title: "Profile saved",
    description: "Your settings are now up to date.",
  }),
  error: (err) => ({
    title: "Save failed",
    description: String(err),
  }),
});
```

## 4. Promise to action flow

```ts
await sileo.promise(fetchInvoice(), {
  loading: {
    title: "Creating invoice",
  },
  success: (invoice) => ({
    title: "Invoice ready",
    description: invoice.number,
  }),
  action: (invoice) => ({
    title: "Invoice ready",
    description: invoice.number,
    button: {
      title: "Copy number",
      onClick: () => navigator.clipboard.writeText(invoice.number),
    },
  }),
  error: {
    title: "Invoice could not be created",
  },
});
```

## 5. Grouped burst notifications

```ts
sileo.info({ title: "File 1 uploaded", groupKey: "uploads" });
sileo.info({ title: "File 2 uploaded", groupKey: "uploads" });
sileo.info({ title: "File 3 uploaded", groupKey: "uploads" });
```

When `Toaster grouping` is enabled and the bucket crosses the threshold, Sileo collapses the set into a summary pill.

## 6. Rich description content

```ts
import { h } from "vue";

sileo.info({
  title: "Team update",
  description: h("div", { class: "stack" }, [
    h("strong", "3 members joined"),
    h("span", "A new workspace has been provisioned."),
  ]),
});
```

## 7. Sticky notification

```ts
sileo.info({
  title: "Pinned message",
  description: "This toast remains until dismissed manually.",
  duration: null,
});
```

## 8. Controlled motion and behavior

```ts
sileo.info({
  title: "Custom timing",
  description: "Expand/collapse can be tuned.",
  autopilot: {
    expand: 300,
    collapse: 2400,
  },
  swipeToDismiss: true,
  hooks: {
    onShow: ({ id }) => console.log("shown", id),
    onDismiss: ({ id }) => console.log("dismissed", id),
  },
});
```

## 9. Suggested app shell setup

```vue
<template>
  <AppLayout>
    <RouterView />
    <Toaster
      position="top-right"
      theme="system"
      :grouping="true"
      :group-threshold="4"
      aria-live="polite"
    />
  </AppLayout>
</template>
```
