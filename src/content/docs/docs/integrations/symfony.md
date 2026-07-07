---
title: Symfony Integration
description: Use Berry components in Symfony controllers, Twig, and forms.
---

`berry/symfony` connects Berry to Symfony.

The core package already works in any PHP application, but the Symfony package adds the things you probably want in a real Symfony project: controller responses, service helpers, Twig integration, and form rendering.

## Install

```bash
composer require berry/symfony
```

## Components

Symfony components extend `Berry\Symfony\View\AbstractComponent`.

```php
<?php

namespace App\View;

use Berry\Element;
use Berry\Symfony\View\AbstractComponent;
use function Berry\Html\{a, article, h1, p};

final class BlogPostTeaser extends AbstractComponent
{
    public function __construct(
        private string $title,
        private string $excerpt,
        private string $slug,
    ) {
    }

    protected function renderComponent(): Element
    {
        return article()
            ->class('post-teaser')
            ->child(h1()->text($this->title))
            ->child(p()->text($this->excerpt))
            ->child(a()
                ->href($this->generateUrl('blog_show', ['slug' => $this->slug]))
                ->text('Read more'));
    }
}
```

`AbstractComponent` extends the normal Berry component, but gives you access to Symfony helpers.

## Controller responses

The bundle adds `toResponse()` to Berry HTML tags and Symfony components.

```php
use App\View\BlogPostTeaser;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/blog/{slug}', name: 'blog_show')]
public function show(string $slug): Response
{
    return new BlogPostTeaser(
        title: 'Hello Symfony',
        excerpt: 'This was rendered with Berry.',
        slug: $slug,
    )->toResponse();
}
```

This is useful for full pages, partials, and hypermedia responses.

## Service helpers

Inside `AbstractComponent`, you can use common Symfony services through helper methods.

- `generateUrl()` for routes
- `asset()` for assets
- `trans()` for translations
- `getUser()` for the current user
- `isGranted()` for security checks
- `createCsrfToken()` for CSRF tokens
- `twig()` and `twigBlock()` for rendering Twig when you need to
- `renderIcon()` when Symfony UX Icons is installed

This keeps simple components simple. If a component gets more complicated, you can still inject services like you would anywhere else in Symfony.

## Twig views

You can expose a Berry component as a Twig function with `#[AsTwigView]`.

```php
<?php

namespace App\View;

use Berry\Element;
use Berry\Symfony\View\AbstractComponent;
use Berry\Symfony\View\Attribute\AsTwigView;
use function Berry\Html\p;

#[AsTwigView(name: 'user_badge')]
final class UserBadge extends AbstractComponent
{
    public function __construct(
        private string $name,
    ) {
    }

    protected function renderComponent(): Element
    {
        return p()
            ->class('user-badge')
            ->text($this->name);
    }
}
```

Then call it from Twig.

```twig
{{ user_badge('Ada') }}
```

The output is marked as safe HTML because Berry already rendered it.

## Constructor arguments

Twig view components can receive normal arguments from Twig.

Object-typed constructor arguments can be resolved from Symfony's service locator, while scalar arguments come from the Twig call.

This means components can still have dependencies without turning every Twig call into a service wiring exercise.

## Forms

`berry/symfony` also includes form rendering.

Use `AbstractForm` when you want to render Symfony forms with Berry components instead of Twig form themes.

The simplest version is a tiny component around a Symfony `FormView`:

```php
<?php

namespace App\View\Form;

use Berry\Element;
use Berry\Symfony\Form\AbstractForm;
use Symfony\Component\Form\FormView;

final class ContactForm extends AbstractForm
{
    public function __construct(
        private FormView $form,
    ) {
    }

    protected function renderComponent(): Element
    {
        return $this->renderForm($this->form);
    }
}
```

And then from a controller:

```php
#[Route('/contact', name: 'contact')]
public function contact(Request $request): Response
{
    $form = $this->createForm(ContactType::class);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
        // ...
    }

    return new ContactForm($form->createView())->toResponse();
}
```

That renders the form using Berry's default Symfony form renderer.

If you want more control, build the form tree yourself:

```php
<?php

namespace App\View\Form;

use Berry\Element;
use Berry\Symfony\Form\AbstractForm;
use Symfony\Component\Form\FormView;
use function Berry\Html\{button, div, h2, p};

final class ContactForm extends AbstractForm
{
    public function __construct(
        private FormView $form,
    ) {
    }

    protected function renderComponent(): Element
    {
        return $this->formStart($this->form, [
            'attr' => ['class' => 'contact-form'],
        ])
            ->child(h2()->text('Contact us'))
            ->child($this->formErrors($this->form))
            ->child($this->formRow($this->form['name']))
            ->child($this->formRow($this->form['email']))
            ->child($this->formRow($this->form['message']))
            ->child(div()
                ->class('form-actions')
                ->child(button()
                    ->type('submit')
                    ->text('Send message')))
            ->child($this->formRest($this->form));
    }
}
```

`formRest()` is important if the form has hidden fields or fields that were not rendered manually yet.

The renderer supports the usual pieces:

- form start
- rows
- widgets
- labels
- help text
- errors
- hidden method spoofing
- rest/unrendered fields
- buttons, checkboxes, radios, choices, and textareas

The point is not to replace Symfony Form, but to render Symfony Form through Berry.
