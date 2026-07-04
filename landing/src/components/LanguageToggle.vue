<script setup lang="ts">
import { locale, setLocale } from "../i18n";
</script>

<template>
    <div class="lang-toggle" role="group" aria-label="Language">
        <button
            type="button"
            class="lang-btn"
            :class="{ active: locale === 'en' }"
            :aria-pressed="locale === 'en'"
            @click="setLocale('en')"
        >EN</button>
        <button
            type="button"
            class="lang-btn"
            :class="{ active: locale === 'es' }"
            :aria-pressed="locale === 'es'"
            @click="setLocale('es')"
        >ES</button>
    </div>
</template>

<style scoped>
.lang-toggle {
    display: inline-flex;
    gap: 0.25rem;
    padding: 0.2rem;
    border-radius: 999px;
    border: 1px solid var(--line);
}

.lang-btn {
    padding: 0.25rem 0.6rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--paper-faint);
    font-family: var(--font-mono);
    font-size: 0.74rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 160ms var(--ease-out-expo), color 160ms var(--ease-out-expo);
}

.lang-btn.active {
    background: var(--accent-soft);
    color: var(--paper);
}
</style>
