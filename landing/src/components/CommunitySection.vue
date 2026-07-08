<script setup lang="ts">
import { t } from "../i18n";
</script>

<template>
    <section id="community" class="community container">
        <div v-reveal class="panel">
            <div class="copy">
                <p class="eyebrow">{{ t("community").eyebrow }}</p>
                <h2 class="section-title">{{ t("community").title }}</h2>
                <p class="body">{{ t("community").body }}</p>
            </div>
            <div class="actions">
                <a
                    class="btn primary"
                    href="https://github.com/alann-estrada-KSH/sileo-vue/issues/new"
                    target="_blank"
                    rel="noreferrer"
                >{{ t("community").issuesCta }}</a>
                <a
                    class="btn"
                    href="https://github.com/alann-estrada-KSH/sileo-vue/issues"
                    target="_blank"
                    rel="noreferrer"
                >{{ t("community").discussionsCta }}</a>
            </div>
        </div>
    </section>
</template>

<style scoped>
.community {
    padding-block: 6rem;
}

.panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line);
    background: linear-gradient(155deg, var(--ink-2), var(--ink-1));
}

.copy {
    max-width: 48ch;
}

.section-title {
    margin-top: 0.6rem;
    font-size: clamp(1.6rem, 3.2vw, 2.1rem);
}

.body {
    margin-top: 0.85rem;
    font-size: 0.96rem;
    line-height: 1.6;
    color: var(--paper-dim);
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    flex-shrink: 0;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.3rem;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid var(--line);
    color: var(--paper);
    transition: border-color 180ms var(--ease-out-expo), background 180ms var(--ease-out-expo), color 180ms var(--ease-out-expo);
}

.btn:hover {
    border-color: var(--accent);
}

.btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--ink-0);
}

.btn.primary:hover {
    opacity: 0.9;
}

@media (max-width: 700px) {
    .panel {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
