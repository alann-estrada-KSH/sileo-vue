# Estilos y temas

sileo-vue expone un pequeño número de puntos de estilo para que mantengas los valores por defecto o construyas una variante de marca.

## Clases CSS que puedes sobrescribir

Usa el campo `styles` para adjuntar clases personalizadas a partes específicas de una notificación.

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

Claves disponibles:
- `title`
- `description`
- `badge`
- `button`
- `toast`

## Modelo de color

sileo-vue usa variables CSS para la paleta principal de estados y los tokens de tamaño.

| Variable | Propósito |
| --- | --- |
| `--sileo-state-success` | Color del estado de éxito |
| `--sileo-state-loading` | Color del estado de carga |
| `--sileo-state-error` | Color del estado de error |
| `--sileo-state-warning` | Color del estado de advertencia |
| `--sileo-state-info` | Color del estado informativo |
| `--sileo-state-action` | Color del estado de acción |
| `--sileo-width` | Ancho máximo del viewport |
| `--sileo-gap` | Espacio entre notificaciones |
| `--sileo-bg` | Color de fondo de la superficie |
| `--sileo-fg` | Color de primer plano principal |
| `--sileo-muted` | Color de texto secundario |

## Estrategia de relleno (`fill`)

Usa la opción `fill` cuando quieras que una notificación específica se aparte del tema por defecto.

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

## Redondez (`roundness`)

`roundness` controla el radio de borde de la notificación.

```ts
sileo.success({
  title: "Sharp corners",
  roundness: 12,
});
```

Un valor cercano a `16` equilibra estética y costo de renderizado.

## Prop `theme` en `Toaster`

```vue
<Toaster theme="dark" />
<Toaster theme="light" />
<Toaster theme="system" />
<Toaster theme="custom" :colors="myColors" />
<Toaster theme="colored" />
```

- `light` usa los tokens claros del viewport.
- `dark` usa los tokens oscuros del viewport.
- `system` se resuelve según la preferencia del sistema operativo.
- `custom` parte de la paleta clara y está pensado para combinarse con la prop `colors` de abajo. Sin `colors`, se renderiza igual que `light`.
- `colored` rellena el fondo de cada notificación con el color de su propio estado — éxito es verde, error es rojo, advertencia es ámbar, info es azul, acción es violeta, carga es gris — la misma idea que el tema `colored` de react-toastify. El título, la descripción, el badge y el botón de descarte cambian automáticamente a un primer plano claro para mantenerse legibles sobre el relleno de color.

### Tema colored + colores personalizados

`colored` y `colors` se combinan. Sobrescribe el color de un solo estado, o reemplázalos todos, sin perder el comportamiento de "el fondo coincide con el estado":

```vue
<script setup lang="ts">
import type { SileoColors } from "@alann-estrada-ksh/sileo-vue";

// Solo se sobrescribe success — error, warning, etc. mantienen sus rellenos coloreados por defecto.
const colors: SileoColors = { success: "#059669" };
</script>

<template>
  <Toaster theme="colored" :colors="colors" />
</template>
```

Configurar `colors.background` en su lugar sobrescribe todos los estados con el mismo color plano, saliéndose por completo del coloreado por estado — útil si quieres el estilo de primer plano claro de `colored` pero con un solo relleno de marca.

## Colores personalizados (prop `colors`)

Pasa un objeto `colors` a `Toaster` para sobrescribir cualquier parte de la paleta sin escribir CSS. Todos los campos son opcionales — lo que no configures cae al valor por defecto del tema activo.

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

| Clave | Sobrescribe |
| --- | --- |
| `background` | Color de relleno de la notificación (mismo slot que `fill` por notificación, pero para todo el viewport) |
| `foreground` | Color del texto del título |
| `description` | Color del texto de la descripción |
| `dismissBackground` | Fondo del botón de descarte (reposo y hover) |
| `success` / `error` / `warning` / `info` / `action` / `loading` | Color de acento del badge, título y botón de acción por estado |

`colors` funciona con cualquier valor de `theme`, no solo `custom` — por ejemplo `<Toaster theme="dark" :colors="{ success: '#22c55e' }" />` mantiene el tema oscuro pero recolorea solo el estado de éxito. Usa `theme="custom"` cuando quieras una paleta totalmente a medida en lugar de ajustar un tema existente.

Por debajo, `colors` configura propiedades personalizadas CSS (`--sileo-bg-color`, `--sileo-fg-color`, `--sileo-state-success`, etc.) en el viewport de la notificación, así que compone con las variables CSS listadas arriba — puedes combinar `colors` para branding por consumidor con un override de hoja de estilos global para valores por defecto de toda la app.

Ejecuta `npm run example:dev` y cambia al botón de tema "custom" para probar cada campo en vivo con selectores de color.

## Ubicación del contenedor

Si necesitas un punto de montaje específico, usa `container`.

```vue
<Toaster container="#sileo-toaster" />
```

Útil para:
- Conflictos de apilamiento con modales
- Aplicaciones embebidas
- Shells de layout con portales personalizados

## Buenas prácticas

- Prefiere `styles` para overrides específicos de un componente.
- Prefiere `fill` para diferenciación semántica de estados.
- Prefiere variables CSS globales para branding de toda la app.
- Mantén las etiquetas del botón de acción cortas y directas.
