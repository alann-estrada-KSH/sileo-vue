import { ref } from "vue";

export type PageTheme = "dark" | "light";

const STORAGE_KEY = "sileo-landing-theme";

const detectDefault = (): PageTheme => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const applyTheme = (value: PageTheme) => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
};

export const pageTheme = ref<PageTheme>(detectDefault());
applyTheme(pageTheme.value);

export const setPageTheme = (next: PageTheme) => {
    pageTheme.value = next;
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
};
