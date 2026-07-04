<script setup lang="ts">
import { t } from "../i18n";

const year = new Date().getFullYear();
</script>

<template>
    <footer class="footer">
        <div v-reveal class="footer-inner container">
            <div class="footer-top">
                <span class="wordmark">sileo-vue</span>
                <div class="footer-links">
                    <a href="https://github.com/alann-estrada-KSH/sileo-vue" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://www.npmjs.com/package/@alann-estrada-ksh/sileo-vue" target="_blank" rel="noreferrer">npm</a>
                    <router-link to="/docs">{{ t("footer").docs }}</router-link>
                </div>
                <span class="meta">{{ t("footer").meta }} &middot; {{ year }}</span>
            </div>
            <p class="credit">
                {{ t("footer").credit }}
                <a href="https://github.com/hiaaryan/sileo" target="_blank" rel="noreferrer">github.com/hiaaryan/sileo</a>
            </p>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid var(--line);
    padding-block: 2.5rem;
}

.footer-inner {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.footer-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.credit {
    max-width: 60ch;
    font-size: 0.8rem;
    color: var(--paper-faint);
}

.credit a {
    color: var(--paper-dim);
    text-decoration: underline;
    text-underline-offset: 2px;
}

.credit a:hover {
    color: var(--accent);
}

.wordmark {
    font-family: var(--font-display);
    font-size: 1.1rem;
}

.footer-links {
    display: flex;
    gap: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.82rem;
}

.footer-links a {
    text-decoration: none;
    color: var(--paper-dim);
    transition: color 180ms var(--ease-out-expo);
}

.footer-links a:hover {
    color: var(--accent);
}

.meta {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    color: var(--paper-faint);
}
</style>
