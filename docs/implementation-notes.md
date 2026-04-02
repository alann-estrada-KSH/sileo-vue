# Implementation Notes

This document is for teams integrating Sileo into an existing Vue app or design system.

## Placement

Render exactly one `Toaster` near the top of the application tree.

Recommended locations:
- App shell
- Root layout
- Client-only provider area

Avoid rendering multiple global toasters unless you intentionally need separate stacks.

## Integration Pattern

```vue
<script setup lang="ts">
import { Toaster } from "@alann-estrada-KSH/sileo-vue";
</script>

<template>
  <Toaster position="top-right" theme="system" :grouping="true" />
  <RouterView />
</template>
```

## Common Scenarios

### Save success

Use a short, positive toast after a mutation completes.

### Validation failure

Use error toasts when the user needs to retry or fix input.

### Async flows

Prefer `sileo.promise()` whenever a request has loading → success/error transitions.

### High-volume events

Use `grouping` and `groupKey` to prevent notification spam.

### Mobile experiences

Keep `swipeToDismiss` enabled for non-critical, user-dismissible toasts.
Disable it for critical, stateful alerts.

## Accessibility Guidance

- Use `aria-live="assertive"` only for urgent messages.
- Leave it on `polite` for most apps.
- Use custom labels for action buttons if the action is ambiguous.

## Reliability Guidance

- Do not use toast ids as user-facing identifiers.
- Use lifecycle hooks for analytics and logging, not for imperative UI branching.
- Keep descriptions concise to reduce layout churn.

## QA Checklist

- Toast appears once per emission.
- `promise()` replaces the loading toast correctly.
- Grouped bursts collapse and expand correctly.
- Swipe dismissal does not interfere with action buttons.
- Theming matches the app shell.
- No residual spacing remains after collapse.
