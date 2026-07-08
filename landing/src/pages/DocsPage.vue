<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { t, locale } from "../i18n";
import { DOCS, DEFAULT_SLUG, findDoc } from "../docs-content";
import { renderMarkdown } from "../lib/renderMarkdown";

const route = useRoute();

const activeSlug = computed(() => (typeof route.params.slug === "string" ? route.params.slug : DEFAULT_SLUG));
const activeDoc = computed(() => findDoc(activeSlug.value));
const renderedHtml = computed(() => renderMarkdown(activeDoc.value.raw[locale.value]));

const pageMeta = (slug: string) => t("docsPage").pages[slug];

const githubUrl = computed(
    () => `https://github.com/alann-estrada-KSH/sileo-vue/blob/main/docs/${activeDoc.value.slug}.md`,
);
</script>

<template>
    <div class="docs-page container">
        <router-link class="back-link" to="/">{{ t("docsPage").backHome }}</router-link>

        <div class="docs-layout">
            <aside class="sidebar">
                <router-link
                    v-for="doc in DOCS"
                    :key="doc.slug"
                    class="sidebar-link"
                    :class="{ active: doc.slug === activeSlug }"
                    :to="doc.slug === DEFAULT_SLUG ? '/docs' : `/docs/${doc.slug}`"
                >
                    <span class="sidebar-title">{{ pageMeta(doc.slug).title }}</span>
                    <span class="sidebar-desc">{{ pageMeta(doc.slug).desc }}</span>
                </router-link>
            </aside>

            <article class="prose" v-html="renderedHtml"></article>
        </div>

        <a class="github-link" :href="githubUrl" target="_blank" rel="noreferrer">{{ t("docsPage").viewOnGithub }}</a>
    </div>
</template>

<style scoped>
.docs-page {
    padding-block: 3rem 6rem;
    min-height: 100vh;
}

.back-link {
    display: inline-block;
    margin-bottom: 2rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--paper-dim);
    text-decoration: none;
    transition: color 180ms var(--ease-out-expo);
}

.back-link:hover {
    color: var(--accent);
}

.docs-layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 2.5rem;
    align-items: start;
}

.sidebar {
    position: sticky;
    top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.sidebar-link {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.6rem 0.8rem;
    border-radius: var(--radius-sm);
    text-decoration: none;
    border: 1px solid transparent;
    transition: background 160ms var(--ease-out-expo), border-color 160ms var(--ease-out-expo);
}

.sidebar-link:hover {
    background: var(--ink-1);
}

.sidebar-link.active {
    border-color: var(--line);
    background: var(--ink-1);
}

.sidebar-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--paper);
}

.sidebar-link.active .sidebar-title {
    color: var(--accent);
}

.sidebar-desc {
    font-size: 0.76rem;
    color: var(--paper-faint);
}

.github-link {
    display: inline-block;
    margin-top: 3rem;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--paper-dim);
    text-decoration: none;
}

.github-link:hover {
    color: var(--accent);
}

@media (max-width: 860px) {
    .docs-layout {
        grid-template-columns: 1fr;
    }

    .sidebar {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .sidebar-link {
        flex: 1 1 220px;
    }
}

/* ── Prose (rendered markdown) ──────────────────────────────────────────── */

.prose {
    min-width: 0;
    font-size: 1rem;
    line-height: 1.7;
    color: var(--paper-dim);
}

.prose :deep(h1) {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 2.6rem);
    color: var(--paper);
    margin: 0 0 1.25rem;
}

.prose :deep(h2) {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--paper);
    margin: 2.5rem 0 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--line);
}

.prose :deep(h2:first-child) {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
}

.prose :deep(h3) {
    font-size: 1.15rem;
    color: var(--paper);
    margin: 1.75rem 0 0.75rem;
}

.prose :deep(p) {
    margin: 0 0 1rem;
}

.prose :deep(ul),
.prose :deep(ol) {
    margin: 0 0 1rem;
    padding-left: 1.4rem;
}

.prose :deep(li) {
    margin-bottom: 0.4rem;
}

.prose :deep(a) {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 2px;
}

.prose :deep(code) {
    font-family: var(--font-mono);
    font-size: 0.86em;
    background: var(--ink-1);
    padding: 0.15em 0.4em;
    border-radius: 5px;
    color: var(--paper);
}

.prose :deep(pre) {
    margin: 0 0 1.25rem;
    padding: 1.1rem 1.3rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--line);
    background: var(--ink-0);
    overflow-x: auto;
}

.prose :deep(pre code) {
    background: none;
    padding: 0;
    color: var(--paper-dim);
    font-size: 0.85rem;
    line-height: 1.6;
}

.prose :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 1.25rem;
    font-size: 0.9rem;
}

.prose :deep(th),
.prose :deep(td) {
    text-align: left;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--line);
}

.prose :deep(th) {
    color: var(--paper);
    background: var(--ink-1);
}

.prose :deep(blockquote) {
    margin: 0 0 1.25rem;
    padding: 0.25rem 1.1rem;
    border-left: 2px solid var(--accent);
    color: var(--paper-faint);
}
</style>
