<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;

final class WebsiteCache
{
    public const SETTINGS_KEY = 'website.settings.public';
    public const NAVIGATION_KEY = 'website.navigation';

    public static function sectionKey(string $page, string $section): string
    {
        return 'website.section.'.$page.'.'.$section;
    }

    public static function projectKey(string $slug): string
    {
        return 'website.project.'.$slug;
    }

    public static function settings(): void
    {
        Cache::forget(self::SETTINGS_KEY);
    }

    public static function navigation(): void
    {
        Cache::forget(self::NAVIGATION_KEY);
    }

    public static function section(string $page, string $section): void
    {
        Cache::forget(self::sectionKey($page, $section));
    }

    public static function project(string $slug): void
    {
        Cache::forget(self::projectKey($slug));
    }

    public static function mediaGallery(): void
    {
        Cache::forget(self::sectionKey('media', 'gallery'));
        Cache::forget(self::sectionKey('home', 'gallery'));
    }

    public static function mediaSections(): void
    {
        Cache::forget(self::sectionKey('media', 'news'));
        Cache::forget(self::sectionKey('media', 'stories'));
        Cache::forget(self::sectionKey('media', 'gallery'));
        Cache::forget(self::sectionKey('media', 'newsletter'));
        Cache::forget(self::sectionKey('media', 'hero'));
        Cache::forget(self::sectionKey('home', 'gallery'));
    }

    public static function projectTree(string $slug): void
    {
        Cache::forget(self::projectKey($slug));
        Cache::forget('website.project-tree.'.$slug);
    }

    public static function projectsIndex(): void
    {
        Cache::forget('website.featured_projects');
        Cache::forget('website.projects.index');
    }

    public static function sitemap(): void
    {
        Cache::forget('website.sitemap');
    }

    public static function homepage(): void
    {
        Cache::forget(self::sectionKey('home', 'gallery'));
        Cache::forget(self::sectionKey('home', 'featured_projects'));
        Cache::forget(self::sectionKey('home', 'testimonials'));
        Cache::forget(self::sectionKey('home', 'stats'));
        Cache::forget(self::sectionKey('home', 'hero'));
        Cache::forget(self::sectionKey('home', 'final_cta'));
    }

    public static function all(): void
    {
        self::settings();
        self::navigation();
        self::mediaSections();
        self::homepage();
        self::sitemap();
        self::projectsIndex();
    }
}
