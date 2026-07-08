# Guía de migración

Si estás actualizando desde una versión anterior basada en React o desde una versión previa de Vue, usa esta guía para evitar regresiones.

## Qué cambió

- El runtime ahora es Vue-first.
- `Toaster` es un componente de Vue.
- `description` e `icon` aceptan nodos de Vue.
- `autopilot` controla el ciclo de vida de expansión/colapso.
- La agrupación ahora soporta `groupKey`.
- Hay hooks de notificación disponibles para integración de ciclo de vida.

## Qué se mantuvo igual

- API imperativa `sileo.*()`.
- `dismiss(id?)` y `clear(position?)`.
- Semántica de estado de la notificación: success, loading, error, warning, info, action.

## Checklist de migración

1. Reemplaza los imports de React por imports de Vue.
2. Asegúrate de que tu app renderiza un `Toaster`.
3. Mueve cualquier contenido de descripción en JSX a nodos de Vue.
4. Agrega el import de `styles.css` una vez en el bootstrap de tu app.
5. Audita cualquier interacción personalizada que dependiera de los tiempos de animación antiguos.
6. Si usas flujos de promesa, verifica los reemplazos de carga a éxito/error.

## Ejemplo de una notificación migrada

```ts
sileo.action({
  title: "New lead",
  description: "Open the lead details to continue.",
  button: {
    title: "Open",
    onClick: () => openLead(),
  },
  hooks: {
    onShow: ({ id }) => console.log("toast shown", id),
  },
});
```

## Solución de problemas

### Las notificaciones se superponen o se apilan de forma inesperada

Habilita la agrupación y ajusta `groupThreshold`.

### El contenido se oculta demasiado rápido

Ajusta `autopilot.expand` y `autopilot.collapse`.

### El descarte por deslizamiento es demasiado agresivo

Deshabilita `swipeToDismiss` para esa notificación.

### Los lectores de pantalla anuncian demasiado

Usa `aria-live="polite"` en lugar de `assertive`.
