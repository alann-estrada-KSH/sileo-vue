<script setup lang="ts">
import { computed } from "vue";
import { t } from "../i18n";

// Slugs match docs-content/index.ts and route to the in-site docs viewer
// instead of linking out to GitHub.
const SLUGS = [
    "getting-started",
    "api-reference",
    "examples",
    "styling",
    "advanced-features",
    "migration-guide",
];

const docs = computed(() =>
    t("docs").items.map((item, i) => ({ ...item, slug: SLUGS[i] })),
);
</script>

<template>
    <section id="docs" class="docs container">
        <p v-reveal class="eyebrow">{{ t("docs").eyebrow }}</p>
        <h2 v-reveal="60" class="section-title">{{ t("docs").title }}</h2>

        <div class="docs-grid">
            <router-link
                v-for="(doc, i) in docs"
                :key="doc.slug"
                v-reveal="i * 70"
                class="doc-card"
                :to="`/docs/${doc.slug}`"
            >
                <h3>{{ doc.title }}</h3>
                <p>{{ doc.desc }}</p>
                <span class="arrow">&rarr;</span>
            </router-link>
        </div>
    </section>
</template>

<style scoped>
.docs {
    padding-block: 6rem;
}

.section-title {
    margin-top: 0.6rem;
    font-size: clamp(2rem, 4.4vw, 2.85rem);
}

.docs-grid {
    margin-top: 2.75rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.doc-card {
    position: relative;
    display: block;
    padding: 1.6rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--line);
    text-decoration: none;
    color: inherit;
    transition: border-color 200ms var(--ease-out-expo), background 200ms var(--ease-out-expo);
}

.doc-card:hover {
    border-color: var(--accent);
    background: var(--ink-1);
}

.doc-card h3 {
    font-size: 1.1rem;
    font-family: var(--font-body);
    font-weight: 600;
}

.doc-card p {
    margin-top: 0.5rem;
    font-size: 0.88rem;
    color: var(--paper-dim);
}

.arrow {
    position: absolute;
    top: 1.5rem;
    right: 1.4rem;
    color: var(--paper-faint);
    transition: transform 200ms var(--ease-out-expo), color 200ms var(--ease-out-expo);
}

.doc-card:hover .arrow {
    transform: translate(3px, -3px);
    color: var(--accent);
}

@media (max-width: 800px) {
    .docs-grid {
        grid-template-columns: 1fr;
    }
}
</style>
