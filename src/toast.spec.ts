import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { h, nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { EXIT_DURATION } from "./constants";
import { Toaster, sileo } from "./toast";

const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await nextTick();
};

const mountedWrappers: VueWrapper[] = [];

const mountToaster = (props?: Record<string, unknown>) => {
    const wrapper = mount(Toaster, {
        attachTo: document.body,
        props,
    });
    mountedWrappers.push(wrapper);
    return wrapper;
};

describe("sileo", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        sileo.clear();
        vi.useRealTimers();
    });

    afterEach(() => {
        for (const wrapper of mountedWrappers.splice(0)) {
            try {
                wrapper.unmount();
            } catch {
                // JSDOM + Teleport can already detach nodes between assertions/cleanup.
            }
        }
        sileo.clear();
        document.body.innerHTML = "";
        vi.useRealTimers();
    });

    it("stacks unnamed toasts with unique ids", async () => {
        mountToaster();
        sileo.info({ title: "First", duration: null });
        sileo.info({ title: "Second", duration: null });
        await flush();

        const toasts = document.querySelectorAll("[data-sileo-toast='true']");
        expect(toasts).toHaveLength(2);
    });

    it("supports sileo.loading as standalone notification", async () => {
        mountToaster();
        sileo.loading({ title: "Loading data" });
        await flush();

        const toast = document.querySelector("[data-sileo-toast='true']");
        expect(toast?.getAttribute("data-state")).toBe("loading");
    });

    it("keeps title casing exactly as provided", async () => {
        mountToaster();
        sileo.info({ title: "Test data test", duration: null });
        await flush();

        const title = document.querySelector(".sileo-title");
        expect(title?.textContent).toBe("Test data test");
    });

    it("supports grouped notifications when threshold is exceeded", async () => {
        mountToaster({
            grouping: true,
            groupThreshold: 2,
        });

        sileo.info({ title: "One", duration: null });
        sileo.info({ title: "Two", duration: null });
        sileo.info({ title: "Three", duration: null });
        await flush();

        expect(document.querySelector("[data-sileo-group='true']")?.textContent).toContain(
            "3 notifications",
        );
    });

    it("uses groupKey when grouping notifications", async () => {
        mountToaster({
            grouping: true,
            groupThreshold: 1,
        });

        sileo.info({ title: "A", duration: null, groupKey: "uploads" });
        sileo.info({ title: "B", duration: null, groupKey: "uploads" });
        sileo.info({ title: "C", duration: null, groupKey: "billing" });
        await flush();

        const groups = Array.from(document.querySelectorAll("[data-sileo-group='true']")).map(
            (el) => el.textContent ?? "",
        );
        expect(groups.some((text) => text.includes("uploads"))).toBe(true);
        expect(groups.some((text) => text.includes("billing"))).toBe(false);
    });

    it("teleports into a custom container", async () => {
        const host = document.createElement("div");
        host.id = "sileo-toaster";
        document.body.appendChild(host);

        mountToaster({
            container: "#sileo-toaster",
        });

        sileo.success({ title: "Inside custom host", duration: null });
        await flush();

        expect(host.querySelector("[data-sileo-toast='true']")).not.toBeNull();
    });

    it("does not drop configuration after remount", async () => {
        const first = mountToaster({ position: "bottom-left" });
        await flush();
        first.unmount();

        mountToaster();
        sileo.info({ title: "Still bottom-left", duration: null });
        await flush();

        const viewport = document.querySelector("[data-sileo-viewport='true']");
        expect(viewport?.getAttribute("data-position")).toBe("bottom-left");
    });

    it("dismisses only the targeted instance even when id is reused", async () => {
        vi.useFakeTimers();
        mountToaster();

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
        mountToaster();
        sileo.info({
            title: "VNode",
            description: h("strong", { class: "inline-node" }, "Rendered node"),
            duration: null,
        });
        await flush();

        expect(document.querySelector(".inline-node")?.textContent).toBe("Rendered node");
    });

    it("renders custom icon when provided", async () => {
        mountToaster();
        sileo.success({
            title: "Icon",
            icon: h("em", { class: "custom-icon" }, "!"),
            duration: null,
        });
        await flush();

        expect(document.querySelector(".custom-icon")?.textContent).toBe("!");
    });

    it("renders default state icon as svg, not state text", async () => {
        mountToaster();
        sileo.success({ title: "Saved", duration: null });
        await flush();

        const badge = document.querySelector("[data-sileo-badge='true']");
        expect(badge?.querySelector("svg")).not.toBeNull();
        expect((badge?.textContent ?? "").trim().toLowerCase()).not.toBe("success");
    });

    it("autopilot expands then collapses description", async () => {
        vi.useFakeTimers();
        mountToaster();
        sileo.info({
            title: "Timeline",
            description: "Animated",
            duration: 5000,
            autopilot: { expand: 50, collapse: 300 },
        });

        await flush();
        const toast = document.querySelector("[data-sileo-toast='true']");
        expect(toast?.getAttribute("data-expanded")).toBe("false");

        vi.advanceTimersByTime(70);
        await flush();
        expect(toast?.getAttribute("data-expanded")).toBe("true");

        vi.advanceTimersByTime(300);
        await flush();
        expect(toast?.getAttribute("data-expanded")).toBe("false");
    });

    it("does not re-expand older toast when a newer one is active", async () => {
        vi.useFakeTimers();
        mountToaster();

        sileo.info({
            title: "First",
            description: "First description",
            duration: 5000,
            autopilot: { expand: 50, collapse: 300 },
        });
        await flush();

        vi.advanceTimersByTime(70);
        await flush();

        sileo.info({
            title: "Second",
            description: "Second description",
            duration: 5000,
            autopilot: { expand: 50, collapse: 300 },
        });
        await flush();

        const firstTitle = Array.from(document.querySelectorAll(".sileo-title")).find(
            (el) => el.textContent === "First",
        );
        const firstToast = firstTitle?.closest("[data-sileo-toast='true']") as HTMLElement | null;

        vi.advanceTimersByTime(1000);
        await flush();
        expect(firstToast?.getAttribute("data-expanded")).toBe("false");
    });

    it("supports promise success lifecycle", async () => {
        mountToaster();

        await sileo.promise(Promise.resolve("ok"), {
            loading: { title: "Loading" },
            success: (value) => ({ title: `Success ${value}`, duration: null }),
            error: { title: "Failed", duration: null },
        });
        await flush();

        const titles = Array.from(document.querySelectorAll(".sileo-title")).map(
            (el) => el.textContent,
        );
        expect(titles).toContain("Success ok");
    });

    it("fires lifecycle hooks through show, expand, collapse and dismiss", async () => {
        vi.useFakeTimers();
        mountToaster();

        const onShow = vi.fn();
        const onExpand = vi.fn();
        const onCollapse = vi.fn();
        const onDismiss = vi.fn();

        const id = sileo.info({
            title: "Hooks",
            description: "Lifecycle",
            duration: 5000,
            autopilot: { expand: 50, collapse: 180 },
            hooks: { onShow, onExpand, onCollapse, onDismiss },
        });

        expect(typeof id).toBe("string");
        expect(onShow).toHaveBeenCalledTimes(1);

        await flush();
        vi.advanceTimersByTime(60);
        await flush();
        expect(onExpand).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(200);
        await flush();
        expect(onCollapse).toHaveBeenCalledTimes(1);

        sileo.dismiss(id);
        await flush();
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("applies aria-live prop to viewport", async () => {
        mountToaster({ ariaLive: "assertive" });
        sileo.info({ title: "A11y", duration: null });
        await flush();

        const viewport = document.querySelector("[data-sileo-viewport='true']");
        expect(viewport?.getAttribute("aria-live")).toBe("assertive");
        expect(viewport?.getAttribute("aria-atomic")).toBe("true");
    });
});
