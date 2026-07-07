---
title: Static Analysis
description: Keep your HTML views visible to PHPStan and your editor.
---

One of the biggest advantages of Berry is that your views are PHP.

If your UI is written in a template language or in string concatenation, a lot of it becomes harder for PHP tooling to understand. With Berry, your components are normal functions, normal classes, normal method calls, and normal constructor calls.

That means tools like <a href="https://phpstan.org/" target="_blank" rel="noreferrer">PHPStan</a> can check much more of your view code.

This is a correctness feature, not just a developer-experience feature. If your view code is regular PHP, more mistakes can fail in CI instead of becoming broken HTML in a browser.

## What PHPStan can see

PHPStan can understand things like:

- variables that do not exist in the current scope
- nullable values being used as if they always exist
- missing methods
- wrong argument types
- wrong return types
- invalid constructor calls
- missing classes
- component functions returning the wrong thing
- extension methods once stubs are generated

For example, nullable view data is a very common source of boring bugs.

```php
use DateTimeImmutable;
use Berry\Element;
use function Berry\Html\{article, h2, p};

final readonly class UserSummary
{
    public function __construct(
        public string $name,
        public ?DateTimeImmutable $lastLoginAt,
    ) {
    }
}

function userCard(UserSummary $user): Element
{
    return article()
        ->child(h2()->text($user->name))
        ->child(p()->text(
            'Last login: ' . $user->lastLoginAt->format('Y-m-d')
        ));
}
```

PHPStan can report that `lastLoginAt` might be `null` before this ever becomes a runtime error.

So you have to handle the missing value explicitly:

```php
function userCard(UserSummary $user): Element
{
    $lastLogin = $user->lastLoginAt === null
        ? 'Never'
        : $user->lastLoginAt->format('Y-m-d');

    return article()
        ->child(h2()->text($user->name))
        ->child(p()->text('Last login: ' . $lastLogin));
}
```

Another common one is missing context. In a template, you might use `profile` and only find out later that this specific controller never passed it. In Berry, that data is usually a function argument or constructor parameter.

```php
function accountPage(UserSummary $user): Element
{
    return userCard($profile);
}
```

`$profile` does not exist. That is not a template-context mystery, it is a normal PHP error.

The same applies when a component API changes. If this component grows a required constructor argument:

```php
use Berry\Component;

final class UserCard extends Component
{
    public function __construct(
        private UserSummary $user,
        private bool $showLastLogin,
    ) {
    }

    // ...
}
```

Old call sites like this are now wrong:

```php
echo new UserCard($user);
```

PHPStan can find those call sites. You do not have to click around the application hoping every template still receives the right shape of data.

## Compared to templates

Template languages like Twig are great at what they do, but they are not PHP. You can add tooling around them, but the view layer is still a different language with a different analysis story.

The bugs that tend to hurt are not always fancy ones. A variable exists in one template context but not another. A value is nullable but the template treats it like a string. A DTO changed shape but one partial still expects the old one.

Berry keeps that code in PHP.

This makes refactors much less mysterious. Rename a component class, change a constructor, adjust a method signature, and your normal PHP tools have a chance to help you find the places that need updating.

## Safe HTML builders

Berry also makes the common correct path easy.

```php
use function Berry\Html\p;

echo p()->text($userInput);
```

`text()` escapes the value. Attribute values are escaped by default too.

You can still output raw HTML with `unsafeRaw()` if you explicitly ask for it, but normal Berry code nudges you towards escaped text and element builders instead of manually building HTML strings.

This is not a promise that every possible HTML output is valid or secure. It is a smaller and more useful promise: the normal API points you toward escaped content, typed methods, and PHP-checkable composition.

## Extension methods and stubs

Dynamic extension methods need one extra step for static analysis.

If a package adds methods like `hxPost()` or `xData()` to Berry tags, PHPStan needs generated stubs to understand those signatures.

Berry uses `berry/extension-method-stub-generator` for that. Extension packages can ship a `berry-method-extensions.json` file, and the generator writes the stub files plus a `.berry/extension.neon` include.

The full extension flow, including runtime registration and the JSON file format, is covered on the [Extensions](/docs/extensions/) page.

Include it in your PHPStan config:

```yaml
includes:
    - .berry/extension.neon
```

Packages like [`berry/htmx`](https://github.com/berry-php/htmx) and [`berry/alpinejs`](https://github.com/berry-php/alpinejs) use this so their extension methods are visible to static analysis.

## The point

Berry is not just “HTML as objects”.

The interesting part is that your HTML strings are composed through small PHP builders that your existing PHP tools can understand and check.
