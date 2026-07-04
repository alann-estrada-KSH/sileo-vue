// Raw-imports the actual docs/*.md files at build time so the site renders the
// same source of truth as the repo docs — no separate copy to keep in sync.
import overview from "../../../docs/index.md?raw";
import gettingStarted from "../../../docs/getting-started.md?raw";
import apiReference from "../../../docs/api-reference.md?raw";
import examples from "../../../docs/examples.md?raw";
import styling from "../../../docs/styling.md?raw";
import advancedFeatures from "../../../docs/advanced-features.md?raw";
import implementationNotes from "../../../docs/implementation-notes.md?raw";
import migrationGuide from "../../../docs/migration-guide.md?raw";

export interface DocEntry {
    slug: string;
    raw: string;
}

// slug doubles as the key into docsPage.pages in i18n.ts for the sidebar
// title/description, and as the vue-router param (/docs/:slug).
export const DOCS: DocEntry[] = [
    { slug: "index", raw: overview },
    { slug: "getting-started", raw: gettingStarted },
    { slug: "api-reference", raw: apiReference },
    { slug: "examples", raw: examples },
    { slug: "styling", raw: styling },
    { slug: "advanced-features", raw: advancedFeatures },
    { slug: "implementation-notes", raw: implementationNotes },
    { slug: "migration-guide", raw: migrationGuide },
];

export const DEFAULT_SLUG = "index";

export const findDoc = (slug: string | undefined): DocEntry =>
    DOCS.find((doc) => doc.slug === slug) ?? DOCS.find((doc) => doc.slug === DEFAULT_SLUG)!;
