<script setup lang="ts">
import { watchEffect } from "vue";
import SiteNav from "./components/SiteNav.vue";
import TheFooter from "./components/TheFooter.vue";
import { t } from "./i18n";

// Keep the tab title and meta description in sync with the active locale.
// The static English copy in index.html still serves as the crawler-visible
// default for the initial (unhydrated) response.
watchEffect(() => {
    const meta = t("meta");
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
});
</script>

<template>
    <SiteNav />
    <router-view />
    <TheFooter />
</template>
