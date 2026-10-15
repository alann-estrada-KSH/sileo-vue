import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    webServer: {
        command: "npm run build && npm run preview -- --port 5183 --strictPort",
        url: "http://localhost:5183",
        reuseExistingServer: false,
        timeout: 60_000,
    },
    use: {
        baseURL: "http://localhost:5183",
    },
});
