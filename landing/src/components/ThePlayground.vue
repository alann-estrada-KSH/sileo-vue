<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Toaster, sileo } from "@alann-estrada-ksh/sileo-vue";
import { t } from "../i18n";
import { pageTheme } from "../theme";

// Toasts are compatible with both light and dark themes independently of the
// page chrome, but starting from whichever the page is currently in reads as
// more intentional than always defaulting to dark.
const demoTheme = ref<"dark" | "light" | "colored">(pageTheme.value);

// The site nav is `position: relative` (scrolls away with the page), while
// the toast viewport is always `position: fixed`. A static top offset large
// enough to clear the nav at scrollY 0 looks needlessly low once the nav has
// scrolled out of view. Shrink the offset as the page scrolls so it only
// clears the nav while the nav is actually on screen.
const NAV_CLEARANCE = 104;
const DEFAULT_OFFSET = 12;
const scrollY = ref(typeof window === "undefined" ? 0 : window.scrollY);
const onScroll = () => {
    scrollY.value = window.scrollY;
};
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
const toasterOffset = computed(() => ({
    top: Math.max(DEFAULT_OFFSET, NAV_CLEARANCE - scrollY.value),
}));

const fireSuccess = () => {
    const m = t("playground").toasts;
    sileo.success({ title: m.successTitle, description: m.successDesc });
};

const fireError = () => {
    const m = t("playground").toasts;
    sileo.error({ title: m.errorTitle, description: m.errorDesc });
};

const fireWarning = () => {
    const m = t("playground").toasts;
    sileo.warning({ title: m.warningTitle, description: m.warningDesc });
};

const fireInfo = () => {
    const m = t("playground").toasts;
    sileo.info({ title: m.infoTitle, description: m.infoDesc });
};

const fireAction = () => {
    const m = t("playground").toasts;
    sileo.action({
        title: m.actionTitle,
        description: m.actionDesc,
        button: { title: m.actionButton, onClick: () => sileo.success({ title: m.actionOpenedTitle }) },
    });
};

const firePromise = () => {
    const m = t("playground").toasts;
    sileo.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: { title: m.promiseLoadingTitle, description: m.promiseLoadingDesc },
        success: () => ({ title: m.promiseSuccessTitle, description: m.promiseSuccessDesc }),
        error: { title: m.promiseErrorTitle },
    });
};

const fireGroup = () => {
    const m = t("playground").toasts;
    for (const title of m.groupTitles) {
        sileo.info({ title, groupKey: "uploads" });
    }
};

const fireCustom = () => {
    const m = t("playground").toasts;
    sileo.show({ type: "action", title: m.customTitle, description: m.customDesc, fill: "#1b1030" });
};

const actions = computed(() => [
    { label: t("playground").btnSuccess, run: fireSuccess },
    { label: t("playground").btnError, run: fireError },
    { label: t("playground").btnWarning, run: fireWarning },
    { label: t("playground").btnInfo, run: fireInfo },
    { label: t("playground").btnAction, run: fireAction },
    { label: t("playground").btnPromise, run: firePromise },
    { label: t("playground").btnGroup, run: fireGroup },
    { label: t("playground").btnCustom, run: fireCustom },
]);
</script>

<template>
    <section id="playground" class="playground container">
        <p v-reveal class="eyebrow">{{ t("playground").eyebrow }}</p>
        <h2 v-reveal="60" class="section-title">{{ t("playground").title }}</h2>
        <p v-reveal="120" class="section-lede">{{ t("playground").lede }}</p>

        <div v-reveal="180" class="theme-row">
            <button
                type="button"
                class="theme-pill"
                :class="{ active: demoTheme === 'dark' }"
                @click="demoTheme = 'dark'"
            >{{ t("playground").themeDark }}</button>
            <button
                type="button"
                class="theme-pill"
                :class="{ active: demoTheme === 'light' }"
                @click="demoTheme = 'light'"
            >{{ t("playground").themeLight }}</button>
            <button
                type="button"
                class="theme-pill"
                :class="{ active: demoTheme === 'colored' }"
                @click="demoTheme = 'colored'"
            >{{ t("playground").themeColored }}</button>
        </div>

        <div v-reveal="240" class="playground-grid">
            <div class="button-rail">
                <button
                    v-for="action in actions"
                    :key="action.label"
                    type="button"
                    class="fire-btn"
                    @click="action.run"
                >
                    {{ action.label }}
                </button>
                <button type="button" class="fire-btn ghost" @click="() => sileo.clear()">
                    {{ t("playground").btnClear }}
                </button>
            </div>

            <pre class="code-panel"><code>import { sileo } from "@alann-estrada-ksh/sileo-vue";

sileo.success({
  title: "Deploy complete",
  description: "All containers are healthy.",
});

sileo.promise(deploy(), {
  loading: { title: "Deploying" },
  success: () =&gt; ({ title: "Deployed" }),
  error: (e) =&gt; ({ title: "Failed", description: String(e) }),
});</code></pre>
        </div>

        <Toaster
            position="top-right"
            :theme="demoTheme"
            :grouping="true"
            :group-threshold="3"
            :offset="toasterOffset"
            :options="{ autopilot: { expand: 180, collapse: 3200 } }"
        />
    </section>
</template>

<style scoped>
.playground {
    padding-block: 6rem;
}

.section-title {
    margin-top: 0.6rem;
    font-size: clamp(2rem, 4.4vw, 2.85rem);
}

.section-lede {
    margin-top: 1rem;
    max-width: 56ch;
    color: var(--paper-dim);
    font-size: 1.05rem;
}

.theme-row {
    margin-top: 1.75rem;
    display: inline-flex;
    gap: 0.4rem;
    padding: 0.25rem;
    border-radius: 999px;
    border: 1px solid var(--line);
}

.theme-pill {
    height: 32px;
    padding: 0 1rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--paper-faint);
    font-family: var(--font-mono);
    font-size: 0.78rem;
    cursor: pointer;
    transition: background 160ms var(--ease-out-expo), color 160ms var(--ease-out-expo);
}

.theme-pill.active {
    background: var(--accent-soft);
    color: var(--paper);
}

.playground-grid {
    margin-top: 2.75rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    gap: 1.5rem;
    align-items: stretch;
}

.button-rail {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 0.6rem;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line);
    background: var(--ink-1);
}

.fire-btn {
    height: 40px;
    padding: 0 1.1rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--ink-2);
    color: var(--paper);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    cursor: pointer;
    transition: border-color 160ms var(--ease-out-expo), transform 160ms var(--ease-out-expo);
}

.fire-btn:hover {
    border-color: var(--accent);
    transform: translateY(-1px);
}

.fire-btn.ghost {
    background: transparent;
    color: var(--paper-faint);
}

.code-panel {
    margin: 0;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line);
    background: var(--ink-0);
    overflow-x: auto;
    font-size: 0.82rem;
    line-height: 1.65;
    color: var(--paper-dim);
}

.code-panel code {
    color: inherit;
}

@media (max-width: 800px) {
    .playground-grid {
        grid-template-columns: 1fr;
    }
}
</style>
