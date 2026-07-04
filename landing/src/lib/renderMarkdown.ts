import { marked } from "marked";

// The docs cross-link each other by relative filename (e.g. "getting-started.md",
// matching how they render on GitHub). Rewrite those to in-app hash routes so
// clicking one stays inside the SPA instead of requesting a non-existent page.
const rewriteRelativeDocLinks = (markdown: string): string =>
    markdown.replace(/]\(([a-z0-9-]+)\.md\)/gi, "](#/docs/$1)");

// Content is our own build-time-imported markdown (see docs-content/index.ts),
// not user input, so rendering it as HTML is the same trust level as any other
// static site copy.
export const renderMarkdown = (raw: string): string =>
    marked.parse(rewriteRelativeDocLinks(raw), { async: false }) as string;
