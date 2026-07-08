# Referencia de API

## API en tiempo de ejecución

### `sileo.show(options)`
Crea una notificación usando el `type` provisto en `options`, o usa `info` por defecto.

### `sileo.success(options)`
Crea una notificación de éxito.

### `sileo.error(options)`
Crea una notificación de error.

### `sileo.warning(options)`
Crea una notificación de advertencia.

### `sileo.info(options)`
Crea una notificación informativa.

### `sileo.action(options)`
Crea una notificación de acción.

### `sileo.loading(options)`
Crea una notificación de carga que permanece fija a menos que se descarte manualmente.

### `sileo.promise(promise, options)`
Crea una notificación de carga y la reemplaza cuando la promesa se resuelve.

- Retorna la promesa original.
- Acepta una promesa o una función que retorna una promesa.
- Soporta un override del estado de éxito vía `options.action`.

### `sileo.dismiss(id?)`
Descarta una notificación por id. Si no se provee id, se descartan todas las notificaciones activas.

### `sileo.clear(position?)`
Limpia todas las notificaciones, o solo las de una posición específica.

### `sileo.configure(options)`
Define valores por defecto globales para las notificaciones futuras.

## `SileoOptions`

Se pasa a cada método `sileo.*()`.

| Propiedad | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `id` | `string` | generado | Id estable para reemplazar una notificación existente |
| `title` | `string` | requerido en la mayoría de casos | Texto del encabezado |
| `description` | `VNodeChild \| string` | - | Contenido del cuerpo. Puede ser texto plano o nodos de Vue |
| `type` | `success \| loading \| error \| warning \| info \| action` | `info` | Estado usado por `show()` |
| `position` | `SileoPosition` | valor por defecto de `Toaster` | Posición en el viewport |
| `duration` | `number \| null` | `6000` | Milisegundos hasta autodescartarse. `null` significa fija |
| `icon` | `VNodeChild \| null` | ícono del estado | Ícono personalizado renderizado en el badge |
| `styles` | `SileoStyles` | - | Overrides de clase para subelementos |
| `fill` | `string` | depende del tema | Color de fondo de la notificación |
| `roundness` | `number` | `16` | Radio de borde en píxeles |
| `autopilot` | `boolean \| { expand?: number; collapse?: number }` | `true` | Controla el tiempo de expansión/colapso |
| `swipeToDismiss` | `boolean` | `true` | Habilita el descarte por deslizamiento en dispositivos con puntero |
| `button` | `SileoButton` | - | Configuración del botón de acción |
| `groupKey` | `string` | - | Cubeta lógica de agrupación para ráfagas de notificaciones |
| `hooks` | `SileoLifecycleHooks` | - | Callbacks de ciclo de vida |

## `SileoButton`

```ts
interface SileoButton {
  title: string;
  onClick?: () => void;
}
```

## `SileoStyles`

```ts
interface SileoStyles {
  title?: string;
  description?: string;
  badge?: string;
  button?: string;
  toast?: string;
}
```

## `SileoColors`

Se pasa a `Toaster` vía la prop `colors`. Todos los campos son opcionales.

```ts
interface SileoColors {
  background?: string;
  foreground?: string;
  description?: string;
  dismissBackground?: string;
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  action?: string;
  loading?: string;
}
```

## `SileoLifecycleHooks`

```ts
interface SileoLifecycleHooks {
  onShow?: (ctx: SileoLifecycleContext) => void;
  onExpand?: (ctx: SileoLifecycleContext) => void;
  onCollapse?: (ctx: SileoLifecycleContext) => void;
  onDismiss?: (ctx: SileoLifecycleContext) => void;
}
```

## `SileoLifecycleContext`

```ts
interface SileoLifecycleContext {
  id: string;
  instanceId: string;
  state: SileoState;
}
```

## `SileoPromiseOptions`

Se pasa como segundo argumento a `sileo.promise()`.

```ts
interface SileoPromiseOptions<T = unknown> {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
}
```

## Props de `Toaster`

| Propiedad | Tipo | Por defecto | Descripción |
| --- | --- | --- | --- |
| `position` | `SileoPosition` | `top-right` | Posición por defecto para nuevas notificaciones |
| `offset` | `number \| string \| object` | - | Distancia respecto a los bordes del viewport |
| `options` | `Partial<SileoOptions>` | - | Valores por defecto globales combinados en cada notificación |
| `theme` | `light \| dark \| system \| custom \| colored` | resuelto según el sistema | Controla los tokens de tema del viewport. `colored` rellena cada notificación con el color de su propio estado (ver [Estilos y temas](styling.md)) |
| `colors` | `Partial<SileoColors>` | - | Overrides de color por campo, funciona con cualquier tema (ver [Estilos y temas](styling.md)) |
| `container` | `string \| HTMLElement` | `body` | Destino del teleport |
| `grouping` | `boolean` | `false` | Habilita la agrupación de notificaciones |
| `groupThreshold` | `number` | `4` | Notificaciones necesarias antes de que la agrupación entre en acción |
| `ariaLive` | `off \| polite \| assertive` | `polite` | Modo de la región en vivo (live-region) del viewport |

## `SileoPosition`

```ts
type SileoPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

## Valores por defecto

- `DEFAULT_TOAST_DURATION = 6000`
- `EXIT_DURATION = 600`
- `DEFAULT_ROUNDNESS = 16`
- `GROUP_THRESHOLD = 4`

## Valores de retorno

- La mayoría de los métodos `sileo.*()` retornan el id de la notificación.
- `sileo.promise()` retorna la promesa original para que puedas seguir encadenando o hacer `await`.
- `dismiss()` y `clear()` retornan `void`.

## Notas prácticas

- Pasar el mismo `id` reemplaza una notificación activa existente en lugar de apilar duplicados.
- Las notificaciones `loading` son fijas por defecto.
- `description` e `icon` pueden ser nodos de Vue, no solo strings.
- `swipeToDismiss` se ignora mientras está en carga y en controles interactivos.
