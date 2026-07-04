<script setup lang="ts">
import { pageTheme, setPageTheme } from "../theme";
</script>

<template>
    <button
        type="button"
        class="theme-toggle"
        :aria-label="pageTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="setPageTheme(pageTheme === 'dark' ? 'light' : 'dark')"
    >
        <span v-if="pageTheme === 'dark'" aria-hidden="true">☀</span>
        <span v-else aria-hidden="true">☾</span>
    </button>
</template>

<style scoped>
.theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--paper-dim);
    font-size: 0.9rem;
    line-height: 1;
    cursor: pointer;
    transition: border-color 160ms var(--ease-out-expo), color 160ms var(--ease-out-expo), background 160ms var(--ease-out-expo);
}

.theme-toggle:hover {
    border-color: var(--accent);
    color: var(--paper);
    background: var(--accent-soft);
}
</style>
