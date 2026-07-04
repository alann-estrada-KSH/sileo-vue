import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so production builds need the repo name as the base path. Local dev/preview
// stays at "/".
export default defineConfig(({ mode }) => ({
    base: mode === "production" ? "/sileo-vue/" : "/",
    server: { port: Number(process.env.PORT) || 5176 },
    plugins: [vue()],
    resolve: {
        alias: {
            "@alann-estrada-ksh/sileo-vue": fileURLToPath(
                new URL("../src/toast.ts", import.meta.url),
            ),
        },
    },
}));
