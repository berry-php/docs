---
title: Integrations
description: Optional packages that build on top of berry/html.
---

`berry/html` is the core package.

The other packages are optional integrations that make Berry nicer in specific environments.

Berry itself is already a good fit for hypermedia-oriented applications. If your UI model is “server renders HTML and the browser swaps it in”, Berry gives you a PHP-native way to build those fragments.

## berry/symfony

`berry/symfony` integrates Berry with Symfony.

It adds Symfony-aware components, controller responses, Twig views, service helpers, and form rendering.

Read [Symfony Integration](/docs/integrations/symfony/) if you want to use Berry in a Symfony application.

## berry/htmx

`berry/htmx` adds fluent methods for <a href="https://htmx.org/" target="_blank" rel="noreferrer">HTMX</a> attributes.

Instead of writing `->attr('hx-post', '/counter')`, you can write `->hxPost('/counter')`.

Read [HTMX Integration](/docs/integrations/htmx/) if you build server-rendered HTMX interfaces.

## berry/alpinejs

`berry/alpinejs` adds fluent methods for <a href="https://alpinejs.dev/" target="_blank" rel="noreferrer">Alpine.js</a> attributes.

Instead of writing `->attr('x-on:click', 'count++')`, you can write `->xOnClick('count++')`.

Read [Alpine.js Integration](/docs/integrations/alpinejs/) if you add small client-side interactions to Berry components.

## Your own integrations

Berry integrations are usually just extension methods plus optional framework glue.

If you want to add methods for another frontend library or internal design system, read [Extensions](/docs/extensions/).
