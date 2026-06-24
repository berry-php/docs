// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
    site: "https://berry.atomicptr.dev",
    compressHTML: true,
    integrations: [
        starlight({
            title: "berry",
            logo: {
                src: "./src/assets/berry.svg",
            },
            favicon: "./src/assets/berry.svg",
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/berry-php/html",
                },
            ],
            components: {
                Head: "./src/components/Head.astro",
            },
            customCss: ["./src/styles/starlight-theme.css"],
            sidebar: [
                {
                    label: "Get Started",
                    slug: "docs/get-started",
                },
                {
                    label: "Berry",
                    items: [
                        { label: "Core Concepts", slug: "docs/core-concepts" },
                        { label: "Writing Components", slug: "docs/writing-components" },
                        { label: "Attributes And Content", slug: "docs/attributes-and-content" },
                        { label: "Escaping", slug: "docs/escaping" },
                        { label: "Control Flow", slug: "docs/control-flow" },
                        { label: "SVG And XML", slug: "docs/svg-and-xml" },
                        { label: "Extensions", slug: "docs/extensions" },
                        { label: "Static Analysis", slug: "docs/static-analysis" },
                    ],
                },
                {
                    label: "Integrations",
                    items: [
                        { label: "Overview", slug: "docs/integrations/overview" },
                        { label: "Symfony", slug: "docs/integrations/symfony" },
                        { label: "HTMX", slug: "docs/integrations/htmx" },
                        { label: "Alpine.js", slug: "docs/integrations/alpinejs" },
                    ],
                },
            ],
        }),
    ],
});
