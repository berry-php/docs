---
title: Get Started
description: Install berry/html and render your first HTML from PHP.
---

Berry is a library for writing HTML in PHP.

Not in a template language, but with small element builders that compose into correct HTML strings.

It fits especially well with the hypermedia-focused approach popularized by tools like <a href="https://htmx.org/" target="_blank" rel="noreferrer">HTMX</a> and <a href="https://data-star.dev/" target="_blank" rel="noreferrer">Datastar</a>: the server renders HTML, interactions request more HTML, and the browser swaps it into the page.

That style also leans into <a href="https://htmx.org/essays/locality-of-behaviour/" target="_blank" rel="noreferrer">Locality of Behaviour</a>: the structure of a button, form, or component and the behaviour attached to it can live in one place.

```bash
composer require berry/html
```

## Your first element

Most of the time you will import the functions from `Berry\Html` and start building elements.

```php
<?php

use function Berry\Html\{a, div, h1, p};

$page = div()
    ->class('prose')
    ->child(h1()->text('Hello Berry'))
    ->child(p()->text('This was written in PHP.'))
    ->child(a()
        ->href('https://github.com/berry-php/html')
        ->text('Source code'));

echo $page->toString();
```

This renders something like:

```html
<div class="prose">
    <h1>Hello Berry</h1>
    <p>This was written in PHP.</p>
    <a href="https://github.com/berry-php/html">Source code</a>
</div>
```

The important part here is not the exact formatting. The important part is that the string was assembled through element builders instead of manual concatenation.

## What Berry is good at

Berry is useful when you want to build HTML views in PHP without switching into another language.

It is also a good fit when you want your backend to stay responsible for rendering UI, instead of moving most of that work into a client-side application.

It works especially well for:

- server-rendered components
- MVC controllers
- HTML fragments (HTMX / Datastar)
- hypermedia-oriented applications
- XML/RSS output
- design systems where components are just PHP classes or functions
- views you want to check with <a href="https://phpstan.org/" target="_blank" rel="noreferrer">PHPStan</a>
- HTML you want to compose without hand-concatenating strings

## What Berry is not

Berry is not trying to be a full frontend framework.

There is no virtual DOM, no client-side runtime, and no special template compiler. Berry is just PHP that renders HTML.

This also means you can use normal PHP control flow, normal PHP functions, and normal tests, etc.

## Next

If you are new to Berry, read [Core Concepts](/docs/core-concepts/) next.

If you already get the idea and want to build reusable UI, jump to [Writing Components](/docs/writing-components/).

If static analysis is the part you care about, read [Static Analysis](/docs/static-analysis/).
