<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'LARZ Developments') }}</title>

        @if ($seoTitle = data_get($page, 'props.seo.title'))
            <meta inertia="seo-title" name="title" content="{{ $seoTitle }}">
        @endif

        @php
            $favicon = \Illuminate\Support\Facades\Cache::remember('website.settings.public', now()->addHour(), fn () => \App\Models\SiteSetting::query()->whereIn('group_name', ['brand', 'contact', 'footer', 'social', 'whatsapp'])->pluck('value', 'key')->all())['brand.favicon'] ?? null;
        @endphp
        @if ($favicon)
            <link rel="icon" type="image/x-icon" href="{{ $favicon }}">
        @endif

        <!-- LARZ fonts copied from the approved frontend. -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600&family=Cormorant+Garamond:wght@400;500&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
