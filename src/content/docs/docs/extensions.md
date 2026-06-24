---
title: Extensions
description: Add your own fluent methods to Berry tags.
---

Berry has an extension method system.

This lets another package add methods to Berry tags without changing `berry/html` itself. For instance the <a href="https://htmx.org/" target="_blank" rel="noreferrer">HTMX</a> integration is built this way.

## A small extension

Extension methods are registered with `addMethod()`.

```php
use Berry\Html\HtmlTag;
use Berry\Html\HtmlVoidTag;

HtmlTag::addMethod('xData', function (HtmlTag $node, string $value): HtmlTag {
    return $node->attr('x-data', $value);
});

HtmlVoidTag::addMethod('xData', function (HtmlVoidTag $node, string $value): HtmlVoidTag {
    return $node->attr('x-data', $value);
});
```

Now you can call the method on HTML tags.

```php
use function Berry\Html\div;

echo div()
    ->xData('{ open: false }')
    ->text('Hello');
```

The method does not really exist on the class. Berry catches the call and forwards it to the registered closure.

## Returning the node

Most extension methods should return the node again so the API stays chainable.

```php
HtmlTag::addMethod('wireClick', function (HtmlTag $node, string $action): HtmlTag {
    return $node->attr('wire:click', $action);
});
```

Then you can keep chaining.

```php
button()
    ->wireClick('save')
    ->class('btn')
    ->text('Save');
```

## Where to register methods

Register methods on the most specific class that makes sense.

- `AbstractTag` if the method should exist on all tags
- `HtmlTag` if it should exist on normal HTML tags
- `HtmlVoidTag` if it should exist on void HTML tags
- a concrete element class if it only makes sense there

Most HTML-focused extensions should register on both `HtmlTag` and `HtmlVoidTag`, otherwise the method might work on `div()` but not on `input()`.

## Package bootstrap

An extension package usually registers methods from a Composer autoloaded file.

The HTMX package does this through `src/bootstrap.php`, which calls its installer. That means the methods are available after Composer loads the package.

The rough shape looks like this:

```php
final class MyExtension
{
    public static function install(): void
    {
        $methods = [
            'myMethod' => fn ($node, string $value) => $node->attr('my-attr', $value),
        ];

        foreach ($methods as $name => $method) {
            HtmlTag::addMethod($name, $method);
            HtmlVoidTag::addMethod($name, $method);
        }
    }
}
```

## Static analysis

Dynamic methods are nice at runtime, but static analyzers and editors can not automatically know about them.

For packages, add a `berry-method-extensions.json` file and use `berry/extension-method-stub-generator` to generate stubs.

The generator scans installed packages, writes files into `.berry/stubs`, and creates `.berry/extension.neon` for <a href="https://phpstan.org/" target="_blank" rel="noreferrer">PHPStan</a>.

```yaml
includes:
    - .berry/extension.neon
```

The HTMX integration includes this metadata, so its methods can be discovered by tooling.

## Look at berry/htmx

If you want to build your own integration package, `berry/htmx` is the best example to copy.

It registers a list of methods like `hxPost()`, `hxTarget()`, and `hxSwap()` on both normal and void HTML tags, then describes those methods for the stub generator.

That is basically the whole pattern.
