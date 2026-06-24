---
title: SVG And XML
description: Render SVG and XML with the same Berry model.
---

Berry is not limited to HTML.

The same basic model also exists for SVG and XML.

## SVG

Import SVG functions from `Berry\Svg`.

```php
use function Berry\Svg\{circle, svg};

echo svg()
    ->attr('viewBox', '0 0 100 100')
    ->child(circle()
        ->attr('cx', '50')
        ->attr('cy', '50')
        ->attr('r', '40')
        ->attr('fill', 'currentColor'));
```

The `svg()` element adds the SVG namespace by default.

## Standalone SVG

If you want a complete standalone SVG document, call `standalone()`.

```php
use function Berry\Svg\svg;

echo svg()
    ->standalone()
    ->attr('viewBox', '0 0 100 100');
```

This adds the XML declaration and SVG doctype.

## XML

For XML, use `xmlElement()` and `xmlRoot()` from `Berry\Xml`.

```php
use function Berry\Xml\{xmlElement, xmlRoot};

echo xmlRoot('rss')
    ->attr('version', '2.0')
    ->child(xmlElement('channel')
        ->child(xmlElement('title')->text('My Feed'))
        ->child(xmlElement('link')->text('https://example.com')));
```

`xmlRoot()` prepends the XML declaration.

## When this is useful

SVG support is useful for inline icons or generated graphics.

XML support is useful for RSS feeds, sitemaps, small integration payloads, or any place where you want to generate XML without manually concatenating strings.

It is the same idea as HTML: build elements, compose them, render a correct string.
