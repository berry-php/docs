---
title: Writing Components
description: Write reusable Berry UI as plain PHP functions or classes.
---

You will probably not write your whole page as one giant `div()` chain.

Technically you can, but it gets annoying pretty quickly. The nice thing about Berry is that components are just PHP, so you can start with a plain function and only move to a class once that becomes useful.

## Function components

The simplest component is just a function that returns an element.

```php
<?php

use Berry\Element;
use function Berry\Html\{article, h2, p};

function blogCard(string $title, string $excerpt): Element
{
    return article()
        ->class('blog-card')
        ->child(h2()->text($title))
        ->child(p()->text($excerpt));
}
```

Use it like any other element.

```php
use function Berry\Html\main;

echo main()
    ->child(blogCard('Hello', 'This is my first post.'));
```

This is usually where you should start.

## Class components

If a component grows, extend `Berry\Component`.

A class component renders a tree of Berry elements from `renderComponent()`. From the outside it is still just an element, but internally it can have constructor arguments, private methods, dependencies, and whatever small API makes sense for that piece of UI.

```php
<?php

use Berry\Component;
use Berry\Element;
use function Berry\Html\{a, article, h2, p};

final class BlogCard extends Component
{
    public function __construct(
        private string $title,
        private string $excerpt,
        private string $url,
    ) {
    }

    protected function renderComponent(): Element
    {
        return article()
            ->class('blog-card')
            ->child(h2()->text($this->title))
            ->child(p()->text($this->excerpt))
            ->child(a()
                ->href($this->url)
                ->text('Read more'));
    }
}
```

Use it like this:

```php
echo new BlogCard(
    title: 'Writing HTML in PHP',
    excerpt: 'Turns out this can be quite nice.',
    url: '/blog/writing-html-in-php',
);
```

The important bit is that the component hides the nested element tree. Callers do not need to know if `BlogCard` renders an `article()`, three children, ten children, or a conditional footer. They only need the PHP API you decided to expose.

## Components as builders

Components can also have their own methods.

This can be useful when the component has a more domain-specific API than the underlying HTML elements.

```php
<?php

use Berry\Component;
use Berry\Element;
use function Berry\Html\p;

final class Greeter extends Component
{
    private ?string $name = null;

    public function __construct(
        private string $greeting,
    ) {
    }

    public function greet(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    protected function renderComponent(): Element
    {
        return p()
            ->class('greeting')
            ->text($this->greeting . ' ' . $this->name);
    }
}
```

Use it like this:

```php
echo new Greeter(greeting: 'Hallo')
    ->greet(name: 'Peter')
    ->toString();
```

This renders an element tree, but the caller gets to use a small API that matches the component instead of assembling the underlying paragraph manually.

You probably do not want to overdo this. If a constructor is enough, use a constructor. But for some components, fluent methods can make the component read like a small, correct builder for a specific UI element.

## Passing children

You can pass children into your own functions or classes like any other value.

```php
use Berry\Element;
use function Berry\Html\section;

function panel(Element $child): Element
{
    return section()
        ->class('panel')
        ->child($child);
}
```

For multiple children, accept an array.

```php
use Berry\Element;
use function Berry\Html\div;

/** @param Element[] $children */
function stack(array $children): Element
{
    return div()
        ->class('stack')
        ->children($children);
}
```

## Returning fragments

Sometimes a component should return multiple elements without adding a wrapper.

```php
use Berry\Element;
use function Berry\fragment;
use function Berry\Html\{h1, p};

function pageHeader(string $title, string $subtitle): Element
{
    return fragment(
        h1()->text($title),
        p()->text($subtitle),
    );
}
```

## Testing components

Since components render strings, testing can be very boring, which is good.

```php
it('renders a blog card', function () {
    $html = new BlogCard('Title', 'Excerpt', '/post')->toString();

    expect($html)->toContain('Title');
    expect($html)->toContain('href="/post"');
});
```

If the exact output matters, assert the exact string. If the structure matters more than whitespace, assert important parts.

## Functions or classes?

Use functions when the component is small and has no dependencies.

Use classes when the component has state, dependencies, or belongs to a larger application structure.

In Symfony applications you will usually extend the Symfony integration's `AbstractComponent`, which is covered in [Symfony Integration](/docs/integrations/symfony/).
