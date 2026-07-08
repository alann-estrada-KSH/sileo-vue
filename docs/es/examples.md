# Ejemplos

Esta página se enfoca en patrones de uso del mundo real.

## 1. Mensaje simple de éxito

```ts
sileo.success({
  title: "Saved",
  description: "Your changes were applied.",
});
```

## 2. Notificación de acción

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

## 3. Flujo de carga a éxito

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

## 4. Flujo de promesa a acción

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

## 5. Notificaciones en ráfaga agrupadas

```ts
sileo.info({ title: "File 1 uploaded", groupKey: "uploads" });
sileo.info({ title: "File 2 uploaded", groupKey: "uploads" });
sileo.info({ title: "File 3 uploaded", groupKey: "uploads" });
```

Cuando `Toaster grouping` está habilitado y la cubeta supera el umbral, sileo-vue colapsa el conjunto en una píldora resumen.

## 6. Contenido de descripción enriquecido

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

## 7. Notificación fija

```ts
sileo.info({
  title: "Pinned message",
  description: "This toast remains until dismissed manually.",
  duration: null,
});
```

## 8. Comportamiento y movimiento controlados

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

## 9. Paleta personalizada de marca

```vue
<script setup lang="ts">
import type { SileoColors } from "@alann-estrada-ksh/sileo-vue";

const brand: SileoColors = {
  background: "#1b1030",
  foreground: "#f4e9ff",
  success: "#7dffb3",
  error: "#ff6b81",
};
</script>

<template>
  <Toaster theme="custom" :colors="brand" />
</template>
```

Ver [Estilos y temas](styling.md) para la lista completa de campos de `SileoColors`.

## 10. Notificaciones de color al estilo toastify

```vue
<template>
  <Toaster theme="colored" />
</template>
```

Ahora el fondo de cada notificación coincide con su propio estado — éxito es verde, error es rojo, etc. — con el título, la descripción y el badge cambiando automáticamente a un color claro legible. Sobrescribe un solo estado manteniendo el resto:

```vue
<template>
  <Toaster theme="colored" :colors="{ success: '#059669' }" />
</template>
```

## 11. Configuración sugerida del shell de la app

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
