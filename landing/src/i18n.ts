import { ref } from "vue";

export type Locale = "en" | "es";

const STORAGE_KEY = "sileo-landing-locale";

const detectDefault = (): Locale => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "es") return stored;
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
};

export const locale = ref<Locale>(detectDefault());

if (typeof document !== "undefined") {
    document.documentElement.lang = locale.value;
}

export const setLocale = (next: Locale) => {
    locale.value = next;
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
    }
    if (typeof document !== "undefined") {
        document.documentElement.lang = next;
    }
};

interface Feature {
    tag: string;
    title: string;
    body: string;
}

interface DocLink {
    title: string;
    desc: string;
}

interface Messages {
    meta: { title: string; description: string };
    nav: { playground: string; features: string; docs: string; github: string };
    hero: {
        eyebrow: string;
        headline1: string;
        headline2: string;
        subhead: string;
        copy: string;
        copied: string;
        tryLive: string;
        viewSource: string;
    };
    playground: {
        eyebrow: string;
        title: string;
        lede: string;
        btnSuccess: string;
        btnError: string;
        btnAction: string;
        btnPromise: string;
        btnGroup: string;
        btnCustom: string;
        btnClear: string;
        themeDark: string;
        themeLight: string;
        themeColored: string;
        toasts: {
            successTitle: string;
            successDesc: string;
            errorTitle: string;
            errorDesc: string;
            actionTitle: string;
            actionDesc: string;
            actionButton: string;
            actionOpenedTitle: string;
            promiseLoadingTitle: string;
            promiseLoadingDesc: string;
            promiseSuccessTitle: string;
            promiseSuccessDesc: string;
            promiseErrorTitle: string;
            groupTitles: string[];
            customTitle: string;
            customDesc: string;
        };
    };
    features: { eyebrow: string; title: string; items: Feature[] };
    docs: { eyebrow: string; title: string; items: DocLink[] };
    docsPage: {
        backHome: string;
        viewOnGithub: string;
        pages: Record<string, { title: string; desc: string }>;
    };
    footer: { docs: string; meta: string; credit: string };
}

const messages: Record<Locale, Messages> = {
    en: {
        meta: {
            title: "sileo-vue — toasts with manners",
            description:
                "sileo-vue is an opinionated toast notification library for Vue 3 — gooey pill toasts, promise flows, grouping, swipe-to-dismiss, and full color theming.",
        },
        nav: { playground: "Playground", features: "Features", docs: "Docs", github: "GitHub" },
        hero: {
            eyebrow: "Vue 3 · toast component",
            headline1: "Say it once.",
            headline2: "Say it well.",
            subhead:
                "sileo-vue is an opinionated toast library built around gooey SVG pills that expand on demand, merge into a count when they pile up, and dismiss themselves without asking for applause.",
            copy: "copy",
            copied: "copied",
            tryLive: "Try it live ↓",
            viewSource: "View source",
        },
        playground: {
            eyebrow: "try it",
            title: "Poke it. It won't bite.",
            lede: "These buttons call the exact same API shown in the snippets below. Fire a few at once to see grouping and the gooey expand animation kick in.",
            btnSuccess: "success",
            btnError: "error",
            btnAction: "action + button",
            btnPromise: "promise flow",
            btnGroup: "grouped burst",
            btnCustom: "custom fill",
            btnClear: "clear all",
            themeDark: "dark",
            themeLight: "light",
            themeColored: "colored",
            toasts: {
                successTitle: "Deploy complete",
                successDesc: "All containers are healthy.",
                errorTitle: "Sync failed",
                errorDesc: "Retrying in 30 seconds.",
                actionTitle: "New comment",
                actionDesc: "Someone replied on your thread.",
                actionButton: "Open",
                actionOpenedTitle: "Thread opened",
                promiseLoadingTitle: "Creating invoice",
                promiseLoadingDesc: "Preparing PDF...",
                promiseSuccessTitle: "Invoice ready",
                promiseSuccessDesc: "Reference INV-1290",
                promiseErrorTitle: "Could not create invoice",
                groupTitles: [
                    "File 1 uploaded",
                    "File 2 uploaded",
                    "File 3 uploaded",
                    "File 4 uploaded",
                ],
                customTitle: "Branded toast",
                customDesc: "This one ignores the theme entirely.",
            },
        },
        features: {
            eyebrow: "under the hood",
            title: "Built for the notification, not the demo.",
            items: [
                {
                    tag: "signature",
                    title: "Gooey by construction",
                    body: "Every pill is an SVG shape run through a blur + contrast filter, not a border-radius trick. Expanding a toast is a genuine metaball merge between the header and the body.",
                },
                {
                    tag: "theming",
                    title: "Full color control",
                    body: "Override background, text, and every state accent with a single colors prop — on top of light, dark, a fully custom palette, or a toastify-style colored theme that fills each toast with its own state color. No CSS build step required.",
                },
                {
                    tag: "stacking",
                    title: "Groups when it piles up",
                    body: "Burst notifications collapse into a single count pill past your threshold, so five uploads don't turn into five toasts.",
                },
                {
                    tag: "async",
                    title: "Promise-aware",
                    body: "One call carries a toast through loading, success, error, and an optional follow-up action state.",
                },
                {
                    tag: "touch",
                    title: "Swipe to dismiss",
                    body: "Pointer-based swipe gestures on touch devices, opt-out per toast when you need a pinned notification.",
                },
                {
                    tag: "control",
                    title: "Lifecycle hooks",
                    body: "onShow, onExpand, onCollapse, onDismiss — wire toasts into analytics or orchestration without polling state.",
                },
                {
                    tag: "a11y",
                    title: "Accessible by default",
                    body: "Configurable aria-live region (polite, assertive, or off) on the viewport, keyboard-safe focus, and reduced-motion support baked into the CSS.",
                },
            ],
        },
        docs: {
            eyebrow: "read more",
            title: "Documentation",
            items: [
                { title: "Getting Started", desc: "Install, mount Toaster, fire your first toast." },
                { title: "API Reference", desc: "Every sileo.*() method, option, and prop." },
                { title: "Examples", desc: "Copy-paste patterns for real app flows." },
                { title: "Styling & Theming", desc: "Colors, fill, roundness, and the custom palette." },
                { title: "Advanced Features", desc: "Grouping, hooks, containers, and more." },
                { title: "Migration Guide", desc: "Coming from another toast library." },
            ],
        },
        docsPage: {
            backHome: "← Back to home",
            viewOnGithub: "View on GitHub ↗",
            pages: {
                index: { title: "Overview", desc: "Where to start and what sileo-vue is good at." },
                "getting-started": { title: "Getting Started", desc: "Install, mount Toaster, fire your first toast." },
                "api-reference": { title: "API Reference", desc: "Every sileo.*() method, option, and prop." },
                examples: { title: "Examples", desc: "Copy-paste patterns for real app flows." },
                styling: { title: "Styling & Theming", desc: "Colors, fill, roundness, and the custom palette." },
                "advanced-features": { title: "Advanced Features", desc: "Grouping, hooks, containers, and more." },
                "implementation-notes": { title: "Implementation Notes", desc: "Integration guidance for teams adopting sileo-vue." },
                "migration-guide": { title: "Migration Guide", desc: "Coming from another toast library." },
            },
        },
        footer: {
            docs: "Docs",
            meta: "MIT · built with Vue 3",
            credit:
                "sileo-vue is an improved fork of the original Sileo for React by @hiaaryan — rebuilt from scratch for Vue with grouping, promise flows, custom theming, and more.",
        },
    },
    es: {
        meta: {
            title: "sileo-vue — notificaciones con modales",
            description:
                "sileo-vue es una librería de notificaciones (toasts) para Vue 3 con opinión propia — píldoras gooey, flujos de promesas, agrupación, deslizar para descartar y temas de color completos.",
        },
        nav: { playground: "Demo", features: "Funciones", docs: "Docs", github: "GitHub" },
        hero: {
            eyebrow: "Vue 3 · componente de notificaciones",
            headline1: "Dilo una vez.",
            headline2: "Dilo bien.",
            subhead:
                "sileo-vue es una librería de notificaciones con opinión propia, construida con píldoras SVG “gooey” que se expanden a demanda, se agrupan en un contador cuando se acumulan, y se despiden solas sin pedir aplausos.",
            copy: "copiar",
            copied: "copiado",
            tryLive: "Pruébalo en vivo ↓",
            viewSource: "Ver código fuente",
        },
        playground: {
            eyebrow: "pruébalo",
            title: "Tócalo. No muerde.",
            lede: "Estos botones llaman exactamente a la misma API que ves en los fragmentos de abajo. Dispara varios a la vez para ver la agrupación y la animación gooey en acción.",
            btnSuccess: "éxito",
            btnError: "error",
            btnAction: "acción + botón",
            btnPromise: "flujo de promesa",
            btnGroup: "ráfaga agrupada",
            btnCustom: "color personalizado",
            btnClear: "limpiar todo",
            themeDark: "oscuro",
            themeLight: "claro",
            themeColored: "colored",
            toasts: {
                successTitle: "Despliegue completo",
                successDesc: "Todos los contenedores están saludables.",
                errorTitle: "Sincronización fallida",
                errorDesc: "Reintentando en 30 segundos.",
                actionTitle: "Nuevo comentario",
                actionDesc: "Alguien respondió en tu hilo.",
                actionButton: "Abrir",
                actionOpenedTitle: "Hilo abierto",
                promiseLoadingTitle: "Creando factura",
                promiseLoadingDesc: "Preparando PDF...",
                promiseSuccessTitle: "Factura lista",
                promiseSuccessDesc: "Referencia INV-1290",
                promiseErrorTitle: "No se pudo crear la factura",
                groupTitles: [
                    "Archivo 1 subido",
                    "Archivo 2 subido",
                    "Archivo 3 subido",
                    "Archivo 4 subido",
                ],
                customTitle: "Notificación personalizada",
                customDesc: "Esta ignora el tema por completo.",
            },
        },
        features: {
            eyebrow: "por dentro",
            title: "Construido para la notificación, no para la demo.",
            items: [
                {
                    tag: "distintivo",
                    title: "Gooey por construcción",
                    body: "Cada píldora es una forma SVG procesada con un filtro de blur + contraste, no un truco de border-radius. Expandir una notificación es una fusión real de metaballs entre el encabezado y el cuerpo.",
                },
                {
                    tag: "temas",
                    title: "Control total de color",
                    body: "Sobrescribe el fondo, el texto y cada color de estado con una sola prop colors, sobre el tema claro, oscuro, una paleta totalmente personalizada, o un tema colored al estilo toastify que rellena cada notificación con el color de su propio estado. Sin compilar CSS.",
                },
                {
                    tag: "apilado",
                    title: "Se agrupa cuando se acumula",
                    body: "Las ráfagas de notificaciones colapsan en una sola píldora con contador al superar tu umbral, para que cinco subidas no se conviertan en cinco notificaciones.",
                },
                {
                    tag: "async",
                    title: "Consciente de promesas",
                    body: "Una sola llamada lleva la notificación por los estados de carga, éxito, error y una acción de seguimiento opcional.",
                },
                {
                    tag: "táctil",
                    title: "Deslizar para descartar",
                    body: "Gestos de deslizamiento basados en puntero en dispositivos táctiles, desactivables por notificación cuando necesites una fijada.",
                },
                {
                    tag: "control",
                    title: "Hooks de ciclo de vida",
                    body: "onShow, onExpand, onCollapse, onDismiss — conecta las notificaciones a analítica u orquestación sin sondear el estado.",
                },
                {
                    tag: "a11y",
                    title: "Accesible por defecto",
                    body: "Región aria-live configurable (polite, assertive u off) en el viewport, foco seguro para teclado y soporte de movimiento reducido integrado en el CSS.",
                },
            ],
        },
        docs: {
            eyebrow: "leer más",
            title: "Documentación",
            items: [
                { title: "Primeros pasos", desc: "Instala, monta el Toaster y dispara tu primera notificación." },
                { title: "Referencia de API", desc: "Cada método sileo.*(), opción y prop." },
                { title: "Ejemplos", desc: "Patrones listos para copiar y pegar en flujos reales." },
                { title: "Estilos y temas", desc: "Colores, relleno, bordes redondeados y la paleta personalizada." },
                { title: "Funciones avanzadas", desc: "Agrupación, hooks, contenedores y más." },
                { title: "Guía de migración", desc: "Si vienes de otra librería de notificaciones." },
            ],
        },
        docsPage: {
            backHome: "← Volver al inicio",
            viewOnGithub: "Ver en GitHub ↗",
            pages: {
                index: { title: "Resumen", desc: "Por dónde empezar y en qué destaca sileo-vue." },
                "getting-started": { title: "Primeros pasos", desc: "Instala, monta el Toaster y dispara tu primera notificación." },
                "api-reference": { title: "Referencia de API", desc: "Cada método sileo.*(), opción y prop." },
                examples: { title: "Ejemplos", desc: "Patrones listos para copiar y pegar en flujos reales." },
                styling: { title: "Estilos y temas", desc: "Colores, relleno, bordes redondeados y la paleta personalizada." },
                "advanced-features": { title: "Funciones avanzadas", desc: "Agrupación, hooks, contenedores y más." },
                "implementation-notes": { title: "Notas de implementación", desc: "Guía de integración para equipos que adoptan sileo-vue." },
                "migration-guide": { title: "Guía de migración", desc: "Si vienes de otra librería de notificaciones." },
            },
        },
        footer: {
            docs: "Documentación",
            meta: "MIT · hecho con Vue 3",
            credit:
                "sileo-vue es un fork mejorado del Sileo original para React de @hiaaryan — reconstruido desde cero para Vue con agrupación, flujos de promesas, temas personalizados y más.",
        },
    },
};

export const t = <K extends keyof Messages>(key: K): Messages[K] => messages[locale.value][key];
