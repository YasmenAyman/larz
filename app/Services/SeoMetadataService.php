<?php

namespace App\Services;

use App\Models\MediaPost;
use App\Models\Project;
use App\Models\SeoMetadata;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

final class SeoMetadataService
{
    private array $metadata = [];

    public function preload(array $pageKeys): void
    {
        $missing = array_values(array_diff($pageKeys, array_keys($this->metadata)));
        if ($missing === []) return;

        $records = SeoMetadata::query()->with('ogImage')->whereIn('page_key', $missing)->get()->keyBy('page_key');
        foreach ($missing as $pageKey) $this->metadata[$pageKey] = $records->get($pageKey);
    }

    public function forPage(string $pageKey, string $path, array $fallback = [], array $structuredData = []): array
    {
        return $this->resolve($pageKey, $path, $fallback, $structuredData);
    }

    public function forProject(Project $project, string $path, array $structuredData = []): array
    {
        return $this->resolve('project:'.$project->id, $path, [
            'title' => $project->seo_title ?: $project->title.' | LARZ Developments',
            'description' => $project->seo_description ?: $project->short_description ?: $project->description,
            'canonical' => $project->canonical_url,
            'robots' => $project->robots,
            'og_title' => $project->title.' | LARZ Developments',
            'og_description' => $project->short_description ?: $project->description,
            'og_image' => app(MediaUploadService::class)->publicUrl($project->heroImage),
        ], $structuredData);
    }

    public function forMediaPost(MediaPost $post, string $path, array $structuredData = []): array
    {
        return $this->resolve('media:'.$post->id, $path, [
            'title' => $post->seo_title ?: $post->title.' | LARZ Developments',
            'description' => $post->seo_description ?: $post->excerpt,
            'canonical' => $post->canonical_url,
            'robots' => $post->robots,
            'og_title' => $post->title.' | LARZ Developments',
            'og_description' => $post->excerpt,
            'og_image' => app(MediaUploadService::class)->publicUrl($post->openGraphImage ?: $post->featuredImage),
        ], $structuredData);
    }

    public function staticPageKeys(): array
    {
        return ['home', 'about', 'projects', 'media', 'careers', 'contact'];
    }

    public function breadcrumbs(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)->values()->map(fn ($item, $index) => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ])->all(),
        ];
    }

    public function article(MediaPost $post, string $url): array
    {
        $image = app(MediaUploadService::class)->publicUrl($post->openGraphImage ?: $post->featuredImage);

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $post->title,
            'description' => $post->excerpt,
            'url' => $url,
            'datePublished' => $post->published_at?->toIso8601String(),
            'dateModified' => $post->updated_at?->toIso8601String(),
            'image' => $image,
            'author' => $post->author ? ['@type' => 'Person', 'name' => $post->author->name] : ['@type' => 'Organization', 'name' => config('app.name')],
            'publisher' => ['@type' => 'Organization', 'name' => config('app.name')],
        ]);
    }

    public function projectSchema(Project $project, string $url): ?array
    {
        if (! $project->project_type || ! Str::contains(Str::lower($project->project_type), 'residential')) {
            return null;
        }

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Residence',
            'name' => $project->title,
            'description' => $project->description ?: $project->short_description,
            'url' => $url,
            'image' => app(MediaUploadService::class)->publicUrl($project->heroImage),
            'address' => $project->address ?: $project->location,
        ]);
    }

    private function resolve(string $pageKey, string $path, array $fallback, array $structuredData): array
    {
        $this->preload([$pageKey]);
        $record = $this->metadata[$pageKey] ?? null;
        $defaults = $this->defaults();

        $robots = $record
            ? ($record->indexable ? 'index' : 'noindex').', '.($record->followable ? 'follow' : 'nofollow')
            : ($fallback['robots'] ?? $defaults['robots']);

        $data = [
            'title' => $record?->seo_title ?: ($fallback['title'] ?? $defaults['title']),
            'description' => $record?->meta_description ?: ($fallback['description'] ?? $defaults['description']),
            'canonical' => $record?->canonical_url ?: ($fallback['canonical'] ?? url($path)),
            'og_title' => $record?->og_title ?: ($fallback['og_title'] ?? ($fallback['title'] ?? $defaults['og_title'])),
            'og_description' => $record?->og_description ?: ($fallback['og_description'] ?? ($fallback['description'] ?? $defaults['og_description'])),
            'og_image' => $record?->ogImage ? app(MediaUploadService::class)->publicUrl($record->ogImage) : ($fallback['og_image'] ?? $defaults['og_image']),
            'robots' => $robots,
            'indexable' => ! str_starts_with($robots, 'noindex'),
            'followable' => ! str_ends_with($robots, 'nofollow'),
            'structured_data' => array_values(array_filter($structuredData)),
        ];

        return $data;
    }

    private function defaults(): array
    {
        return Cache::remember('seo.defaults', now()->addHour(), function () {
        $settings = SiteSetting::query()->whereIn('key', [
            'seo.default_title', 'seo.default_description', 'seo.default_og_title',
            'seo.default_og_description', 'seo.default_og_image', 'seo.default_robots',
        ])->pluck('value', 'key');

        $ogImage = $settings['seo.default_og_image'] ?? null;
        if ($ogImage && ! Str::startsWith($ogImage, ['http://', 'https://', '/'])) {
            $ogImage = asset('assets/'.basename($ogImage));
        }

        return [
            'title' => $settings['seo.default_title'] ?? config('app.name'),
            'description' => $settings['seo.default_description'] ?? 'LARZ Developments builds considered communities and places to live.',
            'og_title' => $settings['seo.default_og_title'] ?? ($settings['seo.default_title'] ?? config('app.name')),
            'og_description' => $settings['seo.default_og_description'] ?? ($settings['seo.default_description'] ?? null),
            'og_image' => $ogImage,
            'robots' => $settings['seo.default_robots'] ?? 'index, follow',
        ];
        });
    }
}
