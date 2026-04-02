# API Reference

## Runtime API

### `sileo.show(options)`
Creates a toast using the `type` provided in `options`, or defaults to `info`.

### `sileo.success(options)`
Creates a success toast.

### `sileo.error(options)`
Creates an error toast.

### `sileo.warning(options)`
Creates a warning toast.

### `sileo.info(options)`
Creates an info toast.

### `sileo.action(options)`
Creates an action toast.

### `sileo.loading(options)`
Creates a loading toast that stays sticky unless dismissed manually.

### `sileo.promise(promise, options)`
Creates a loading toast and replaces it when the promise settles.

- Returns the original promise.
- Accepts either a promise or a function returning a promise.
- Supports a success action override via `options.action`.

### `sileo.dismiss(id?)`
Dismisses a toast by id. If no id is provided, all current toasts are dismissed.

### `sileo.clear(position?)`
Clears all toasts, or only the ones at a specific position.

### `sileo.configure(options)`
Sets global defaults for future toasts.

## `SileoOptions`

Passed to every `sileo.*()` method.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | generated | Stable id for replacing an existing toast |
| `title` | `string` | required for most usage | Header text |
| `description` | `VNodeChild \| string` | - | Body content. Can be plain text or Vue nodes |
| `type` | `success \| loading \| error \| warning \| info \| action` | `info` | State used by `show()` |
| `position` | `SileoPosition` | `Toaster` default | Viewport position |
| `duration` | `number \| null` | `6000` | Auto-dismiss ms. `null` means sticky |
| `icon` | `VNodeChild \| null` | state icon | Custom icon rendered in the badge |
| `styles` | `SileoStyles` | - | Class overrides for sub-elements |
| `fill` | `string` | theme dependent | Fill color for the toast background |
| `roundness` | `number` | `16` | Border radius in pixels |
| `autopilot` | `boolean \| { expand?: number; collapse?: number }` | `true` | Controls expand/collapse timing |
| `swipeToDismiss` | `boolean` | `true` | Enables swipe dismissal on pointer devices |
| `button` | `SileoButton` | - | Action button config |
| `groupKey` | `string` | - | Logical grouping bucket for burst notifications |
| `hooks` | `SileoLifecycleHooks` | - | Lifecycle callbacks |

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

Passed as the second argument to `sileo.promise()`.

```ts
interface SileoPromiseOptions<T = unknown> {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
}
```

## `Toaster` props

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `SileoPosition` | `top-right` | Default position for new toasts |
| `offset` | `number \| string \| object` | - | Distance from viewport edges |
| `options` | `Partial<SileoOptions>` | - | Global defaults merged into each toast |
| `theme` | `light \| dark \| system` | system-resolved | Controls viewport theme tokens |
| `container` | `string \| HTMLElement` | `body` | Teleport target |
| `grouping` | `boolean` | `false` | Enables toast grouping |
| `groupThreshold` | `number` | `4` | Toasts needed before grouping kicks in |
| `ariaLive` | `off \| polite \| assertive` | `polite` | Live-region mode for the viewport |

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

## Default Values

- `DEFAULT_TOAST_DURATION = 6000`
- `EXIT_DURATION = 600`
- `DEFAULT_ROUNDNESS = 16`
- `GROUP_THRESHOLD = 4`

## Return Values

- Most `sileo.*()` methods return the toast id.
- `sileo.promise()` returns the original promise so you can continue chaining or `await` it.
- `dismiss()` and `clear()` return `void`.

## Practical Notes

- Passing the same `id` replaces an existing active toast instead of stacking duplicates.
- `loading` toasts default to sticky behavior.
- `description` and `icon` can be Vue nodes, not just strings.
- `swipeToDismiss` is ignored while loading and on interactive controls.
