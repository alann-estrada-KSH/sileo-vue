import { expect, test } from "@playwright/test";

test("fires a success toast with correct title and gooey filter markup", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "success", exact: true }).click();

    const toast = page.locator("[data-sileo-toast]").first();
    await expect(toast).toBeVisible();
    await expect(toast.locator("[data-sileo-title]")).toHaveText("Deploy complete");

    // Gooey filter: region sized from blur sigma (not a fixed -20%/140%), feColorMatrix
    // uses the valid "type" attribute, and the filter applies to a <g> around the
    // shapes instead of the canvas div -- matches the fix ported from upstream sileo.
    const filter = toast.locator("filter").first();
    await expect(filter).toHaveAttribute("filterUnits", "userSpaceOnUse");
    await expect(toast.locator("feColorMatrix")).toHaveAttribute("type", "matrix");
    await expect(toast.locator("g[filter]")).toHaveCount(1);
    await expect(toast.locator("title")).toHaveText("sileo notification");
});

test("dismisses the toast via its dismiss button", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "error", exact: true }).click();
    const toast = page.locator("[data-sileo-toast]").first();
    await expect(toast).toBeVisible();

    await toast.getByRole("button", { name: "Dismiss toast" }).click();
    await expect(page.locator("[data-sileo-toast]")).toHaveCount(0);
});
