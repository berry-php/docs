// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import catppuccin from "@catppuccin/starlight";

export default defineConfig({
    site: "https://berry.atomicptr.dev",
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
            sidebar: [
                {
                    label: "Get Started",
                    slug: "docs/get-started",
                },
                // {
                //     label: "berry/htmx",
                //     autogenerate: { directory: "docs/integrations/htmx" },
                // },
                // {
                //     label: "berry/symfony",
                //     autogenerate: { directory: "docs/integrations/symfony" },
                // },
            ],
            plugins: [
                catppuccin({
                    dark: {
                        flavor: "mocha",
                        accent: "lavender",
                    },
                    light: {
                        flavor: "latte",
                        accent: "lavender",
                    },
                }),
            ],
        }),
    ],
});
