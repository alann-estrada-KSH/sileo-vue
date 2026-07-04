<script setup lang="ts">
import { ref } from "vue";
import { t } from "../i18n";

const INSTALL_CMD = "npm install @alann-estrada-ksh/sileo-vue";
const copied = ref(false);

const copyInstall = async () => {
    try {
        await navigator.clipboard.writeText(INSTALL_CMD);
        copied.value = true;
        setTimeout(() => (copied.value = false), 1600);
    } catch {
        // clipboard permissions can be denied — the command is still visible to copy by hand
    }
};
</script>

<template>
    <header class="hero">
        <div class="hero-glow" aria-hidden="true"></div>

        <div class="hero-body container">
            <p class="eyebrow">{{ t("hero").eyebrow }}</p>
            <h1 class="headline">
                {{ t("hero").headline1 }}<br />
                <em>{{ t("hero").headline2 }}</em>
            </h1>
            <p class="subhead">{{ t("hero").subhead }}</p>

            <div class="hero-actions">
                <button
                    type="button"
                    class="install-cmd"
                    :aria-label="copied ? t('hero').copied : t('hero').copy"
                    @click="copyInstall"
                >
                    <span class="prompt">$</span>
                    <span class="cmd">{{ INSTALL_CMD }}</span>
                    <svg v-if="!copied" class="copy-icon" viewBox="0 0 16 16" aria-hidden="true">
                        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3" />
                        <path d="M3.5 10.5v-6a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
                    </svg>
                    <svg v-else class="copy-icon copied" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3.5 8.4L6.5 11.4L12.8 4.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <div class="link-row">
                    <router-link class="btn-ghost" :to="{ path: '/', hash: '#playground' }">{{ t("hero").tryLive }}</router-link>
                    <a
                        class="btn-ghost"
                        href="https://github.com/alann-estrada-KSH/sileo-vue"
                        target="_blank"
                        rel="noreferrer"
                    >{{ t("hero").viewSource }}</a>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.hero {
    position: relative;
    padding-bottom: 6rem;
    overflow: clip;
}

.hero-glow {
    position: absolute;
    top: -20%;
    left: 50%;
    width: 90vw;
    max-width: 900px;
    aspect-ratio: 1;
    transform: translateX(-50%);
    background: radial-gradient(circle, var(--accent-soft) 0%, transparent 68%);
    filter: blur(10px);
    pointer-events: none;
}

.hero-body {
    position: relative;
    z-index: 2;
    padding-top: 5rem;
    max-width: 760px;
}

.headline {
    font-size: clamp(2.75rem, 7vw, 5.25rem);
    line-height: 1.02;
    letter-spacing: -0.02em;
}

.headline em {
    font-style: italic;
    font-weight: 300;
    color: var(--paper-dim);
}

.subhead {
    margin-top: 1.75rem;
    max-width: 46ch;
    font-size: 1.15rem;
    color: var(--paper-dim);
}

.hero-actions {
    margin-top: 2.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    align-items: flex-start;
}

.install-cmd {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    max-width: 100%;
    padding: 0.85rem 1.1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--line);
    background: var(--ink-1);
    color: var(--paper);
    font-family: var(--font-mono);
    font-size: 0.92rem;
    cursor: pointer;
    overflow-x: auto;
    transition: border-color 180ms var(--ease-out-expo), background 180ms var(--ease-out-expo);
}

.cmd {
    white-space: nowrap;
}

.install-cmd:hover {
    border-color: var(--accent);
    background: var(--ink-2);
}

.prompt {
    flex-shrink: 0;
    color: var(--accent);
}

.copy-icon {
    margin-left: 0.4rem;
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    color: var(--paper-faint);
    transition: color 180ms var(--ease-out-expo);
}

.install-cmd:hover .copy-icon {
    color: var(--paper-dim);
}

.copy-icon.copied {
    color: var(--state-success);
}

.link-row {
    display: flex;
    gap: 1.25rem;
}

.btn-ghost {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    text-decoration: none;
    color: var(--paper-dim);
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
    transition: color 180ms var(--ease-out-expo), border-color 180ms var(--ease-out-expo);
}

.btn-ghost:hover {
    color: var(--accent);
    border-color: var(--accent);
}
</style>
