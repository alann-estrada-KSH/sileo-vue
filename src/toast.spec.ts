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

// Hovering is gated on a real, recent pointermove (see isGenuineHover in toast.ts),
// so tests must simulate actual pointer movement before enter/leave, not just the
// enter/leave events alone.
const hover = (el: HTMLElement) => {
    window.dispatchEvent(new Event("pointermove"));
    el.dispatchEvent(new Event("mouseenter"));
};

const unhover = (el: HTMLElement) => {
    window.dispatchEvent(new Event("pointermove"));
    el.dispatchEvent(new Event("mouseleave"));
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

    it("sets data-theme=custom and applies custom colors as CSS variables", async () => {
        mountToaster({
            theme: "custom",
            colors: {
                background: "#0f172a",
                foreground: "#e2e8f0",
                success: "#22c55e",
            },
        });
        sileo.success({ title: "Custom theme", duration: null });
        await flush();

        const viewport = document.querySelector("[data-sileo-viewport='true']") as HTMLElement;
        expect(viewport.getAttribute("data-theme")).toBe("custom");
        expect(viewport.style.getPropertyValue("--sileo-fg-color")).toBe("#e2e8f0");
        expect(viewport.style.getPropertyValue("--sileo-state-success")).toBe("#22c55e");
    });

    it("uses a custom background color as the toast fill", async () => {
        mountToaster({ colors: { background: "#123456" } });
        sileo.info({ title: "Filled", duration: null });
        await flush();

        const pill = document.querySelector("[data-sileo-pill='true']");
        expect(pill?.getAttribute("fill")).toBe("#123456");
    });

    it("keeps the toast root at a fixed height when expanded, so hovering one does not reflow siblings", async () => {
        mountToaster();
        sileo.info({ title: "One", description: "First body", duration: null });
        sileo.info({ title: "Two", description: "Second body", duration: null });
        sileo.info({ title: "Three", description: "Third body", duration: null });
        sileo.info({ title: "Four", description: "Fourth body", duration: null });
        await flush();

        const toasts = Array.from(document.querySelectorAll("[data-sileo-toast='true']")) as HTMLElement[];
        expect(toasts).toHaveLength(4);

        hover(toasts[0]);
        await flush();

        expect(toasts[0].getAttribute("data-expanded")).toBe("true");
        for (const toast of toasts) {
            expect(toast.style.height).toBe("");
        }
    });

    it("does not auto-expand the newest toast after hovering and leaving an older one", async () => {
        vi.useFakeTimers();
        mountToaster();

        sileo.info({
            title: "Old",
            description: "Older description",
            duration: null,
            autopilot: { expand: 100, collapse: 5000 },
        });
        await flush();
        vi.advanceTimersByTime(5000);
        await flush();

        sileo.info({
            title: "New",
            description: "Newer description",
            duration: null,
            autopilot: { expand: 100, collapse: 5000 },
        });
        await flush();
        vi.advanceTimersByTime(5000);
        await flush();

        const toasts = Array.from(document.querySelectorAll("[data-sileo-toast='true']")) as HTMLElement[];
        const oldToast = toasts.find((t) => t.textContent?.includes("Old"))!;
        const newToast = toasts.find((t) => t.textContent?.includes("New"))!;

        hover(oldToast);
        await flush();
        unhover(oldToast);
        await flush();

        vi.advanceTimersByTime(500);
        await flush();

        expect(newToast.getAttribute("data-expanded")).toBe("false");
    });

    it("ignores mouseenter/mouseleave that fire without a real pointer movement (browser hover-recalc on layout change)", async () => {
        mountToaster();
        sileo.info({ title: "Covered", description: "Underneath", duration: null });
        await flush();

        const toast = document.querySelector("[data-sileo-toast='true']") as HTMLElement;

        // No preceding pointermove: this mirrors the browser re-running hit-testing
        // under a stationary cursor after a sibling's expanded overlay disappears.
        toast.dispatchEvent(new Event("mouseenter"));
        await flush();

        expect(toast.getAttribute("data-expanded")).toBe("false");

        // A genuine hover (real pointermove first) still works.
        hover(toast);
        await flush();
        expect(toast.getAttribute("data-expanded")).toBe("true");
    });

    it("does not re-arm the newest toast's peek when an unrelated older toast auto-dismisses", async () => {
        vi.useFakeTimers();
        mountToaster();

        sileo.info({ title: "Short lived", duration: 1000 });
        await flush();

        sileo.info({
            title: "Newest",
            description: "Should not reopen",
            duration: null,
            autopilot: { expand: 100, collapse: 400 },
        });
        await flush();

        // let "Newest"'s own initial peek fully play out (expand then collapse)
        vi.advanceTimersByTime(500);
        await flush();

        const toasts = Array.from(document.querySelectorAll("[data-sileo-toast='true']")) as HTMLElement[];
        const newest = toasts.find((t) => t.textContent?.includes("Newest"))!;
        const shortLived = toasts.find((t) => t.textContent?.includes("Short lived"))!;
        expect(newest.getAttribute("data-expanded")).toBe("false");

        // Hover a toast (any toast) and leave it, exactly like a user briefly
        // inspecting the stack — this is what makes activeToastInstanceId change
        // value later (from undefined back to "Newest") when the unrelated
        // dismissal reassigns it, which is what re-arms the buggy timer.
        hover(shortLived);
        await flush();
        unhover(shortLived);
        await flush();

        // Advance in small steps (flushing microtasks between each) past "Short
        // lived"'s dismissal mark and well past a buggy re-armed expand delay.
        // Coarse single big jumps don't interleave with Vue's watcher microtask,
        // so a freshly re-armed timer would be scheduled off the post-jump clock
        // and get missed — small steps mirror how time actually elapses live.
        for (let i = 0; i < 30; i++) {
            vi.advanceTimersByTime(50);
            await flush();
            expect(newest.getAttribute("data-expanded")).toBe("false");
        }
    });

    it("pauses dismiss on hover and resumes with the remaining time, not a fresh full duration", async () => {
        vi.useFakeTimers();
        mountToaster();

        sileo.info({ title: "Timed", duration: 1000 });
        await flush();

        // 700ms elapsed, 300ms remaining
        vi.advanceTimersByTime(700);
        await flush();

        const viewport = document.querySelector("[data-sileo-viewport='true']") as HTMLElement;
        viewport.dispatchEvent(new Event("mouseenter"));
        await flush();

        // paused: even well past the ORIGINAL full duration, it must not dismiss
        vi.advanceTimersByTime(2000);
        await flush();
        expect(document.querySelector("[data-sileo-toast='true']")).not.toBeNull();

        viewport.dispatchEvent(new Event("mouseleave"));
        await flush();

        // resumed: must fire around the remaining ~300ms, not a fresh full 1000ms
        vi.advanceTimersByTime(350);
        await flush();
        expect(
            document.querySelector("[data-sileo-toast='true']")?.getAttribute("data-exiting"),
        ).toBe("true");
    });

    it("colors the toast fill per-state under theme=colored", async () => {
        mountToaster({ theme: "colored" });
        sileo.success({ title: "Saved", duration: null });
        sileo.error({ title: "Failed", duration: null });
        await flush();

        const toasts = Array.from(document.querySelectorAll("[data-sileo-toast='true']"));
        const successFill = toasts[0].querySelector("[data-sileo-pill='true']")?.getAttribute("fill");
        const errorFill = toasts[1].querySelector("[data-sileo-pill='true']")?.getAttribute("fill");

        expect(successFill).toBeTruthy();
        expect(errorFill).toBeTruthy();
        expect(successFill).not.toBe(errorFill);

        const viewport = document.querySelector("[data-sileo-viewport='true']");
        expect(viewport?.getAttribute("data-theme")).toBe("colored");
    });

    it("lets a per-state colors override win over the default colored-theme fill", async () => {
        mountToaster({ theme: "colored", colors: { success: "#00ff88" } });
        sileo.success({ title: "Saved", duration: null });
        await flush();

        const pill = document.querySelector("[data-sileo-pill='true']");
        expect(pill?.getAttribute("fill")).toBe("#00ff88");
    });

    it("lets a global colors.background override take precedence over per-state colored fills", async () => {
        mountToaster({ theme: "colored", colors: { background: "#101010" } });
        sileo.success({ title: "Saved", duration: null });
        sileo.error({ title: "Failed", duration: null });
        await flush();

        const fills = Array.from(document.querySelectorAll("[data-sileo-pill='true']")).map((el) =>
            el.getAttribute("fill"),
        );
        expect(fills).toEqual(["#101010", "#101010"]);
    });
});
