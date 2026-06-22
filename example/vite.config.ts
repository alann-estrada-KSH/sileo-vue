import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    server: { port: Number(process.env.PORT) || 5175 },
    plugins: [vue()],
    resolve: {
        alias: {
            sileo: fileURLToPath(new URL("../src/toast.ts", import.meta.url)),
            "@alann-estrada-ksh/sileo-vue": fileURLToPath(
                new URL("../src/toast.ts", import.meta.url),
            ),
        },
    },
});
