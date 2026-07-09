# Primeros pasos

## Instalación

```bash
npm install @alann-estrada-ksh/sileo-vue
```

Si estás desarrollando dentro de este repositorio, usa la app de ejemplo local:

```bash
npm run example:install
npm run example:dev
```

### Sin bundler

¿No usas npm/Vite/webpack? sileo-vue también está publicado en jsDelivr — tráelo directo desde el CDN: https://www.jsdelivr.com/package/npm/@alann-estrada-ksh/sileo-vue

## Configuración básica

Importa el runtime y renderiza el toaster una sola vez en el shell de tu app.

```ts
import { sileo, Toaster } from "@alann-estrada-ksh/sileo-vue";
```

```vue
<template>
  <Toaster position="top-right" />
  <button @click="notify">Notify</button>
</template>

<script setup lang="ts">
import { sileo, Toaster } from "@alann-estrada-ksh/sileo-vue";

const notify = () => {
  sileo.info({
    title: "Saved",
    description: "Your changes were stored.",
  });
};
</script>
```

## Modelo mental mínimo

- `Toaster` renderiza el viewport de la interfaz.
- `sileo.*()` crea una notificación.
- Cada notificación puede tener estilo propio, agruparse, autodescartarse, o quedar fija.
- `promise()` convierte una notificación de carga en éxito, error, o acción.

## Importar el CSS

sileo-vue distribuye sus estilos por separado. Impórtalos una vez al arrancar la app:

```ts
import "sileo/styles.css";
```

Si usas el ejemplo del repositorio, la app local ya importa la hoja de estilos fuente.

## Primeros tipos de notificación

```ts
sileo.success({ title: "Done" });
sileo.error({ title: "Upload failed" });
sileo.warning({ title: "Quota almost full" });
sileo.info({ title: "Sync complete" });
sileo.action({ title: "New message", button: { title: "Open", onClick() {} } });
```

## Siguiente paso

Lee la [Referencia de API](api-reference.md) para entender cada opción y método.
