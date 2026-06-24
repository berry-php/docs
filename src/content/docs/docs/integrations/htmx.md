---
title: HTMX Integration
description: Use fluent HTMX attributes with berry/htmx.
---

`berry/htmx` adds <a href="https://htmx.org/" target="_blank" rel="noreferrer">HTMX</a> methods to Berry HTML elements.

Without it, you can already write HTMX attributes with `attr()`.

```php
button()
    ->attr('hx-post', '/counter')
    ->attr('hx-swap', 'outerHTML')
    ->text('+1');
```

With the integration, this becomes nicer.

```php
use Berry\Htmx\HxSwap;
use function Berry\Html\button;

echo button()
    ->hxPost('/counter')
    ->hxSwap(HxSwap::OuterHTML)
    ->text('+1');
```

## Install

```bash
composer require berry/htmx
```

The package registers its methods automatically through Composer autoloading.

## Request methods

Use the request helpers for HTMX requests.

```php
button()->hxGet('/search')->text('Search');
button()->hxPost('/counter')->text('+1');
button()->hxPut('/profile')->text('Save');
button()->hxPatch('/profile/name')->text('Update name');
button()->hxDelete('/post/1')->text('Delete');
```

These map directly to `hx-get`, `hx-post`, `hx-put`, `hx-patch`, and `hx-delete`.

## Swap

Use `hxSwap()` to control how the response replaces content.

```php
use Berry\Htmx\HxSwap;

button()
    ->hxPost('/counter')
    ->hxSwap(HxSwap::OuterHTML)
    ->text('+1');
```

You can pass the enum or a string.

```php
button()->hxSwap('beforeend');
```

## Target

Use `hxTarget()` to choose where the response goes.

```php
use Berry\Htmx\HxTarget;

button()
    ->hxPost('/counter')
    ->hxTarget('#counter')
    ->text('+1');

button()
    ->hxGet('/details')
    ->hxTarget(HxTarget::This)
    ->text('Load details');
```

## Events

Use `hxOn()` for `hx-on:*` attributes.

```php
button()
    ->hxOn('click', 'console.log("clicked")')
    ->text('Debug');
```

## A small counter

Here is a typical HTMX style component.

```php
use Berry\Html\Elements\Button;
use Berry\Htmx\HxSwap;
use function Berry\Html\button;

function counterButton(int $value): Button
{
    return button()
        ->class('btn')
        ->hxPost('/counter/' . ($value + 1))
        ->hxSwap(HxSwap::OuterHTML)
        ->text('Count: ' . $value);
}
```

In Symfony, this pairs nicely with `toResponse()` from `berry/symfony`.

```php
#[Route('/counter/{value}', name: 'counter')]
public function counter(int $value): Response
{
    return counterButton($value)->toResponse();
}
```

## Other methods

The package includes helpers for most HTMX attributes, including:

- `hxBoost()`
- `hxConfirm()`
- `hxDisable()`
- `hxDisabledElt()`
- `hxDisinherit()`
- `hxEncoding()`
- `hxExt()`
- `hxHeaders()`
- `hxHistory()`
- `hxHistoryElt()`
- `hxInclude()`
- `hxIndicator()`
- `hxParams()`
- `hxPreserve()`
- `hxPrompt()`
- `hxPushUrl()`
- `hxReplaceUrl()`
- `hxRequest()`
- `hxSelect()`
- `hxSelectOob()`
- `hxSwapOob()`
- `hxSync()`
- `hxTrigger()`
- `hxValidate()`
- `hxVals()`

These methods are thin wrappers around HTMX attributes. If you know HTMX, there is not much new to learn here.
