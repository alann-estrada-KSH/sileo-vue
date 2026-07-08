# Notas de implementación

Este documento es para equipos que integran sileo-vue en una app o sistema de diseño Vue existente.

## Ubicación

Renderiza exactamente un `Toaster` cerca de la raíz del árbol de la aplicación.

Ubicaciones recomendadas:
- Shell de la app
- Layout raíz
- Área de proveedores solo-cliente

Evita renderizar múltiples toasters globales a menos que necesites intencionalmente pilas separadas.

## Patrón de integración

```vue
<script setup lang="ts">
import { Toaster } from "@alann-estrada-ksh/sileo-vue";
</script>

<template>
  <Toaster position="top-right" theme="system" :grouping="true" />
  <RouterView />
</template>
```

## Escenarios comunes

### Guardado exitoso

Usa una notificación corta y positiva después de que una mutación se completa.

### Falla de validación

Usa notificaciones de error cuando el usuario necesita reintentar o corregir su entrada.

### Flujos asíncronos

Prefiere `sileo.promise()` siempre que una petición tenga transiciones de carga → éxito/error.

### Eventos de alto volumen

Usa `grouping` y `groupKey` para evitar el spam de notificaciones.

### Experiencias móviles

Mantén `swipeToDismiss` habilitado para notificaciones no críticas descartables por el usuario.
Deshabilítalo para alertas críticas con estado.

## Guía de accesibilidad

- Usa `aria-live="assertive"` solo para mensajes urgentes.
- Déjalo en `polite` para la mayoría de las apps.
- Usa etiquetas personalizadas para botones de acción si la acción es ambigua.

## Guía de confiabilidad

- No uses los ids de notificación como identificadores de cara al usuario.
- Usa los hooks de ciclo de vida para analítica y logging, no para ramificar la UI de forma imperativa.
- Mantén las descripciones concisas para reducir el reflow del layout.

## Checklist de QA

- La notificación aparece una vez por emisión.
- `promise()` reemplaza correctamente la notificación de carga.
- Las ráfagas agrupadas colapsan y se expanden correctamente.
- El descarte por deslizamiento no interfiere con los botones de acción.
- El tema coincide con el shell de la app.
- No queda espacio residual tras el colapso.
