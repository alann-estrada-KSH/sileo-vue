import type { Directive } from "vue";

// One shared observer for the whole page instead of one per element — cheaper,
// and the .reveal/.is-visible CSS (see style.css) does the actual animating.
let observer: IntersectionObserver | null = null;

const getObserver = () => {
    if (observer || typeof IntersectionObserver === "undefined") return observer;
    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("is-visible");
                observer?.unobserve(entry.target);
            }
        },
        // No negative bottom margin: a short element at the very end of the
        // page (e.g. the footer) can never scroll further up past a shrunk
        // trigger zone, so it would stay permanently unrevealed.
        { threshold: 0.15 },
    );
    return observer;
};

// v-reveal="120" fades an element up on scroll into view, staggered by an
// optional delay in milliseconds. No IntersectionObserver support (or
// reduced-motion, handled purely in CSS) just leaves the element visible.
export const vReveal: Directive<HTMLElement, number | undefined> = {
    mounted(el, binding) {
        el.classList.add("reveal");
        if (binding.value) el.style.transitionDelay = `${binding.value}ms`;
        const obs = getObserver();
        if (obs) obs.observe(el);
        else el.classList.add("is-visible");
    },
    unmounted(el) {
        observer?.unobserve(el);
    },
};
