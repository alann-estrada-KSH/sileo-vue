<script setup lang="ts">
import { computed, ref } from "vue";
import { Toaster, sileo } from "../../src/toast";
import type { SileoColors, SileoPosition } from "../../src/types";

const theme = ref<"dark" | "light" | "custom" | "colored">("dark");
const position = ref<SileoPosition>("top-right");

const themes: Array<"dark" | "light" | "custom" | "colored"> = ["dark", "light", "custom", "colored"];

const customColors = ref<Required<SileoColors>>({
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
});

const customColorFields: Array<{ key: keyof SileoColors; label: string }> = [
    { key: "background", label: "Background" },
    { key: "foreground", label: "Title text" },
    { key: "description", label: "Description" },
    { key: "dismissBackground", label: "Dismiss pill" },
    { key: "success", label: "Success" },
    { key: "error", label: "Error" },
    { key: "warning", label: "Warning" },
    { key: "info", label: "Info" },
    { key: "action", label: "Action" },
    { key: "loading", label: "Loading" },
];

const toasterColors = computed(() => (theme.value === "custom" ? customColors.value : undefined));

const positions: SileoPosition[] = [
    "top-left", "top-center", "top-right",
    "bottom-left", "bottom-center", "bottom-right",
];

const fireSuccess = () => {
    sileo.success({
        title: "Deploy complete",
        description: "All containers are healthy.",
    });
};

const fireError = () => {
    sileo.error({
        title: "Sync failed",
        description: "Retrying in 30 seconds.",
    });
};

const fireWarning = () => {
    sileo.warning({
        title: "Quota almost full",
        description: "You are at 92% of your plan.",
    });
};

const fireInfo = () => {
    sileo.info({
        title: "Nightly backup",
        description: "Completed 3 minutes ago.",
    });
};

const fireAction = () => {
    sileo.action({
        title: "New order received",
        description: "Open order #948 to continue.",
        button: {
            title: "Open",
            onClick: () => {
                sileo.success({ title: "Order opened" });
            },
        },
    });
};

const fireLoadingPromise = async () => {
    await sileo.promise(
        new Promise<{ id: string }>((resolve) => {
            setTimeout(() => resolve({ id: "INV-1290" }), 1600);
        }),
        {
            loading: {
                title: "Creating invoice",
                description: "Preparing PDF and metadata...",
            },
            success: (data: { id: string }) => ({
                title: "Invoice created",
                description: `Reference ${data.id}`,
            }),
            error: {
                title: "Could not create invoice",
            },
            action: (data: { id: string }) => ({
                title: "Invoice ready",
                description: `Reference ${data.id}`,
                button: {
                    title: "Copy ID",
                    onClick: () => navigator.clipboard.writeText(data.id),
                },
            }),
        },
    );
};

const fireGrouped = () => {
    sileo.info({ title: "Upload A", groupKey: "uploads" });
    sileo.info({ title: "Upload B", groupKey: "uploads" });
    sileo.info({ title: "Upload C", groupKey: "uploads" });
    sileo.info({ title: "Billing event", groupKey: "billing" });
};
</script>

<template>
    <main class="demo" :data-theme="theme">
        <section class="panel">
            <div class="panel-header">
                <h1>sileo-vue</h1>
                <div class="theme-switch">
                    <button
                        v-for="t in themes"
                        :key="t"
                        type="button"
                        class="theme-btn"
                        :class="{ active: theme === t }"
                        @click="theme = t"
                    >
                        <span v-if="t === 'dark'">☽ dark</span>
                        <span v-else-if="t === 'light'">☀ light</span>
                        <span v-else-if="t === 'colored'">🌈 colored</span>
                        <span v-else>🎨 custom</span>
                    </button>
                </div>
            </div>

            <div class="config-row">
                <span class="config-label">Position</span>
                <div class="position-grid">
                    <button
                        v-for="p in positions"
                        :key="p"
                        type="button"
                        class="pos-btn"
                        :class="{ active: position === p }"
                        @click="position = p; sileo.clear()"
                    >{{ p }}</button>
                </div>
            </div>

            <div class="actions">
                <button type="button" @click="fireSuccess">success</button>
                <button type="button" @click="fireError">error</button>
                <button type="button" @click="fireWarning">warning</button>
                <button type="button" @click="fireInfo">info</button>
                <button type="button" @click="fireAction">action</button>
                <button type="button" @click="fireLoadingPromise">promise</button>
                <button type="button" @click="fireGrouped">grouping</button>
                <button type="button" @click="() => sileo.clear()">clear all</button>
            </div>

            <div v-if="theme === 'custom'" class="config-row custom-colors">
                <span class="config-label">Custom colors</span>
                <div class="color-grid">
                    <label v-for="field in customColorFields" :key="field.key" class="color-field">
                        <input
                            type="color"
                            :value="customColors[field.key]"
                            @input="customColors[field.key] = ($event.target as HTMLInputElement).value"
                        />
                        <span>{{ field.label }}</span>
                    </label>
                </div>
            </div>
        </section>

        <Toaster
            :position="position"
            :grouping="true"
            :group-threshold="2"
            :theme="theme"
            :colors="toasterColors"
            :options="{
                roundness: 16,
                autopilot: { expand: 180, collapse: 3200 },
            }"
        />
    </main>
</template>

<style scoped>
.demo {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    transition: background 300ms ease;
    background: radial-gradient(circle at 20% 20%, #1f2940 0%, #0f1421 45%, #090d16 100%);
}

.demo[data-theme="light"] {
    background: radial-gradient(circle at 20% 20%, #e8edf5 0%, #d6dde9 45%, #c8d1e0 100%);
}

.demo[data-theme="custom"] {
    background: radial-gradient(circle at 20% 20%, #2a1b4a 0%, #170f28 45%, #0b0715 100%);
}

.panel {
    width: min(760px, 95vw);
    border-radius: 24px;
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.demo[data-theme="dark"] .panel,
.demo[data-theme="colored"] .panel {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(15, 20, 33, 0.75);
    backdrop-filter: blur(8px);
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.3);
}

.demo[data-theme="light"] .panel {
    border: 1px solid rgba(0, 0, 0, 0.09);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.10);
}

.demo[data-theme="custom"] .panel {
    border: 1px solid rgba(199, 146, 255, 0.22);
    background: rgba(27, 16, 48, 0.75);
    backdrop-filter: blur(8px);
    box-shadow: 0 18px 60px rgba(90, 30, 140, 0.35);
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

h1 {
    margin: 0;
    font-size: 1.75rem;
}

.demo[data-theme="light"] h1 {
    color: #0f1117;
}

.demo[data-theme="custom"] h1 {
    color: #f4e9ff;
}

.config-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.config-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    opacity: 0.5;
    white-space: nowrap;
}

.position-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    flex: 1;
}

.actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.6rem;
}

button {
    height: 36px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
}

.demo[data-theme="dark"] button,
.demo[data-theme="colored"] button {
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.08);
    color: #e7ecf3;
}

.demo[data-theme="dark"] button:hover,
.demo[data-theme="colored"] button:hover {
    background: rgba(255, 255, 255, 0.15);
}

.demo[data-theme="dark"] .pos-btn.active,
.demo[data-theme="colored"] .pos-btn.active {
    border-color: rgba(255, 255, 255, 0.55);
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
}

.demo[data-theme="light"] button {
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 0, 0, 0.05);
    color: #0f1117;
}

.demo[data-theme="light"] button:hover {
    background: rgba(0, 0, 0, 0.10);
}

.demo[data-theme="light"] .pos-btn.active {
    border-color: rgba(0, 0, 0, 0.40);
    background: rgba(0, 0, 0, 0.12);
}

.demo[data-theme="custom"] button {
    border: 1px solid rgba(199, 146, 255, 0.28);
    background: rgba(199, 146, 255, 0.1);
    color: #f4e9ff;
}

.demo[data-theme="custom"] button:hover {
    background: rgba(199, 146, 255, 0.2);
}

.demo[data-theme="custom"] .pos-btn.active {
    border-color: #c792ff;
    background: rgba(199, 146, 255, 0.32);
    color: #fff;
}

.theme-switch {
    display: flex;
    gap: 0.4rem;
}

.theme-btn {
    height: 32px;
    padding: 0 12px;
    font-size: 12.5px;
    opacity: 0.6;
}

.theme-btn.active {
    opacity: 1;
}

.demo[data-theme="dark"] .theme-btn.active,
.demo[data-theme="colored"] .theme-btn.active {
    border-color: rgba(255, 255, 255, 0.55);
    background: rgba(255, 255, 255, 0.18);
}

.demo[data-theme="light"] .theme-btn.active {
    border-color: rgba(0, 0, 0, 0.4);
    background: rgba(0, 0, 0, 0.12);
}

.demo[data-theme="custom"] .theme-btn.active {
    border-color: #c792ff;
    background: rgba(199, 146, 255, 0.32);
}

.custom-colors {
    align-items: flex-start;
    padding-top: 0.2rem;
    border-top: 1px dashed rgba(199, 146, 255, 0.25);
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    gap: 0.6rem;
    flex: 1;
}

.color-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.4rem;
    border-radius: 14px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-align: center;
    cursor: pointer;
    border: 1px solid rgba(199, 146, 255, 0.18);
    background: rgba(199, 146, 255, 0.06);
    color: #e5d6ff;
}

.color-field input[type="color"] {
    -webkit-appearance: none;
    appearance: none;
    width: 32px;
    height: 32px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-radius: 9999px;
    padding: 0;
    background: none;
    cursor: pointer;
}

.color-field input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 9999px;
}

.color-field input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 9999px;
}

.color-field input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: 9999px;
}
</style>
