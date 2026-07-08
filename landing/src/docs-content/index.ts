// Raw-imports the actual docs/*.md files at build time so the site renders the
// same source of truth as the repo docs — no separate copy to keep in sync.
// docs/es/*.md mirrors the same slugs with a Spanish translation.
import overviewEn from "../../../docs/index.md?raw";
import gettingStartedEn from "../../../docs/getting-started.md?raw";
import apiReferenceEn from "../../../docs/api-reference.md?raw";
import examplesEn from "../../../docs/examples.md?raw";
import stylingEn from "../../../docs/styling.md?raw";
import advancedFeaturesEn from "../../../docs/advanced-features.md?raw";
import implementationNotesEn from "../../../docs/implementation-notes.md?raw";
import migrationGuideEn from "../../../docs/migration-guide.md?raw";

import overviewEs from "../../../docs/es/index.md?raw";
import gettingStartedEs from "../../../docs/es/getting-started.md?raw";
import apiReferenceEs from "../../../docs/es/api-reference.md?raw";
import examplesEs from "../../../docs/es/examples.md?raw";
import stylingEs from "../../../docs/es/styling.md?raw";
import advancedFeaturesEs from "../../../docs/es/advanced-features.md?raw";
import implementationNotesEs from "../../../docs/es/implementation-notes.md?raw";
import migrationGuideEs from "../../../docs/es/migration-guide.md?raw";

import type { Locale } from "../i18n";

export interface DocEntry {
    slug: string;
    raw: Record<Locale, string>;
}

// slug doubles as the key into docsPage.pages in i18n.ts for the sidebar
// title/description, and as the vue-router param (/docs/:slug).
export const DOCS: DocEntry[] = [
    { slug: "index", raw: { en: overviewEn, es: overviewEs } },
    { slug: "getting-started", raw: { en: gettingStartedEn, es: gettingStartedEs } },
    { slug: "api-reference", raw: { en: apiReferenceEn, es: apiReferenceEs } },
    { slug: "examples", raw: { en: examplesEn, es: examplesEs } },
    { slug: "styling", raw: { en: stylingEn, es: stylingEs } },
    { slug: "advanced-features", raw: { en: advancedFeaturesEn, es: advancedFeaturesEs } },
    { slug: "implementation-notes", raw: { en: implementationNotesEn, es: implementationNotesEs } },
    { slug: "migration-guide", raw: { en: migrationGuideEn, es: migrationGuideEs } },
];

export const DEFAULT_SLUG = "index";

export const findDoc = (slug: string | undefined): DocEntry =>
    DOCS.find((doc) => doc.slug === slug) ?? DOCS.find((doc) => doc.slug === DEFAULT_SLUG)!;
