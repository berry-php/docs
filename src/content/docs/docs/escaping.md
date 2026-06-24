---
title: Escaping
description: How Berry escapes text and attributes, and where you still need to be careful.
---

Berry escapes the common things by default, but it does not magically make all HTML safe.

The short version is: use `text()` for user content, use `attr()` normally, and only use raw HTML when you really mean it.

This is part of Berry's correctness story. Most HTML bugs and security issues around rendering start with “just put this string in there”. Berry tries to make the common path more explicit.

## Text is escaped

`text()` escapes HTML special characters.

```php
use function Berry\Html\p;

echo p()->text('<script>alert("nope")</script>');
```

Renders:

```html
<p>&lt;script&gt;alert(&quot;nope&quot;)&lt;/script&gt;</p>
```

This is what you want for user provided content.

## Raw HTML

Use `unsafeRaw()` if you really want to insert raw HTML.

```php
use function Berry\Html\div;

echo div()->unsafeRaw('<strong>Hello</strong>');
```

This renders the HTML as-is.

```html
<div><strong>Hello</strong></div>
```

The name is intentionally loud. If this contains user input, you probably have a bug.

## Text elements

Outside of tags, Berry also has helper functions for text nodes.

```php
use function Berry\{text, unsafeRawText};
use function Berry\fragment;

echo fragment(
    text('Escaped <content>'),
    unsafeRawText('<strong>Raw content</strong>'),
);
```

Again, prefer `text()` unless you know the HTML is safe.

## Attributes are escaped

Attribute values are escaped by default.

```php
use function Berry\Html\button;

echo button()
    ->attr('title', 'Save "draft"')
    ->text('Save');
```

Attribute names are also sanitized by default. They are lowercased and stripped of invalid characters.

## What Berry does not do

Berry does not validate whether an attribute value is safe for the browser.

This matters for things like URLs and JavaScript event attributes.

```php
echo button()
    ->attr('onclick', 'alert(1)')
    ->text('Click me');
```

Berry will render that because you explicitly asked for it.

This is useful for legitimate cases, but it also means you should not pass untrusted values into event handler attributes, `javascript:` URLs, or raw HTML.

## A decent rule

Use this as a default:

- user text goes into `text()`
- user values in attributes go through normal `attr()` or typed helpers
- raw HTML only comes from trusted sources
- do not put user input into JavaScript attributes
- validate URLs yourself if users can provide them

Berry tries to make the normal thing safe, but it still lets you write HTML. That means it also lets you write unsafe HTML if you ask it to.

In other words: Berry helps you compose correct HTML, but it does not remove judgement from the places where HTML itself is dangerous.
