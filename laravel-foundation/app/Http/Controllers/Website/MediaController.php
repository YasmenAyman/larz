<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Models\MediaPost;
use App\Models\PhotoGalleryItem;
use App\Support\WebsiteContent;
use App\Support\LocalizedContent;
use App\Services\SeoMetadataService;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(SeoMetadataService $seo): Response
    {
        $posts = MediaPost::query()->with(['category', 'featuredImage', 'author'])->where('is_published', true)->orderByDesc('published_at')->get();
        $gallery = PhotoGalleryItem::query()->with('media')->where('is_published', true)->orderBy('sort_order')->get();
        $news = LocalizedContent::section(WebsiteContent::section('media', 'news'));
        $stories = LocalizedContent::section(WebsiteContent::section('media', 'stories'));
        $gallerySettings = LocalizedContent::section(WebsiteContent::section('media', 'gallery'));
        $newsletterSettings = LocalizedContent::section(WebsiteContent::section('media', 'newsletter'));

        return Inertia::render('Website/Media/Index', [
            'hero' => LocalizedContent::section(WebsiteContent::section('media', 'hero')),
            'posts' => $posts->map(fn ($post) => $this->present($post))->values()->all(),
            'newsSettings' => [
                'eyebrow' => $news['eyebrow'] ?? 'News & press releases',
                'heading' => $news['heading'] ?? "What's happening at LARZ.",
                'description' => $news['description'] ?? null,
            ],
            'storiesSettings' => [
                'eyebrow' => $stories['eyebrow'] ?? 'Blogs',
                'heading' => $stories['heading'] ?? 'Stories & insight.',
                'description' => $stories['description'] ?? null,
            ],
            'gallerySettings' => [
                'eyebrow' => $gallerySettings['eyebrow'] ?? 'Photo gallery',
                'heading' => $gallerySettings['heading'] ?? 'Inside our communities.',
                'description' => $gallerySettings['description'] ?? null,
            ],
            'newsletterSettings' => [
                'eyebrow' => $newsletterSettings['eyebrow'] ?? 'Newsletter',
                'heading' => $newsletterSettings['heading'] ?? 'Never miss an update.',
                'description' => $newsletterSettings['description'] ?? null,
            ],
            'gallery' => $gallery->map(fn ($item) => WebsiteContent::assetUrl($item->media))->filter()->values()->all(),
            'seo' => $seo->forPage('media', '/media', ['title' => 'Media | LARZ Developments'], [
                $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Media', 'url' => url('/media')]]),
            ]),
        ]);
    }

    public function show(string $post, SeoMetadataService $seo): Response
    {
        $record = MediaPost::query()->with(['category', 'featuredImage', 'openGraphImage', 'author'])->where('slug', $post)->where('is_published', true)->firstOrFail();
        $path = '/media/'.$record->slug;
        $url = url($path);
        $post = $this->present($record);
        return Inertia::render('Website/Media/Show', ['post' => [...$post, 'content' => $post['content'] ?? null], 'seo' => $seo->forMediaPost($record, $path, [
            $seo->breadcrumbs([['name' => 'Home', 'url' => url('/')], ['name' => 'Media', 'url' => url('/media')], ['name' => $record->title, 'url' => $url]]),
            $seo->article($record, $url),
        ])]);
    }

    private function present(MediaPost $post): array
    {
        $localized = LocalizedContent::record($post, ['title', 'excerpt', 'content']);
        return ['slug' => $post->slug, 'type' => $post->type, 'category' => $post->category?->name, 'date' => $post->event_date?->format('d M Y'), 'title' => $localized['title'] ?? $post->title, 'excerpt' => $localized['excerpt'] ?? $post->excerpt, 'content' => $localized['content'] ?? $post->content, 'image' => WebsiteContent::assetUrl($post->featuredImage)];
    }
}
