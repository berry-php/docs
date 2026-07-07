---
title: Extensions
description: Add your own fluent methods to Berry tags.
---

Berry has an extension method system.

This lets another package add methods to Berry tags without changing `berry/html` itself.

On this page we will build a tiny `berry/cats` package. It adds methods like `purr()`, `catMood()`, `nap()`, and `stareAt()` to Berry tags, and it shows the full extension flow from runtime registration to editor and <a href="https://phpstan.org/" target="_blank" rel="noreferrer">PHPStan</a> support.

## What we are building

The goal is to make code like this work:

```php
use Berry\Cats\CatMood;
use Berry\Cats\NapSpot;
use function Berry\Html\div;

echo div()
    ->purr()
    ->catMood(CatMood::Judging)
    ->nap(NapSpot::Sunbeam)
    ->stareAt('the treat cupboard', 10)
    ->text('This div has opinions.');
```

Berry resolves those method calls at runtime after you register them with `addMethod()`.

## The custom types

Enums work well here because extension methods can accept predefined types instead of plain strings, which makes calls easier to read and helps developers make fewer mistakes.

```php
namespace Berry\Cats;

enum CatMood: string
{
    case Judging = 'judging';
    case Chaotic = 'chaotic';
    case Sleepy = 'sleepy';
}

enum NapSpot: string
{
    case Sunbeam = 'sunbeam';
    case Keyboard = 'keyboard';
    case FreshLaundry = 'fresh-laundry';
}
```

Extension methods can use enums, value objects, or scalar types in their signatures.

## Registering methods

Extension methods are registered with `addMethod()`.

```php
use Berry\Cats\CatMood;
use Berry\Html\HtmlTag;
use Berry\Html\HtmlVoidTag;

HtmlTag::addMethod('purr', function (HtmlTag $node): HtmlTag {
    return $node->attr('data-cat-purr', 'true');
});

HtmlVoidTag::addMethod('purr', function (HtmlVoidTag $node): HtmlVoidTag {
    return $node->attr('data-cat-purr', 'true');
});

HtmlTag::addMethod('catMood', function (HtmlTag $node, CatMood $mood): HtmlTag {
    return $node->attr('data-cat-mood', $mood->value);
});

HtmlVoidTag::addMethod('catMood', function (HtmlVoidTag $node, CatMood $mood): HtmlVoidTag {
    return $node->attr('data-cat-mood', $mood->value);
});
```

After registration, Berry tags can respond to `->purr()` and `->catMood(...)`.

## Returning the node

Most extension methods should return the node again so the API stays chainable.

```php
use Berry\Cats\NapSpot;
use Berry\Html\HtmlTag;
use Berry\Html\HtmlVoidTag;

HtmlTag::addMethod('nap', function (HtmlTag $node, NapSpot $spot): HtmlTag {
    return $node->attr('data-cat-nap', $spot->value);
});

HtmlVoidTag::addMethod('nap', function (HtmlVoidTag $node, NapSpot $spot): HtmlVoidTag {
    return $node->attr('data-cat-nap', $spot->value);
});

HtmlTag::addMethod('stareAt', function (HtmlTag $node, string $target, int $seconds = 3): HtmlTag {
    return $node
        ->attr('data-cat-target', $target)
        ->attr('data-cat-stare-seconds', (string) $seconds);
});

HtmlVoidTag::addMethod('stareAt', function (HtmlVoidTag $node, string $target, int $seconds = 3): HtmlVoidTag {
    return $node
        ->attr('data-cat-target', $target)
        ->attr('data-cat-stare-seconds', (string) $seconds);
});
```

Then the full chain works:

```php
use Berry\Cats\CatMood;
use Berry\Cats\NapSpot;
use function Berry\Html\div;

div()
    ->purr()
    ->catMood(CatMood::Judging)
    ->nap(NapSpot::Sunbeam)
    ->stareAt('the treat cupboard', 10)
    ->class('cat')
    ->text('Waiting with purpose.');
```

## Where to register methods

Register methods on the most specific class that makes sense.

- `AbstractTag` if the method should exist on all tags
- `HtmlTag` if it should exist on normal HTML tags
- `HtmlVoidTag` if it should exist on void HTML tags
- a concrete element class if it only makes sense there

For `berry/cats`, registering on both `HtmlTag` and `HtmlVoidTag` makes sense, otherwise a method might work on `div()` but not on `input()`.

## Packaging the extension

Collect the registration in one installer class.

```php
<?php declare(strict_types=1);

namespace Berry\Cats;

use Closure;
use Berry\Html\HtmlTag;
use Berry\Html\HtmlVoidTag;

final class BerryCats
{
    public static function install(): void
    {
        HtmlTag::addMethod('purr', self::purr());
        HtmlVoidTag::addMethod('purr', self::purr());

        HtmlTag::addMethod('catMood', self::catMood());
        HtmlVoidTag::addMethod('catMood', self::catMood());

        HtmlTag::addMethod('nap', self::nap());
        HtmlVoidTag::addMethod('nap', self::nap());

        HtmlTag::addMethod('stareAt', self::stareAt());
        HtmlVoidTag::addMethod('stareAt', self::stareAt());
    }

    private static function purr(): Closure
    {
        return function (HtmlTag|HtmlVoidTag $node): HtmlTag|HtmlVoidTag {
            return $node->attr('data-cat-purr', 'true');
        };
    }

    private static function catMood(): Closure
    {
        return function (HtmlTag|HtmlVoidTag $node, CatMood $mood): HtmlTag|HtmlVoidTag {
            return $node->attr('data-cat-mood', $mood->value);
        };
    }

    private static function nap(): Closure
    {
        return function (HtmlTag|HtmlVoidTag $node, NapSpot $spot): HtmlTag|HtmlVoidTag {
            return $node->attr('data-cat-nap', $spot->value);
        };
    }

    private static function stareAt(): Closure
    {
        return function (HtmlTag|HtmlVoidTag $node, string $target, int $seconds = 3): HtmlTag|HtmlVoidTag {
            return $node
                ->attr('data-cat-target', $target)
                ->attr('data-cat-stare-seconds', (string) $seconds);
        };
    }
}
```

Then an autoloaded bootstrap file can install the extension:

```php
use Berry\Cats\BerryCats;

BerryCats::install();
```

To have Composer load that file, add it to `autoload.files`:

```json
{
    "autoload": {
        "files": [
            "src/bootstrap.php"
        ]
    }
}
```

Once Composer loads that file, the methods are available.

## Static analysis

Dynamic methods work at runtime, but editors and static analyzers still need a description of their signatures.

For packages, add a `berry-method-extensions.json` file and use `berry/extension-method-stub-generator` to generate stubs.

### The extension JSON file

`berry-method-extensions.json` is a single JSON object with an `extensions` array.

Each entry in `extensions` describes one group of methods. Usually this matches the methods you already registered at runtime.

- `namespace`: the namespace for the generated stub class, usually `Berry\\Html`
- `class`: one class name or a list of class names, for example `["HtmlTag", "HtmlVoidTag"]`
- `uses`: optional imports for custom types used in method signatures
- `methods`: the methods that should appear in generated stubs

Each method usually contains:

- `name`: the method name
- `doc`: a short description used in the generated `@method` annotation
- `returns`: usually `static` so chaining is preserved
- `args`: a list of arguments

Each argument can contain:

- `name`: the parameter name
- `type`: a PHP type string
- `defaultValue`: an optional default value written as PHP code, for example `3` or `null`

This file does not register methods. It describes the method signatures for the stub generator.

Here is the same `berry/cats` extension described for tooling:

```json
{
    "extensions": [
        {
            "namespace": "Berry\\Html",
            "class": ["HtmlTag", "HtmlVoidTag"],
            "uses": ["Berry\\Cats\\CatMood", "Berry\\Cats\\NapSpot"],
            "methods": [
                {
                    "name": "purr",
                    "doc": "Adds a completely unnecessary purring aura",
                    "returns": "static",
                    "args": []
                },
                {
                    "name": "catMood",
                    "doc": "Sets the emotional state of the element",
                    "returns": "static",
                    "args": [
                        {
                            "type": "CatMood",
                            "name": "mood"
                        }
                    ]
                },
                {
                    "name": "nap",
                    "doc": "Marks the element as napping in a preferred location",
                    "returns": "static",
                    "args": [
                        {
                            "type": "NapSpot",
                            "name": "spot"
                        }
                    ]
                },
                {
                    "name": "stareAt",
                    "doc": "Stares at something for an optional number of seconds",
                    "returns": "static",
                    "args": [
                        {
                            "type": "string",
                            "name": "target"
                        },
                        {
                            "type": "int",
                            "name": "seconds",
                            "defaultValue": "3"
                        }
                    ]
                }
            ]
        }
    ]
}
```

This JSON mirrors the runtime methods above and shows the main ideas:

- one extension can target both `HtmlTag` and `HtmlVoidTag`
- `uses` lets the generated stub import enums or other custom PHP types
- methods can have no arguments, typed arguments, and optional arguments with defaults

The generator scans installed packages, writes files into `.berry/stubs`, and creates `.berry/extension.neon` for <a href="https://phpstan.org/" target="_blank" rel="noreferrer">PHPStan</a>.

```yaml
includes:
    - .berry/extension.neon
```

That is enough for editors and PHPStan to understand the cat methods.

## Real world examples

For production examples, look at [`berry/htmx`](https://github.com/berry-php/htmx) and [`berry/alpinejs`](https://github.com/berry-php/alpinejs).

- [`berry/htmx`](https://github.com/berry-php/htmx) is a larger example with custom types imported through `uses`
- [`berry/alpinejs`](https://github.com/berry-php/alpinejs) is a simpler example with a lot of straightforward method signatures

They use the same overall pattern.
