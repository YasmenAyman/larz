<?php

namespace App\Http\Middleware;

use App\Models\NavigationItem;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Support\LocalizedContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Keep public shared data small and cache the two read-heavy collections.
     * Sensitive or admin-only settings are intentionally not shared globally.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'locale' => app()->getLocale(),
            'dir' => app()->getLocale() === 'ar' ? 'rtl' : 'ltr',
            'site' => [
                'settings' => fn () => Cache::remember(
                    'website.settings.public',
                    now()->addHour(),
                    fn () => SiteSetting::query()->whereIn('group_name', ['brand', 'contact', 'footer', 'social', 'whatsapp'])->pluck('value', 'key')->all(),
                ),
                'navigation' => fn () => Cache::remember(
                    'website.navigation',
                    now()->addHour(),
                    fn () => NavigationItem::query()->where('is_active', true)->orderBy('location')->orderBy('sort_order')->get(['label', 'url', 'location'])->map(fn ($item) => [
                        'label' => $item->label,
                        'url' => $item->url,
                        'location' => $item->location,
                    ])->values()->all(),
                ),
                'projects' => fn () => collect(Cache::remember(
                    'website.mega_menu.projects',
                    now()->addHour(),
                    fn () => Project::query()
                        ->where('is_published', true)
                        ->orderBy('sort_order')
                        ->get(['id', 'title', 'slug', 'translations'])
                        ->all(),
                ))->map(function (Project $project) {
                    $localized = LocalizedContent::record($project, ['title']);

                    return [
                        'id' => $project->id,
                        'title' => $localized['title'] ?? $project->title,
                        'slug' => $project->slug,
                    ];
                })->values()->all(),
            ],
            'auth' => [
                'user' => $request->user() ? [...$request->user()->only(['id', 'name', 'email']), 'permissions' => $request->user()->getAllPermissions()->pluck('name')->values()->all()] : null,
            ],
        ];
    }
}
