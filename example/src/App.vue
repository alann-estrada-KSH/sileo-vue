<script setup lang="ts">
import { Toaster, sileo } from "../../src/toast";

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
    <main class="demo">
        <section class="panel">
            <h1>Sileo local example</h1>
            <p>
                Este proyecto vive dentro del repo y consume el paquete local para validar animaciones,
                iconos y flujo de estados sin instalarlo en otro proyecto.
            </p>

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

        <Toaster position="top-right" :grouping="true" :group-threshold="2" theme="dark" :options="{
            roundness: 16,
            autopilot: { expand: 180, collapse: 3200 },
        }" />
    </main>
</template>

<style scoped>
.demo {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
}

.panel {
    width: min(760px, 95vw);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    background: rgba(15, 20, 33, 0.75);
    backdrop-filter: blur(8px);
    padding: 1.4rem;
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.3);
}

h1 {
    margin: 0 0 0.45rem;
    font-size: 1.75rem;
}

p {
    margin: 0;
    color: rgba(231, 236, 243, 0.85);
}

.actions {
    margin-top: 1.2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.7rem;
}

button {
    height: 38px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(255, 255, 255, 0.08);
    color: #e7ecf3;
    font-weight: 600;
    cursor: pointer;
}

button:hover {
    background: rgba(255, 255, 255, 0.15);
}
</style>
