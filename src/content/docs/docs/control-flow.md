---
title: Control Flow
description: Render conditionals and lists with PHP or Berry's small helper methods.
---

Berry does not invent a template control-flow language.

You already have PHP.

## Plain PHP is fine

For larger branches, normal PHP is often easiest to read.

```php
use Berry\Element;
use function Berry\Html\{a, p};

function authLink(?User $user): Element
{
    if ($user === null) {
        return a()->href('/login')->text('Login');
    }

    return p()->text('Hello ' . $user->name);
}
```

There is no shame in doing this. Berry components are PHP code.

## childWhen

For small optional children, `childWhen()` is nice.

```php
use function Berry\Html\{button, div, p};

echo div()
    ->child(p()->text('Profile'))
    ->childWhen($canEdit, fn () => button()->text('Edit'));
```

You can also pass an else branch.

```php
echo div()->childWhen(
    $user !== null,
    fn () => p()->text('Welcome back'),
    fn () => p()->text('Please log in'));
```

## children

Use `children()` with an array of elements.

```php
use function Berry\Html\{li, ul};

$items = ['One', 'Two', 'Three'];

echo ul()->children(array_map(
    fn (string $item) => li()->text($item),
    $items,
));
```

You can also prepare the array separately if that reads better.

```php
$children = [];

foreach ($posts as $post) {
    $children[] = li()->text($post->title);
}

echo ul()->children($children);
```

## map

`map()` lets you continue modifying an element in a callback.

```php
use function Berry\Html\button;

echo button()
    ->class('btn')
    ->map(function ($button) use ($isDanger) {
        if ($isDanger) {
            return $button->class('btn-danger');
        }

        return $button->class('btn-primary');
    })
    ->text('Delete');
```

This is useful when the branch is about modifying the current element.

## mapWhen

For smaller conditional modifications, use `mapWhen()`.

```php
echo button()
    ->class('btn')
    ->mapWhen($disabled, fn ($button) => $button->disabled()->class('btn-disabled'))
    ->text('Save');
```

## classWhen

For conditional classes specifically, prefer `classWhen()`.

```php
echo button()
    ->class('btn')
    ->classWhen($primary, 'btn-primary')
    ->classWhen($danger, 'btn-danger')
    ->text('Save');
```

## When to use what

Use plain PHP when the branch is important or large.

Use `childWhen()` for optional children.

Use `mapWhen()` for optional changes to the current element.

Use `classWhen()` for conditional classes.

The goal is readable PHP, not using every fluent method just because it exists.
