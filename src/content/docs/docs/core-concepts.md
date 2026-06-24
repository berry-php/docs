---
title: Core Concepts
description: Compose correct HTML strings with small element builders.
---

Berry is mostly about composing correct HTML strings with small element builders.

Instead of writing markup in a separate template language, you build elements with typed PHP objects. That gives you normal PHP tooling: autocomplete, refactoring, type checks, and static analysis.

The rendered result is still just HTML, but the path to that string is more structured than manually appending fragments together.

Berry tries to make a few things correct by default:

- text goes through escaping when you use `text()`
- attributes are escaped by default
- common attributes have named helpers
- components have normal PHP signatures
- invalid method calls can be caught by your editor or <a href="https://phpstan.org/" target="_blank" rel="noreferrer">PHPStan</a>

## Element

The base interface is `Berry\Element`.

An element has a `toString()` method and can be cast to a string.

```php
interface Element extends Stringable
{
    public function toString(): string;
}
```

Tags, components, fragments, text nodes, SVG elements, and XML elements are all elements.

## Tags

Most HTML elements are represented by tags.

```php
use function Berry\Html\button;

$button = button()
    ->type('submit')
    ->class('btn')
    ->text('Save');
```

This renders:

```html
<button type="submit" class="btn">Save</button>
```

There are two important tag types internally:

- `Tag` renders an opening tag, body, and closing tag
- `VoidTag` renders a tag without children, like `input()` or `img()`

You normally do not need to create these classes yourself. Use the helper functions instead.

## Helper functions

Berry ships helper functions for most HTML elements.

```php
use function Berry\Html\{article, h2, p};

$post = article()
    ->child(h2()->text('Hello'))
    ->child(p()->text('This is a post.'));
```

These functions return typed element objects, so elements can expose useful methods like `href()`, `src()`, `type()`, `disabled()`, and so on.

You are not just moving strings around, you are calling methods on concrete element builders.

## Children

Elements can have children.

```php
use function Berry\Html\{li, ul};

$list = ul()
    ->child(li()->text('First'))
    ->child(li()->text('Second'));
```

Children are rendered into the parent element.

If you already have a list of elements, use `children()`.

```php
$items = ['First', 'Second', 'Third'];

$list = ul()->children(array_map(
    fn (string $item) => li()->text($item),
    $items,
));
```

For multiple elements without a wrapper, use a fragment.

```php
use function Berry\fragment;
use function Berry\Html\{h1, p};

$content = fragment(
    h1()->text('Title'),
    p()->text('Body'),
);
```

## Components

Components are classes for rendering more complex UI elements.

They let you hide a whole tree of elements behind a small PHP API. This is useful when a piece of UI has enough structure, state, or behaviour that a plain function starts to feel cramped.

```php
use Berry\Component;
use Berry\Element;
use function Berry\Html\button;

final class CounterButton extends Component
{
    public function __construct(
        private int $value,
    ) {
    }

    protected function renderComponent(): Element
    {
        return button()
            ->class('btn')
            ->text('+' . $this->value);
    }
}
```

Because components are just PHP classes, they can also expose their own methods and act like small builders themselves.

```php
use Berry\Component;
use Berry\Element;
use function Berry\Html\p;

final class Greeter extends Component
{
    private ?string $name = null;

    public function __construct(
        private string $greeting = "Hello",
    ) {
    }

    public function greet(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    protected function renderComponent(): Element
    {
        return p()->text($this->greeting . ' ' . $this->name);
    }
}

echo new Greeter(greeting: 'Hallo')
    ->greet(name: 'Peter')
    ->toString();
```

This is not something every component needs, but it can be a nice way to express more domain-specific UI builders without dropping back to string concatenation.

## Rendering model

Berry renders HTML strings.

When you call methods like `text()`, `child()`, or `attr()`, the object stores enough information to render the final HTML. When you call `toString()`, the element returns the HTML string.

The difference from hand-written strings is that most mistakes become normal PHP mistakes. Misspelled methods, wrong argument types, missing classes, and invalid component constructor calls can be found by your editor or PHPStan.

This is the main trade: you still get plain HTML at the end, but the code that creates it is easier to check for correctness.

There is no client runtime. If you need interactivity, pair Berry with normal browser APIs, <a href="https://alpinejs.dev/" target="_blank" rel="noreferrer">Alpine</a>, <a href="https://htmx.org/" target="_blank" rel="noreferrer">HTMX</a>, or whatever you already use.

Berry is intentionally boring here. It works well with hypermedia tools like HTMX and <a href="https://data-star.dev/" target="_blank" rel="noreferrer">Datastar</a> because those tools want server-rendered HTML anyway.

This also helps with <a href="https://htmx.org/essays/locality-of-behaviour/" target="_blank" rel="noreferrer">Locality of Behaviour</a>. A component can keep its structure, styling hooks, and hypermedia attributes in one place, instead of scattering the behaviour across several files.
