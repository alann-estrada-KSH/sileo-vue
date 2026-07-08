<script setup lang="ts">
import { t } from "../i18n";

// href/highlight are layout/link concerns, language-agnostic, kept out of the
// translated copy — mirrors the SPANS pattern in FeatureGrid.vue.
const LINKS = [
    { href: null, highlight: true },
    { href: "https://github.com/alann-estrada-KSH/sileo-flutter", highlight: false },
];

const items = () => t("ecosystem").items.map((item, i) => ({ ...item, ...LINKS[i] }));
</script>

<template>
    <section id="ecosystem" class="ecosystem container">
        <p v-reveal class="eyebrow">{{ t("ecosystem").eyebrow }}</p>
        <h2 v-reveal="60" class="section-title">{{ t("ecosystem").title }}</h2>
        <p v-reveal="100" class="lede">{{ t("ecosystem").lede }}</p>

        <div class="grid">
            <component
                :is="item.href ? 'a' : 'div'"
                v-for="(item, i) in items()"
                :key="item.name"
                v-reveal="i * 80"
                class="card"
                :class="{ current: item.highlight }"
                v-bind="item.href ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {}"
            >
                <span class="tag">{{ item.tag }}</span>
                <h3>{{ item.name }}</h3>
                <p>{{ item.body }}</p>
                <span class="cta">{{ item.cta }}</span>
            </component>
        </div>
    </section>
</template>

<style scoped>
.ecosystem {
    padding-block: 6rem;
}

.section-title {
    margin-top: 0.6rem;
    max-width: 32ch;
    font-size: clamp(2rem, 4.4vw, 2.85rem);
}

.lede {
    margin-top: 1rem;
    max-width: 62ch;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--paper-dim);
}

.grid {
    margin-top: 2.75rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.1rem;
}

.card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.9rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--line);
    background: linear-gradient(155deg, var(--ink-2), var(--ink-1));
    text-decoration: none;
    color: inherit;
    transition: border-color 220ms var(--ease-out-expo), transform 220ms var(--ease-out-expo);
}

a.card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
}

.card.current {
    border-color: var(--line);
    cursor: default;
}

.tag {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
}

.card h3 {
    margin-top: 0.85rem;
    font-family: var(--font-mono);
    font-size: 1.35rem;
}

.card p {
    margin-top: 0.65rem;
    color: var(--paper-dim);
    font-size: 0.94rem;
    line-height: 1.6;
}

.cta {
    margin-top: 1.25rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--paper-faint);
}

a.card:hover .cta {
    color: var(--accent);
}

@media (max-width: 800px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
