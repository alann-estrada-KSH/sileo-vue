import {
    Teleport,
    computed,
    defineComponent,
    h,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type CSSProperties,
    type PropType,
} from "vue";
import {
    DEFAULT_ROUNDNESS,
    DEFAULT_TOAST_DURATION,
    EXIT_DURATION,
    GROUP_THRESHOLD,
} from "./constants";
import type {
    SileoOffsetConfig,
    SileoOffsetValue,
    SileoOptions,
    SileoPosition,
    SileoState,
} from "./types";

interface SileoItem extends Omit<SileoOptions, "type"> {
    id: string;
    instanceId: string;
    state: SileoState;
    createdAt: number;
    exiting?: boolean;
}

type Listener = (toasts: SileoItem[]) => void;

const store = {
    toasts: [] as SileoItem[],
    listeners: new Set<Listener>(),
    position: "top-right" as SileoPosition,
    options: undefined as Partial<SileoOptions> | undefined,

    emit() {
        for (const listener of this.listeners) listener(this.toasts);
    },

    update(updater: (prev: SileoItem[]) => SileoItem[]) {
        this.toasts = updater(this.toasts);
        this.emit();
    },
};

const dismissalTimers = new Map<string, ReturnType<typeof setTimeout>>();
let sequence = 0;

const nextId = () => `sileo-${++sequence}-${Date.now().toString(36)}`;
const nextInstanceId = () => `instance-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;

const clearTimer = (instanceId: string) => {
    const timer = dismissalTimers.get(instanceId);
    if (timer !== undefined) {
        clearTimeout(timer);
        dismissalTimers.delete(instanceId);
    }
};

const removeByInstance = (instanceId: string) => {
    clearTimer(instanceId);
    store.update((prev) => prev.filter((item) => item.instanceId !== instanceId));
};

const dismissByInstance = (instanceId: string) => {
    const target = store.toasts.find(
        (item) => item.instanceId === instanceId && !item.exiting,
    );
    if (!target) return;

    clearTimer(instanceId);
    store.update((prev) =>
        prev.map((item) =>
            item.instanceId === instanceId ? { ...item, exiting: true } : item,
        ),
    );

    globalThis.setTimeout(() => {
        removeByInstance(instanceId);
    }, EXIT_DURATION);
};

const scheduleDismiss = (item: SileoItem) => {
    clearTimer(item.instanceId);
    if (item.duration === null) return;
    const duration = item.duration ?? DEFAULT_TOAST_DURATION;
    if (duration <= 0) return;

    const timer = globalThis.setTimeout(() => {
        dismissByInstance(item.instanceId);
    }, duration);

    dismissalTimers.set(item.instanceId, timer);
};

const mergeOptions = (options: SileoOptions): SileoOptions => ({
    ...store.options,
    ...options,
    styles: { ...store.options?.styles, ...options.styles },
});

const buildItem = (options: SileoOptions, state: SileoState): SileoItem => ({
    id: options.id ?? nextId(),
    instanceId: nextInstanceId(),
    state,
    title: options.title,
    description: options.description,
    position: options.position ?? store.position,
    duration: options.duration,
    icon: options.icon,
    styles: options.styles,
    fill: options.fill,
    roundness: options.roundness,
    button: options.button,
    groupKey: options.groupKey,
    createdAt: Date.now(),
});

const createToast = (raw: SileoOptions, forcedState?: SileoState) => {
    const merged = mergeOptions(raw);
    const state = forcedState ?? merged.type ?? "info";
    const hasCustomId = Boolean(merged.id);

    if (hasCustomId) {
        const existing = store.toasts.find(
            (item) => item.id === merged.id && !item.exiting,
        );
        if (existing) {
            const replacement = buildItem(merged, state);
            replacement.id = existing.id;
            store.update((prev) =>
                prev.map((item) =>
                    item.instanceId === existing.instanceId ? replacement : item,
                ),
            );
            clearTimer(existing.instanceId);
            scheduleDismiss(replacement);
            return existing.id;
        }
    }

    const item = buildItem(merged, state);
    store.update((prev) => [...prev, item]);
    scheduleDismiss(item);
    return item.id;
};

const dismissToast = (id?: string) => {
    if (!id) {
        for (const item of store.toasts) dismissByInstance(item.instanceId);
        return;
    }

    const active = store.toasts
        .filter((item) => item.id === id && !item.exiting)
        .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!active) return;
    dismissByInstance(active.instanceId);
};

const clearToasts = (position?: SileoPosition) => {
    const removed = position
        ? store.toasts.filter((item) => item.position === position)
        : [...store.toasts];

    for (const item of removed) clearTimer(item.instanceId);

    store.update((prev) =>
        position ? prev.filter((item) => item.position !== position) : [],
    );
};

const resolveTheme = (theme: "light" | "dark" | "system" | undefined) => {
    if (theme === "light" || theme === "dark") return theme;
    if (typeof window === "undefined") return "light";
    if (typeof window.matchMedia !== "function") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

const getOffsetStyle = (
    position: SileoPosition,
    offset?: SileoOffsetValue | SileoOffsetConfig,
): CSSProperties | undefined => {
    if (offset === undefined) return undefined;

    const value =
        typeof offset === "object"
            ? offset
            : { top: offset, right: offset, bottom: offset, left: offset };

    const style: CSSProperties = {};
    const px = (v: SileoOffsetValue) => (typeof v === "number" ? `${v}px` : v);

    if (position.startsWith("top") && value.top !== undefined) style.top = px(value.top);
    if (position.startsWith("bottom") && value.bottom !== undefined) {
        style.bottom = px(value.bottom);
    }
    if (position.endsWith("left") && value.left !== undefined) style.left = px(value.left);
    if (position.endsWith("right") && value.right !== undefined) {
        style.right = px(value.right);
    }

    return style;
};

export interface SileoPromiseOptions<T = unknown> {
    loading: SileoOptions;
    success: SileoOptions | ((data: T) => SileoOptions);
    error: SileoOptions | ((error: unknown) => SileoOptions);
    action?: SileoOptions | ((data: T) => SileoOptions);
    position?: SileoPosition;
}

export interface SileoToasterProps {
    position?: SileoPosition;
    offset?: SileoOffsetValue | SileoOffsetConfig;
    options?: Partial<SileoOptions>;
    theme?: "light" | "dark" | "system";
    container?: string | HTMLElement;
    grouping?: boolean;
    groupThreshold?: number;
}

export const sileo = {
    show: (opts: SileoOptions) => createToast(opts, opts.type ?? "info"),
    success: (opts: SileoOptions) => createToast(opts, "success"),
    error: (opts: SileoOptions) => createToast(opts, "error"),
    warning: (opts: SileoOptions) => createToast(opts, "warning"),
    info: (opts: SileoOptions) => createToast(opts, "info"),
    action: (opts: SileoOptions) => createToast(opts, "action"),
    loading: (opts: SileoOptions) =>
        createToast({ ...opts, duration: opts.duration ?? null }, "loading"),

    promise: async <T,>(
        promise: Promise<T> | (() => Promise<T>),
        opts: SileoPromiseOptions<T>,
    ): Promise<T> => {
        const id = createToast(
            { ...opts.loading, duration: null, position: opts.position },
            "loading",
        );
        try {
            const data = await (typeof promise === "function" ? promise() : promise);
            const next = opts.action
                ? typeof opts.action === "function"
                    ? opts.action(data)
                    : opts.action
                : typeof opts.success === "function"
                    ? opts.success(data)
                    : opts.success;
            createToast({ ...next, id }, opts.action ? "action" : "success");
            return data;
        } catch (error) {
            const next =
                typeof opts.error === "function" ? opts.error(error) : opts.error;
            createToast({ ...next, id }, "error");
            throw error;
        }
    },

    configure: (options: Partial<SileoOptions> & { position?: SileoPosition }) => {
        if (options.position) {
            store.position = options.position;
        }
        store.options = {
            ...store.options,
            ...options,
            styles: { ...store.options?.styles, ...options.styles },
        };
    },

    dismiss: dismissToast,
    clear: clearToasts,
};

export const Toaster = defineComponent({
    name: "SileoToaster",
    props: {
        position: String as PropType<SileoPosition | undefined>,
        offset: [Number, String, Object] as PropType<
            SileoOffsetValue | SileoOffsetConfig
        >,
        options: Object as PropType<Partial<SileoOptions>>,
        theme: String as PropType<"light" | "dark" | "system">,
        container: [String, Object] as PropType<string | HTMLElement>,
        grouping: { type: Boolean, default: false },
        groupThreshold: { type: Number, default: GROUP_THRESHOLD },
    },
    setup(props, { slots }) {
        const toasts = ref<SileoItem[]>(store.toasts);
        const expandedGroups = ref<Record<string, boolean>>({});

        const listener: Listener = (next) => {
            toasts.value = next;
        };

        onMounted(() => {
            store.listeners.add(listener);
            if (props.position) store.position = props.position;
            if (props.options) {
                store.options = {
                    ...store.options,
                    ...props.options,
                    styles: { ...store.options?.styles, ...props.options.styles },
                };
            }
        });

        onBeforeUnmount(() => {
            store.listeners.delete(listener);
        });

        watch(
            () => props.position,
            (value) => {
                if (value) store.position = value;
            },
        );

        watch(
            () => props.options,
            (value) => {
                if (!value) return;
                store.options = {
                    ...store.options,
                    ...value,
                    styles: { ...store.options?.styles, ...value.styles },
                };
            },
            { deep: true },
        );

        const groupedByPosition = computed(() => {
            const map = new Map<SileoPosition, SileoItem[]>();
            for (const item of toasts.value) {
                const pos = item.position ?? store.position;
                const list = map.get(pos);
                if (list) {
                    list.push(item);
                } else {
                    map.set(pos, [item]);
                }
            }
            return map;
        });

        const renderToast = (item: SileoItem) => {
            const roundness = `${Math.max(0, item.roundness ?? DEFAULT_ROUNDNESS)}px`;
            return h(
                "article",
                {
                    key: item.instanceId,
                    "data-sileo-toast": "true",
                    "data-state": item.state,
                    "data-exiting": item.exiting ? "true" : "false",
                    class: ["sileo-toast", item.styles?.toast],
                    style: {
                        "--sileo-fill": item.fill,
                        "--sileo-roundness": roundness,
                    } as CSSProperties,
                },
                [
                    h("div", { class: "sileo-head" }, [
                        h(
                            "span",
                            { class: ["sileo-badge", item.styles?.badge] },
                            item.icon ?? item.state,
                        ),
                        h("p", { class: ["sileo-title", item.styles?.title] }, item.title),
                        h(
                            "button",
                            {
                                type: "button",
                                class: "sileo-dismiss",
                                onClick: () => dismissByInstance(item.instanceId),
                                "aria-label": "Dismiss toast",
                            },
                            "x",
                        ),
                    ]),
                    item.description
                        ? h(
                            "div",
                            { class: ["sileo-description", item.styles?.description] },
                            [item.description],
                        )
                        : null,
                    item.button
                        ? h(
                            "button",
                            {
                                type: "button",
                                class: ["sileo-action", item.styles?.button],
                                onClick: (e: MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    item.button?.onClick?.();
                                },
                            },
                            item.button.title,
                        )
                        : null,
                ],
            );
        };

        const renderPosition = (position: SileoPosition, items: SileoItem[]) => {
            const buckets = new Map<string, SileoItem[]>();
            for (const item of items) {
                const key = item.groupKey ?? "__default__";
                const list = buckets.get(key);
                if (list) {
                    list.push(item);
                } else {
                    buckets.set(key, [item]);
                }
            }

            const children: ReturnType<typeof h>[] = [];
            for (const [bucketKey, bucketItems] of buckets) {
                const visible = bucketItems.filter((item) => !item.exiting);
                const expandKey = `${position}:${bucketKey}`;
                const shouldGroup =
                    props.grouping &&
                    visible.length > props.groupThreshold &&
                    !expandedGroups.value[expandKey];

                if (shouldGroup) {
                    const label =
                        bucketKey === "__default__"
                            ? `${visible.length} notifications`
                            : `${visible.length} ${bucketKey} notifications`;
                    children.push(
                        h(
                            "button",
                            {
                                key: expandKey,
                                type: "button",
                                "data-sileo-group": "true",
                                class: "sileo-group",
                                onMouseenter: () => {
                                    expandedGroups.value[expandKey] = true;
                                },
                                onClick: () => {
                                    expandedGroups.value[expandKey] = true;
                                },
                            },
                            label,
                        ),
                    );
                    continue;
                }

                for (const item of bucketItems) {
                    children.push(renderToast(item));
                }
            }

            return h(
                "section",
                {
                    key: position,
                    "data-sileo-viewport": "true",
                    "data-position": position,
                    "data-theme": resolveTheme(props.theme),
                    style: getOffsetStyle(position, props.offset),
                },
                children,
            );
        };

        return () => {
            const viewports = Array.from(groupedByPosition.value.entries()).map(
                ([position, items]) => renderPosition(position, items),
            );

            const portalTarget = props.container ?? "body";

            return h("div", { class: "sileo-root" }, [
                slots.default?.(),
                h(Teleport, { to: portalTarget }, viewports),
            ]);
        };
    },
});
