import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";
import { EXIT_DURATION } from "./constants";
import { Toaster, sileo } from "./toast";

const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

describe("sileo", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        sileo.clear();
        vi.useRealTimers();
    });

    afterEach(() => {
        sileo.clear();
        vi.useRealTimers();
    });

    it("stacks unnamed toasts with unique ids", async () => {
        mount(Toaster, { attachTo: document.body });
        sileo.info({ title: "First", duration: null });
        sileo.info({ title: "Second", duration: null });
        await flush();

        const toasts = document.querySelectorAll("[data-sileo-toast='true']");
        expect(toasts).toHaveLength(2);
    });

    it("supports sileo.loading as standalone notification", async () => {
        mount(Toaster, { attachTo: document.body });
        sileo.loading({ title: "Loading data" });
        await flush();

        const toast = document.querySelector("[data-sileo-toast='true']");
        expect(toast?.getAttribute("data-state")).toBe("loading");
    });

    it("keeps title casing exactly as provided", async () => {
        mount(Toaster, { attachTo: document.body });
        sileo.info({ title: "Test data test", duration: null });
        await flush();

        const title = document.querySelector(".sileo-title");
        expect(title?.textContent).toBe("Test data test");
    });

    it("supports grouped notifications when threshold is exceeded", async () => {
        mount(Toaster, {
            attachTo: document.body,
            props: {
                grouping: true,
                groupThreshold: 2,
            },
        });

        sileo.info({ title: "One", duration: null });
        sileo.info({ title: "Two", duration: null });
        sileo.info({ title: "Three", duration: null });
        await flush();

        expect(document.querySelector("[data-sileo-group='true']")?.textContent).toContain(
            "3 notifications",
        );
    });

    it("teleports into a custom container", async () => {
        const host = document.createElement("div");
        host.id = "sileo-toaster";
        document.body.appendChild(host);

        mount(Toaster, {
            attachTo: document.body,
            props: {
                container: "#sileo-toaster",
            },
        });

        sileo.success({ title: "Inside custom host", duration: null });
        await flush();

        expect(host.querySelector("[data-sileo-toast='true']")).not.toBeNull();
    });

    it("does not drop configuration after remount", async () => {
        const first = mount(Toaster, {
            attachTo: document.body,
            props: {
                position: "bottom-left",
            },
        });
        await flush();
        first.unmount();

        mount(Toaster, { attachTo: document.body });
        sileo.info({ title: "Still bottom-left", duration: null });
        await flush();

        const viewport = document.querySelector("[data-sileo-viewport='true']");
        expect(viewport?.getAttribute("data-position")).toBe("bottom-left");
    });

    it("dismisses only the targeted instance even when id is reused", async () => {
        vi.useFakeTimers();
        mount(Toaster, { attachTo: document.body });

        sileo.info({ id: "shared", title: "First", duration: null });
        sileo.dismiss("shared");
        sileo.info({ id: "shared", title: "Second", duration: null });

        vi.advanceTimersByTime(EXIT_DURATION + 1);
        await flush();

        const titles = Array.from(document.querySelectorAll(".sileo-title")).map(
            (el) => el.textContent,
        );
        expect(titles).toContain("Second");
        expect(titles).not.toContain("First");
    });

    it("accepts VNodes in description", async () => {
        mount(Toaster, { attachTo: document.body });
        sileo.info({
            title: "VNode",
            description: h("strong", { class: "inline-node" }, "Rendered node"),
            duration: null,
        });
        await flush();

        expect(document.querySelector(".inline-node")?.textContent).toBe("Rendered node");
    });
});
