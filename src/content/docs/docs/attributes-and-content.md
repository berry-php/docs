---
title: Attributes And Content
description: Add text, children, attributes, classes, and styles to Berry elements.
---

Berry elements are built by chaining methods.

This page covers the methods you will use all the time. It is not a complete list of every HTML attribute helper.

The general rule is: prefer the most specific builder method available, then fall back to `attr()` when you need something custom.

Specific methods give your editor and static analysis tools more to work with. `->href('/docs')` is easier to check and autocomplete than `->attr('href', '/docs')`, and both are better than manually concatenating `href="..."` into a string.

## Text

Use `text()` to add escaped text content.

```php
use function Berry\Html\p;

echo p()->text('Hello <World>');
```

Renders:

```html
<p>Hello &lt;World&gt;</p>
```

## Children

Use `child()` for one child.

```php
use function Berry\Html\{div, strong};

echo div()
    ->child(strong()->text('Important'));
```

Use `children()` for many children.

```php
use function Berry\Html\{li, ul};

$items = ['PHP', 'HTML', 'HTMX'];

echo ul()->children(array_map(
    fn (string $item) => li()->text($item),
    $items,
));
```

## Attributes

Use `attr()` for arbitrary attributes.

```php
use function Berry\Html\button;

echo button()
    ->attr('data-controller', 'counter')
    ->attr('data-action', 'click->counter#increment')
    ->text('+1');
```

This is useful for custom attributes, JavaScript libraries, hypermedia libraries, and integrations.

## Flags

Use `flag()` for attributes that do not need a value.

```php
use function Berry\Html\input;

echo input()
    ->type('checkbox')
    ->flag('checked');
```

Some elements also have typed helpers for common flags.

```php
echo input()
    ->type('checkbox')
    ->checked();
```

## Typed helpers

Many elements expose helpers for common attributes.

```php
use function Berry\Html\{a, button, input};

$link = a()
    ->href('/docs')
    ->target('_blank')
    ->text('Docs');

$button = button()
    ->type('submit')
    ->disabled()
    ->text('Save');

$input = input()
    ->name('email')
    ->placeholder('you@example.com')
    ->required();
```

These helpers are mostly convenience methods around attributes.

They also make the generated HTML a bit more correct by construction. You can still use arbitrary attributes when you need to, but the common path does not require remembering every attribute name as a string.

## Classes

Use `class()` to add classes.

```php
use function Berry\Html\div;

echo div()
    ->class('card')
    ->class('card-highlighted');
```

You can pass an array too.

```php
echo div()->class(['card', 'card-highlighted']);
```

Berry deduplicates classes for you.

```php
echo div()
    ->class('card')
    ->class('card');
```

Renders only one `card` class.

## Conditional classes

Use `classWhen()` when a class depends on a condition.

```php
echo div()
    ->class('alert')
    ->classWhen($isError, 'alert-error', else: 'alert-info');
```

You can also remove classes.

```php
echo div()
    ->class('btn btn-primary')
    ->removeClass('btn-primary');
```

## Styles

Use `style()` with an array.

```php
echo div()
    ->style([
        'display' => 'grid',
        'gap' => '1rem',
    ]);
```

Calling `style()` again merges the styles. Later values overwrite earlier values.

```php
echo div()
    ->style(['color' => 'red'])
    ->style(['color' => 'blue']);
```

## Data attributes

For `data-*` attributes, use `data()`.

```php
echo button()
    ->data('controller', 'counter')
    ->data('action', 'click->counter#increment')
    ->text('+1');
```

## Custom attributes

Berry does not need to know about every frontend library.

If you need an attribute, use `attr()`.

```php
echo button()
    ->attr('x-on:click', 'open = true')
    ->attr('wire:click', 'save')
    ->text('Open');
```

For a nicer fluent API, you can write an extension method. See [Extensions](/docs/extensions/).

This is also enough to use libraries like <a href="https://data-star.dev/" target="_blank" rel="noreferrer">Datastar</a> directly, even without a dedicated Berry integration package.
