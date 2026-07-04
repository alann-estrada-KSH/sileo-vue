<script setup lang="ts">
import { t } from "../i18n";
import LanguageToggle from "./LanguageToggle.vue";
import ThemeToggle from "./ThemeToggle.vue";
</script>

<template>
    <nav class="nav container">
        <router-link to="/" class="wordmark">sileo-vue</router-link>
        <div class="nav-links">
            <router-link :to="{ path: '/', hash: '#playground' }">{{ t("nav").playground }}</router-link>
            <router-link :to="{ path: '/', hash: '#features' }">{{ t("nav").features }}</router-link>
            <router-link to="/docs">{{ t("nav").docs }}</router-link>
            <a href="https://github.com/alann-estrada-KSH/sileo-vue" target="_blank" rel="noreferrer">{{ t("nav").github }}</a>
            <ThemeToggle />
            <LanguageToggle />
        </div>
    </nav>
</template>

<style scoped>
.nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem 1.5rem;
    padding-block: 1.75rem;
    position: relative;
    z-index: 2;
}

.wordmark {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    text-decoration: none;
    color: var(--paper);
}

.nav-links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.75rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--paper-dim);
    transition: color 180ms var(--ease-out-expo);
}

.nav-links a:hover {
    color: var(--paper);
}

@media (max-width: 640px) {
    .nav-links {
        gap: 1rem;
        font-size: 0.75rem;
    }
}
</style>
