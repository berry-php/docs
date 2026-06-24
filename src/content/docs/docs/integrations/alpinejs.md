---
title: Alpine.js Integration
description: Use fluent Alpine.js attributes with berry/alpinejs.
---

`berry/alpinejs` adds <a href="https://alpinejs.dev/" target="_blank" rel="noreferrer">Alpine.js</a> methods to Berry HTML elements.

Without it, you can already write Alpine attributes with `attr()`.

```php
div()
    ->attr('x-data', '{ count: 0 }')
    ->children(
        button()->attr('x-on:click', 'count++')->text('Increment'),
        span()->attr('x-text', 'count'),
    );
```

With the integration, this becomes nicer.

```php
use function Berry\Html\button;
use function Berry\Html\div;
use function Berry\Html\span;

echo div()
    ->xData(['count' => 0])
    ->children(
        button()->xOnClick('count++')->text('Increment'),
        span()->xText('count'),
    );
```

## Install

```bash
composer require berry/alpinejs
```

The package registers its methods automatically through Composer autoloading.

## Component state

Use `xData()` to declare Alpine component state.

```php
div()->xData(['open' => false]);
```

You can pass a PHP array or a JavaScript expression as a string. Arrays are encoded as JSON.

```php
div()->xData(['open' => false, 'count' => 0]);
div()->xData('{ open: false, toggle() { this.open = ! this.open } }');
```

## Bindings

Use `xBind()` for generic `x-bind:*` attributes.

```php
button()
    ->xBind('disabled', 'loading')
    ->text('Save');
```

Common binding shortcuts are available too.

```php
div()
    ->xBindStyle(['display' => 'none'])
    ->xBindKey('item.id');
```

Arrays are encoded as JSON, so they are useful for values that can be represented as data.
Use strings when the value needs to refer to Alpine state or call JavaScript.

```php
div()->xBindClass('{ hidden: ! open }');
```

For example, `['hidden' => '! open']` would become `{"hidden":"! open"}`. Alpine would see the string `! open`, not evaluate `! open` as JavaScript.

## Events

Use `xOn()` for generic `x-on:*` attributes.

```php
button()
    ->xOn('mouseenter', 'hovering = true')
    ->text('Hover me');
```

The package includes shortcuts for common events and modifiers.

```php
button()->xOnClick('count++')->text('Increment');
div()->xOnClickOutside('open = false');
input()->xOnKeydownEscape('open = false');
```

## Text, HTML and models

Use `xText()` and `xHtml()` for dynamic content.

```php
span()->xText('count');
div()->xHtml('content');
```

Use `xModel()` for form state.

```php
input()->xModel('search');
```

## Display and control flow

Use the Alpine display and control-flow directives as methods.

```php
div()->xShow('open')->text('Contents...');
div()->xFor('item in items');
div()->xIf('items.length > 0');
```

## Transitions

Use `xTransition()` without arguments for the plain `x-transition` flag.

```php
div()->xTransition()->xShow('open');
```

Pass a suffix for transition modifiers, or a suffix and expression for transition stages.

```php
div()->xTransition('opacity.duration.200ms');
div()->xTransition(':enter', 'transition ease-out');
```

## A small dropdown

Here is a typical Alpine style component.

```php
use Berry\Html\Element;
use function Berry\Html\button;
use function Berry\Html\div;

function dropdown(): Element
{
    return div()
        ->xData(['open' => false])
        ->children(
            button()
                ->xOnClick('open = ! open')
                ->text('Toggle'),
            div()
                ->xShow('open')
                ->xOnClickOutside('open = false')
                ->xTransition()
                ->text('Contents...'),
        );
}
```

## Other methods

The package includes helpers for most Alpine directives, including:

- `xInit()`
- `xShow()`
- `xBind()`
- `xBindClass()`
- `xBindStyle()`
- `xBindKey()`
- `xOn()`
- `xOnClick()`
- `xOnClickOutside()`
- `xOnSubmit()`
- `xOnInput()`
- `xOnChange()`
- `xOnKeydown()`
- `xOnKeydownEnter()`
- `xOnKeydownEscape()`
- `xOnKeyup()`
- `xOnKeyupEnter()`
- `xOnKeyupEscape()`
- `xText()`
- `xHtml()`
- `xModel()`
- `xModelable()`
- `xFor()`
- `xTransition()`
- `xEffect()`
- `xIgnore()`
- `xRef()`
- `xCloak()`
- `xTeleport()`
- `xIf()`
- `xId()`

These methods are thin wrappers around Alpine attributes. If you know Alpine, there is not much new to learn here.
