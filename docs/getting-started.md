# Getting Started

## Install

```bash
npm install @alann-estrada-KSH/sileo-vue
```

If you are developing inside this repository, use the local example app:

```bash
npm run example:install
npm run example:dev
```

## Basic Setup

Import the runtime and render the toaster once in your app shell.

```ts
import { sileo, Toaster } from "@alann-estrada-KSH/sileo-vue";
```

```vue
<template>
  <Toaster position="top-right" />
  <button @click="notify">Notify</button>
</template>

<script setup lang="ts">
import { sileo, Toaster } from "@alann-estrada-KSH/sileo-vue";

const notify = () => {
  sileo.info({
    title: "Saved",
    description: "Your changes were stored.",
  });
};
</script>
```

## Minimal Mental Model

- `Toaster` renders the UI viewport.
- `sileo.*()` creates a toast.
- Each toast can be styled, grouped, auto-dismissed, or kept sticky.
- `promise()` upgrades a loading toast into success, error, or action.

## Importing CSS

Sileo ships its styles separately. Include them once at app bootstrap:

```ts
import "sileo/styles.css";
```

If you are using the repository example, the local app already imports the source stylesheet.

## First Notification Types

```ts
sileo.success({ title: "Done" });
sileo.error({ title: "Upload failed" });
sileo.warning({ title: "Quota almost full" });
sileo.info({ title: "Sync complete" });
sileo.action({ title: "New message", button: { title: "Open", onClick() {} } });
```

## Next Step

Read the [API Reference](api-reference.md) to understand every option and method.
