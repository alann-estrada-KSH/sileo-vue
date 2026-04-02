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
    AUTOPILOT_COLLAPSE_DELAY,
    AUTOPILOT_EXPAND_DELAY,
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

type AutopilotConfig = {
    expand: number;
    collapse: number;
};

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
    autopilot: options.autopilot,
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

const normalizeAutopilot = (
    value: SileoOptions["autopilot"],
): AutopilotConfig | null => {
    if (value === false) return null;
    if (value === true || value === undefined) {
        return {
            expand: AUTOPILOT_EXPAND_DELAY,
            collapse: AUTOPILOT_COLLAPSE_DELAY,
        };
    }

    const expand = Number.isFinite(value.expand)
        ? Math.max(0, Number(value.expand))
        : AUTOPILOT_EXPAND_DELAY;
    const collapse = Number.isFinite(value.collapse)
        ? Math.max(expand + 200, Number(value.collapse))
        : AUTOPILOT_COLLAPSE_DELAY;

    return { expand, collapse };
};

const renderStateIcon = (state: SileoState) => {
    const common = {
        viewBox: "0 0 16 16",
        width: "14",
        height: "14",
        "aria-hidden": "true",
        focusable: "false",
    } as const;

    if (state === "success") {
        return h("svg", common, [
            h("path", {
                d: "M3.2 8.4L6.5 11.4L12.8 4.9",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
            }),
        ]);
    }
    if (state === "error") {
        return h("svg", common, [
            h("path", {
                d: "M5 5L11 11M11 5L5 11",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round",
            }),
        ]);
    }
    if (state === "warning") {
        return h("svg", common, [
            h("path", {
                d: "M8 3.2L13 12.5H3L8 3.2Z",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.4",
                "stroke-linejoin": "round",
            }),
            h("path", {
                d: "M8 6.2V9",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.5",
                "stroke-linecap": "round",
            }),
            h("circle", { cx: "8", cy: "11", r: "0.9", fill: "currentColor" }),
        ]);
    }
    if (state === "action") {
        return h("svg", common, [
            h("path", {
                d: "M3.5 8H12.5M9.2 4.8L12.4 8L9.2 11.2",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
            }),
        ]);
    }
    if (state === "loading") {
        return h("svg", { ...common, "data-sileo-icon": "spin" }, [
            h("circle", {
                cx: "8",
                cy: "8",
                r: "5",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.6",
                opacity: "0.35",
            }),
            h("path", {
                d: "M8 3A5 5 0 0 1 13 8",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.8",
                "stroke-linecap": "round",
            }),
        ]);
    }

    return h("svg", common, [
        h("circle", {
            cx: "8",
            cy: "8",
            r: "5.2",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.6",
        }),
        h("path", {
            d: "M8 6.8V10.2",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "1.6",
            "stroke-linecap": "round",
        }),
        h("circle", { cx: "8", cy: "4.9", r: "0.9", fill: "currentColor" }),
    ]);
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
        const expandedToasts = ref<Record<string, boolean>>({});
        const autopilotTimers = new Map<string, ReturnType<typeof setTimeout>[]>();
        const activeToastInstanceId = ref<string | undefined>(undefined);

        const setExpanded = (instanceId: string, expanded: boolean) => {
            expandedToasts.value[instanceId] = expanded;
        };

        const clearAutopilotTimers = (instanceId: string) => {
            const timers = autopilotTimers.get(instanceId);
            if (!timers) return;
            for (const timer of timers) clearTimeout(timer);
            autopilotTimers.delete(instanceId);
        };

        const scheduleAutopilot = (item: SileoItem) => {
            clearAutopilotTimers(item.instanceId);
            const config = normalizeAutopilot(item.autopilot);
            if (!item.description || !config) {
                setExpanded(item.instanceId, false);
                return;
            }

            if (
                activeToastInstanceId.value !== undefined &&
                activeToastInstanceId.value !== item.instanceId
            ) {
                setExpanded(item.instanceId, false);
                return;
            }

            setExpanded(item.instanceId, false);
            const timers: ReturnType<typeof setTimeout>[] = [];

            timers.push(
                globalThis.setTimeout(() => {
                    setExpanded(item.instanceId, true);
                }, config.expand),
            );

            const duration = item.duration ?? DEFAULT_TOAST_DURATION;
            if (item.duration !== null) {
                const maxCollapse = Math.max(
                    config.expand + 350,
                    duration - EXIT_DURATION - 150,
                );
                const collapseAt = Math.min(config.collapse, maxCollapse);
                if (collapseAt > config.expand) {
                    timers.push(
                        globalThis.setTimeout(() => {
                            setExpanded(item.instanceId, false);
                        }, collapseAt),
                    );
                }
            } else if (config.collapse > config.expand) {
                timers.push(
                    globalThis.setTimeout(() => {
                        setExpanded(item.instanceId, false);
                    }, config.collapse),
                );
            }

            autopilotTimers.set(item.instanceId, timers);
        };

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
            for (const instanceId of autopilotTimers.keys()) {
                clearAutopilotTimers(instanceId);
            }
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

        watch(
            () => toasts.value,
            (items) => {
                const active = new Set(items.map((item) => item.instanceId));
                const latest = [...items]
                    .filter((item) => !item.exiting)
                    .sort((a, b) => b.createdAt - a.createdAt)[0];

                activeToastInstanceId.value = latest?.instanceId;

                for (const item of items) {
                    if (expandedToasts.value[item.instanceId] === undefined) {
                        setExpanded(item.instanceId, false);
                    }
                }

                for (const item of items) {
                    scheduleAutopilot(item);
                }

                for (const instanceId of Object.keys(expandedToasts.value)) {
                    if (!active.has(instanceId)) {
                        clearAutopilotTimers(instanceId);
                        delete expandedToasts.value[instanceId];
                    }
                }
            },
            { immediate: true },
        );

        watch(
            () => activeToastInstanceId.value,
            (activeInstanceId) => {
                for (const instanceId of Object.keys(expandedToasts.value)) {
                    if (instanceId !== activeInstanceId) {
                        setExpanded(instanceId, false);
                    }
                }

                if (!activeInstanceId) return;
                const item = toasts.value.find((toast) => toast.instanceId === activeInstanceId);
                if (item) {
                    scheduleAutopilot(item);
                }
            },
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
            const isExpanded = Boolean(expandedToasts.value[item.instanceId]);
            const contentVisible = isExpanded && item.state !== "loading";
            return h(
                "article",
                {
                    key: item.instanceId,
                    "data-sileo-toast": "true",
                    "data-state": item.state,
                    "data-exiting": item.exiting ? "true" : "false",
                    "data-expanded": isExpanded ? "true" : "false",
                    class: ["sileo-toast", item.styles?.toast],
                    style: {
                        "--sileo-fill": item.fill,
                        "--sileo-roundness": roundness,
                    } as CSSProperties,
                    onMouseenter: () => {
                        activeToastInstanceId.value = item.instanceId;
                        setExpanded(item.instanceId, true);
                    },
                    onMouseleave: () => {
                        const autopilot = normalizeAutopilot(item.autopilot);
                        const latest = [...toasts.value]
                            .filter((toast) => !toast.exiting)
                            .sort((a, b) => b.createdAt - a.createdAt)[0];
                        activeToastInstanceId.value = latest?.instanceId;
                        if (autopilot !== null) setExpanded(item.instanceId, false);
                    },
                },
                [
                    h("div", { class: "sileo-head" }, [
                        h(
                            "span",
                            {
                                class: ["sileo-badge", item.styles?.badge],
                                "data-sileo-badge": "true",
                            },
                            item.icon ?? renderStateIcon(item.state),
                        ),
                        h(
                            "p",
                            {
                                class: ["sileo-title", item.styles?.title],
                                "data-sileo-title": "true",
                            },
                            item.title,
                        ),
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
                    item.description || item.button
                        ? h(
                            "div",
                            {
                                class: "sileo-content",
                                "data-sileo-content": "true",
                                "data-visible": contentVisible ? "true" : "false",
                            },
                            [
                                item.description
                                    ? h(
                                        "div",
                                        {
                                            class: ["sileo-description", item.styles?.description],
                                            "data-sileo-description": "true",
                                        },
                                        [item.description],
                                    )
                                    : null,
                                item.button
                                    ? h(
                                        "button",
                                        {
                                            type: "button",
                                            class: ["sileo-action", item.styles?.button],
                                            "data-sileo-button": "true",
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
