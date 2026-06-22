<script setup lang="ts">
import { ref } from "vue";
import { Toaster, sileo } from "../../src/toast";
import type { SileoPosition } from "../../src/types";

const theme = ref<"dark" | "light">("dark");
const position = ref<SileoPosition>("top-right");

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
                <h1>Sileo</h1>
                <button
                    type="button"
                    class="theme-toggle"
                    @click="theme = theme === 'dark' ? 'light' : 'dark'"
                >
                    <span v-if="theme === 'dark'">☀ light</span>
                    <span v-else>☽ dark</span>
                </button>
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
        </section>

        <Toaster
            :position="position"
            :grouping="true"
            :group-threshold="2"
            :theme="theme"
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
}

.panel {
    width: min(760px, 95vw);
    border-radius: 24px;
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.demo[data-theme="dark"] .panel {
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

.demo[data-theme="dark"] button {
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.08);
    color: #e7ecf3;
}

.demo[data-theme="dark"] button:hover {
    background: rgba(255, 255, 255, 0.15);
}

.demo[data-theme="dark"] .pos-btn.active {
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

.theme-toggle {
    height: 32px;
    padding: 0 14px;
    font-size: 13px;
}
</style>
