# Funciones avanzadas de sileo-vue

Este documento cubre las mejoras más recientes del runtime agregadas a la implementación en Vue.

## 1. Altura de contenido dinámica

sileo-vue ahora mide la altura real del contenido de cada notificación y anima la expansión/colapso usando ese valor.

Qué soluciona esto:
- Sin recorte de altura fija para descripciones largas.
- Sin espacio residual en la parte inferior cuando el contenido colapsa.

No se requiere configuración adicional.

## 2. Deslizar para descartar (amigable con móvil)

Las notificaciones pueden descartarse con gestos de deslizamiento vertical.

Comportamiento por defecto:
- Habilitado para toda notificación.
- Deshabilitado automáticamente para el estado `loading`.
- El botón de acción y el botón de descarte quedan excluidos de la captura del deslizamiento.

Control por notificación:

```ts
sileo.info({
  title: "Upload complete",
  description: "Swipe up/down to dismiss",
  swipeToDismiss: true,
});
```

Deshabilitar para una notificación específica:

```ts
sileo.action({
  title: "Critical action",
  description: "Do not allow swipe dismiss",
  swipeToDismiss: false,
});
```

## 3. Controles de accesibilidad

`Toaster` ahora soporta un comportamiento configurable de región en vivo (live-region):

```vue
<Toaster aria-live="assertive" />
```

Valores soportados:
- `polite` (por defecto)
- `assertive`
- `off`

Salida en tiempo de ejecución:
- `role="status"`
- `aria-live="..."`
- `aria-atomic="true"`

## 4. Hooks de ciclo de vida

Puedes adjuntar callbacks de ciclo de vida a cada notificación a través de `hooks`.

```ts
sileo.success({
  title: "Saved",
  description: "Changes were persisted",
  hooks: {
    onShow: (ctx) => console.log("show", ctx),
    onExpand: (ctx) => console.log("expand", ctx),
    onCollapse: (ctx) => console.log("collapse", ctx),
    onDismiss: (ctx) => console.log("dismiss", ctx),
  },
});
```

Forma del payload del hook:

```ts
interface SileoLifecycleContext {
  id: string;
  instanceId: string;
  state: SileoState;
}
```

Cuándo se dispara cada hook:
- `onShow`: la notificación se crea (o se reemplaza con el mismo `id`).
- `onExpand`: el contenido se expande.
- `onCollapse`: el contenido colapsa.
- `onDismiss`: la notificación entra en el flujo de descarte.

## Checklist de QA sugerido

- Dispara notificaciones `info`, `action` y `promise` con descripciones largas.
- Verifica que no quede espacio residual tras el colapso.
- Verifica el descarte por deslizamiento en simulación de móvil/táctil.
- Verifica que el botón de acción siga funcionando mientras el deslizamiento está habilitado.
- Verifica el modo `aria-live` en el árbol de accesibilidad del navegador.
- Verifica que los hooks de ciclo de vida se disparen en el orden esperado.
