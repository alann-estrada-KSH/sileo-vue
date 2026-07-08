# Documentación de sileo-vue

sileo-vue es una librería de notificaciones (toasts) para Vue, construida para notificaciones expresivas, pilas agrupadas, flujos asíncronos e interacciones táctiles.

## Empieza aquí

- [Primeros pasos](getting-started.md)
- [Referencia de API](api-reference.md)
- [Ejemplos](examples.md)
- [Estilos y temas](styling.md)
- [Funciones avanzadas](advanced-features.md)

## En qué destaca sileo-vue

- Notificaciones imperativas rápidas desde cualquier parte de tu app.
- Flujos asíncronos con `promise` con estados de carga/éxito/error/acción.
- Agrupación de ráfagas de notificaciones para evitar saturar al usuario.
- Marcado personalizado en `description` e `icon`.
- Descarte con deslizamiento, pensado para móvil.
- Hooks de ciclo de vida para analítica, logging u orquestación personalizada.

## Puntos de entrada del paquete

- `import { sileo, Toaster } from "@alann-estrada-ksh/sileo-vue";`
- `import "@alann-estrada-ksh/sileo-vue/styles.css"`

## Flujo recomendado

1. Agrega un único `<Toaster />` cerca de la raíz de tu app.
2. Importa `sileo` donde necesites emitir una notificación.
3. Empieza con `info`, `success`, o `promise`.
4. Agrega `hooks`, `swipeToDismiss`, o `grouping` solo cuando lo necesites.
